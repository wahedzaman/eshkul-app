import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import AppSession from './AppSession';
import StudentService from './StudentService';
import EmployeeService from './EmployeeService';
import AccountManager from './AccountManager';
import CacheService from './CacheService';
import InstituteService from './InstituteService';
import FirebaseService from './FirebaseService';

class SplashService {
  static async ensureInstituteCache() {
    if (AppSession.instituteCache.length > 0) {
      console.log("[SplashService] has code: ", AppSession.instituteCache[0].code);
      return;
    }

    const stored = await StorageManager.getItem(Strings.STORAGE_KEYS.INSTITUTE_CACHE);
    if (Array.isArray(stored) && stored.length > 0) {
      console.log("[SplashService] has stored instituteCache: ", stored);
      AppSession.setInstituteCache(stored);
      return;
    }

    const result = await InstituteService.fetchInstitutes(Strings.STORAGE_KEYS.GROUP_CODE);
    if (result.success && result.data.length > 0) {
      console.log("[SplashService] Fetched instituteCache: ", result.data);
      AppSession.setInstituteCache(result.data);
      await StorageManager.setItem(Strings.STORAGE_KEYS.INSTITUTE_CACHE, result.data);
    }
  }

  static async checkSession() {
    try {
      await SplashService.ensureInstituteCache();

      const sessionData = await StorageManager.getItem(Strings.STORAGE_KEYS.USER_SESSION);
      if (!sessionData) {
        return false;
      }

      AppSession.setSession(sessionData);

      if (sessionData.UserType === Strings.USER_TYPES.STUDENT) {
        const studentRes = await StudentService.fetchAndPersistDetails(sessionData.Id, sessionData.Token);
        if (studentRes.success) {
          await CacheService.fetchAndPersistLoginCache(sessionData.Token);
          await AccountManager.migrateIfNeeded();
          FirebaseService.initialize();
          return true;
        } else {
          await AppSession.clearSession();
          return false;
        }
      } else {
        const employeeRes = await EmployeeService.fetchAndPersistDetails(sessionData.Id, sessionData.Token);
        if (employeeRes.success) {
          await CacheService.fetchAndPersistLoginCache(sessionData.Token);
          await AccountManager.migrateIfNeeded();
          FirebaseService.initialize();
          return true;
        } else {
          await AppSession.clearSession();
          return false;
        }
      }
    } catch (error) {
      console.error('SplashService checkSession Error:', error);
      await AppSession.clearSession();
      return false;
    }
  }
}

export default SplashService;
