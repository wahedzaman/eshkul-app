import StorageManager from './StorageManager';
import Strings from '../constants/Strings';

class AppSession {
  constructor() {
    if (AppSession.instance) {
      return AppSession.instance;
    }
    this.token = null;
    this.rights = [];
    this.userName = '';
    this.userSmallImage = '';
    this.userType = null;
    this.id = null;
    this.siblings = [];

    AppSession.instance = this;
  }

  setSession(data) {
    this.token = data.Token || null;
    this.userName = data.UserName || '';
    this.userSmallImage = data.UserSmallImage || '';
    this.userType = data.UserType || null;
    this.id = data.Id || null;
    this.siblings = data.Siblings || [];

    if (data.Rights) {
      this.rights = typeof data.Rights === 'string'
        ? data.Rights.split(',').map(r => r.trim())
        : data.Rights;
    } else {
      this.rights = [];
    }
  }

  async loadSession() {
    try {
      const data = await StorageManager.getItem(Strings.STORAGE_KEYS.USER_SESSION);
      if (data) {
        this.setSession(data);
        return true;
      }
    } catch (error) {
      console.error('AppSession loadSession Error:', error);
    }
    return false;
  }

  async clearSession() {
    this.token = null;
    this.rights = [];
    this.userName = '';
    this.userSmallImage = '';
    this.userType = null;
    this.id = null;
    this.siblings = [];
    try {
      await StorageManager.removeItem(Strings.STORAGE_KEYS.USER_SESSION);
    } catch (error) {
      console.error('AppSession clearSession Error:', error);
    }
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const instance = new AppSession();
export default instance;
