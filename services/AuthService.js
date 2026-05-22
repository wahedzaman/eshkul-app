import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import Strings from '../constants/Strings';
import AppSession from './AppSession';

class AuthService {
  static async login(username, password) {
    const payload = {
      InstituteId: Strings.DEFAULT_INSTITUTE_ID,
      UserName: username,
      Password: password,
    };

    const response = await NetworkManager.post(ApiWrapper.ENDPOINTS.LOGIN, payload);

    if (!response.success) {
      return { success: false, type: 'error', error: response.error };
    }

    // The API returns HTTP 200 and 'null' when login fails
    if (response.data === null) {
      return { success: false, type: 'failed', error: 'invalid_credentials' };
    }

    // Populate singleton AppSession
    AppSession.setSession(response.data);

    return { success: true, data: response.data };
  }
}

export default AuthService;
