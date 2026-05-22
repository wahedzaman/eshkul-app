import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import AppSession from './AppSession';

class SplashService {
  static async checkSession() {
    try {
      const sessionData = await StorageManager.getItem(Strings.STORAGE_KEYS.USER_SESSION);
      if (sessionData) {
        // Restore singleton session values
        AppSession.setSession(sessionData);
        return true;
      }
    } catch (error) {
      console.error('SplashService checkSession Error:', error);
    }
    return false;
  }
}

export default SplashService;
