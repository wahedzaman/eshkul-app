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

  clearSession() {
    this.token = null;
    this.rights = [];
    this.userName = '';
    this.userSmallImage = '';
    this.userType = null;
    this.id = null;
    this.siblings = [];
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const instance = new AppSession();
export default instance;
