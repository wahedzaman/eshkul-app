import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import AppSession from './AppSession';
import Homework from '../models/Homework';
import Strings from '../constants/Strings';

class HomeworkService {
  static async fetchHomework(startDate, endDate) {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const today = new Date();

    if (!endDate) {
      endDate = formatDate(today);
    }

    if (!startDate) {
      const startDateObj = new Date(today);
      startDateObj.setDate(today.getDate() - 6);
      startDate = formatDate(startDateObj);
    }

    const isStudent = AppSession.userType === Strings.USER_TYPES.STUDENT;

    const params = {
      startDate: startDate,
      endDate: endDate,
    };

    let endpoint = ApiWrapper.ENDPOINTS.HOMEWORK_STUDENT;

    if (!isStudent) {
      endpoint = ApiWrapper.ENDPOINTS.HOMEWORK_TEACHER;
      if (AppSession.academicSessionId) {
        params.academicSessionId = AppSession.academicSessionId;
      }
    }

    const headers = {
      'Authorization': AppSession.token || '',
    };

    const response = await NetworkManager.get(
      endpoint,
      params,
      headers,
      ApiWrapper.APP_API_BASE_URL
    );

    if (response.success && response.data) {
      const data = response.data;
      const list = Array.isArray(data) ? data : (data.GetAllforStudent || data.data || []);
      const parsedHomeworks = list.map(item => new Homework(item));
      return { success: true, data: parsedHomeworks };
    }

    return { success: false, error: response.error || 'Failed to fetch homework' };
  }
}

export default HomeworkService;
