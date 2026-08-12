import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import Institute from '../models/Institute';

class InstituteService {
  static async fetchInstitutes(groupCode) {
    const params = {
      IsActive: true,
      groupCode,
    };

    const response = await NetworkManager.get(
      ApiWrapper.ENDPOINTS.INSTITUTE_CODE,
      params,
    );

    if (!response.success || !Array.isArray(response.data)) {
      return { success: false, error: response.error || 'fetch_failed' };
    }

    const institutes = response.data.map(item => new Institute(item));
    return { success: true, data: institutes };
  }
}

export default InstituteService;
