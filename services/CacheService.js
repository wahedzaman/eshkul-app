import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import AppSession from './AppSession';

class CacheService {
  static async fetchAndPersistLoginCache(token) {
    const headers = {
      'Authorization': token,
    };
    
    const response = await NetworkManager.get(
      ApiWrapper.ENDPOINTS.LOGIN_CACHE,
      {},
      headers
    );

    if (response.success && response.data) {
      if (response.data.AcademicSessionList && response.data.AcademicSessionList.length > 0) {
        const sessionId = response.data.AcademicSessionList[0].Key;
        await StorageManager.setItem(Strings.STORAGE_KEYS.ACADEMIC_SESSION_ID, sessionId);
        AppSession.academicSessionId = sessionId;
      }
      return { success: true };
    }

    return { success: false, error: response.error || 'Failed to fetch login cache' };
  }
}

export default CacheService;
