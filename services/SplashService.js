import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import AppSession from './AppSession';
import StudentService from './StudentService';
import EmployeeService from './EmployeeService';
import AccountManager from './AccountManager';

class SplashService {
  static async checkSession() {
    try {
      const sessionData = await StorageManager.getItem(Strings.STORAGE_KEYS.USER_SESSION);
      if (!sessionData) {
        return false;
      }

      // Restore session data in-memory
      AppSession.setSession(sessionData);

      // If Student (UserType 11), fetch details
      if (sessionData.UserType === Strings.USER_TYPES.STUDENT) {
        const studentRes = await StudentService.fetchAndPersistDetails(sessionData.Id, sessionData.Token);
        if (studentRes.success) {
          await AccountManager.migrateIfNeeded();
          return true;
        } else {
          // If details fetch fails, reset session and clear storage
          await AppSession.clearSession();
          return false;
        }
      } else {
        const employeeRes = await EmployeeService.fetchAndPersistDetails(sessionData.Id, sessionData.Token);
        if (employeeRes.success) {
          await AccountManager.migrateIfNeeded();
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
