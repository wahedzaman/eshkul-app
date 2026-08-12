import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import AppSession from './AppSession';
import Homework from '../models/Homework';

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

    const params = {
      startDate: startDate,
      endDate: endDate,
    };

    const headers = {
      'Authorization': AppSession.token || '',
    };

    const response = await NetworkManager.get(
      ApiWrapper.ENDPOINTS.HOMEWORK_STUDENT,
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
