import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import AppSession from './AppSession';
import Employee from '../models/Employee';
import EmployeeAddress from '../models/EmployeeAddress';

class EmployeeService {
  static async fetchAndPersistDetails(employeeId, token) {
    const headers = {
      'Authorization': token,
    };

    const response = await NetworkManager.get(
      `${ApiWrapper.ENDPOINTS.EMPLOYEE_DETAILS}?id=${employeeId}`,
      {},
      headers,
      ApiWrapper.APP_API_BASE_URL
    );

    if (response.success && response.data && response.data.Employee) {
      await StorageManager.setItem(Strings.STORAGE_KEYS.EMPLOYEE_DETAILS, response.data);

      const employee = new Employee(response.data.Employee);
      const addresses = (response.data.Addresses || []).map(a => new EmployeeAddress(a));
      AppSession.setEmployee(employee, addresses);

      return { success: true, employee, addresses };
    }

    return { success: false, error: response.error || 'Failed to fetch employee profile details' };
  }
}

export default EmployeeService;
