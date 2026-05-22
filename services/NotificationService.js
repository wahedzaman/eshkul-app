import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import AppSession from './AppSession';
import Notification from '../models/Notification';

class NotificationService {
  static async fetchNotifications() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const tDate = `${year}-${month}-${day}`;

    const params = {
      employeeId: AppSession.id || 304396,
      fDate: '2020-01-01',
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
