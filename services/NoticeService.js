import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import AppSession from './AppSession';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateDMY(date) {
  const d = date.getDate();
  const m = MONTHS[date.getMonth()];
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

class NoticeService {
  static async fetchNotices() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 120);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 120);

    const userInfoTypeId = AppSession.userType || 11;

    const endpoint = `${ApiWrapper.ENDPOINTS.NOTICE}?userInfoTypeId=${userInfoTypeId}`;

    const body = {
      startDateModel: formatDateDMY(startDate),
      endDateModel: formatDateDMY(endDate),
    };

    const headers = {
      'Authorization': AppSession.token || '',
    };

    const response = await NetworkManager.post(
      endpoint,
      body,
      headers,
      ApiWrapper.APP_API_BASE_URL
    );

    if (response.success && response.data) {
      const list = Array.isArray(response.data.SearchData) ? response.data.SearchData : [];
      return { success: true, data: list };
    }

    return { success: false, error: response.error || 'Failed to fetch notices' };
  }
}

export default NoticeService;
