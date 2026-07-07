import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import AppSession from './AppSession';
import Homework from '../models/Homework';

class HomeworkService {
  static async fetchHomework(startDate, endDate) {
    // If dates are not provided, default to a reasonable range like last 7 days to next 7 days
    if (!startDate || !endDate) {
      const today = new Date();

      const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

      const start = new Date(today);
      start.setDate(today.getDate() - dayOfWeek);

      const end = new Date(today);
      end.setDate(today.getDate() + (6 - dayOfWeek));

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      if (!startDate) startDate = formatDate(start);
      if (!endDate) endDate = formatDate(end);
    }

    const params = {
      // startDate: startDate,
      // endDate: endDate,
      startDate: '2026-06-17',
      endDate: '2026-07-23',
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
