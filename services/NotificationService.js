import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import AppSession from './AppSession';
import Notification from '../models/Notification';

class NotificationService {
  static async fetchNotifications() {
    const today = new Date();

    const fromDateObj = new Date(today);
    fromDateObj.setMonth(fromDateObj.getMonth() - 3);
    const fYear = fromDateObj.getFullYear();
    const fMonth = String(fromDateObj.getMonth() + 1).padStart(2, '0');
    const fDay = String(fromDateObj.getDate()).padStart(2, '0');
    const fDate = `${fYear}-${fMonth}-${fDay}`;

    const toDateObj = new Date(today);
    toDateObj.setMonth(toDateObj.getMonth() + 3);
    const tYear = toDateObj.getFullYear();
    const tMonth = String(toDateObj.getMonth() + 1).padStart(2, '0');
    const tDay = String(toDateObj.getDate()).padStart(2, '0');
    const tDate = `${tYear}-${tMonth}-${tDay}`;

    const params = {
      employeeId: AppSession.id || 304396,
      fDate: fDate,
      tDate: tDate,
      notificationTypeId: 103,
    };

    const headers = {
      'Authorization': AppSession.token || '',
    };

    const response = await NetworkManager.get(
      ApiWrapper.ENDPOINTS.NOTIFICATIONS,
      params,
      headers,
      ApiWrapper.APP_API_BASE_URL
    );

    if (response.success && response.data) {
      const data = response.data;
      const list = Array.isArray(data) ? data : (data.Notifications || data.DetailsByUserId || data.data || []);
      const parsedNotifications = list.map(item => new Notification(item));
      return { success: true, data: parsedNotifications };
    }

    return { success: false, error: response.error || 'Failed to fetch notifications' };
  }
}

export default NotificationService;
