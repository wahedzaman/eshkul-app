import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import Strings from '../constants/Strings';
import AppSession from './AppSession';
import StorageManager from './StorageManager';
import StudentService from './StudentService';
import EmployeeService from './EmployeeService';
import AccountManager from './AccountManager';

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

    // Persist session to storage
    await StorageManager.setItem(Strings.STORAGE_KEYS.USER_SESSION, response.data);

    // If student, fetch and persist details immediately during login
    let studentData = null;
    let employeeData = null;
    if (response.data.UserType === Strings.USER_TYPES.STUDENT) {
      const studentRes = await StudentService.fetchAndPersistDetails(response.data.Id, response.data.Token);
      if (!studentRes.success) {
        await AppSession.clearSession();
        return { success: false, type: 'failed', error: 'student_details_failed' };
      }
      studentData = await StorageManager.getItem(Strings.STORAGE_KEYS.STUDENT_DETAILS);
    } else {
      const employeeRes = await EmployeeService.fetchAndPersistDetails(response.data.Id, response.data.Token);
      if (!employeeRes.success) {
        await AppSession.clearSession();
        return { success: false, type: 'failed', error: 'employee_details_failed' };
      }
      employeeData = await StorageManager.getItem(Strings.STORAGE_KEYS.EMPLOYEE_DETAILS);
    }

    await AccountManager.addAccount(response.data, studentData, employeeData);

    return { success: true, data: response.data };
  }
}

export default AuthService;
