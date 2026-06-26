import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import AppSession from './AppSession';
import AcademicCalendar from '../models/AcademicCalendar';

class AcademicCalendarService {
  static async fetchCalendarEvents() {
    const student = AppSession.student;

    const params = {
      instituteId: student?.instituteId || 95,
      academicBranchId: student?.currentAcademicBranchId || 50,
      academicSessionId: student?.currentAcademicSessionId || 20250028,
    };

    const headers = {
      'Authorization': AppSession.token || '',
    };

    const response = await NetworkManager.get(
      ApiWrapper.ENDPOINTS.ACADEDMIC_CALENDAR,
      params,
      headers,
      ApiWrapper.APP_API_BASE_URL
    );

    if (response.success && response.data) {
      const list = Array.isArray(response.data) ? response.data : (response.data.data || []);
      const parsedEvents = list.map(item => new AcademicCalendar(item));
      return { success: true, data: parsedEvents };
    }

    return { success: false, error: response.error || 'Failed to fetch academic calendar' };
  }
}

export default AcademicCalendarService;
