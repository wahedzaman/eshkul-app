import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import AppSession from './AppSession';

class AttendanceService {
  static async fetchAttendanceReport(startDateTime = null, endDateTime = null, studentId = null) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const now = new Date();

    if (!endDateTime) {
      endDateTime = formatDate(now);
    }

    if (!startDateTime) {
      const startDateObj = new Date(now);
      startDateObj.setDate(now.getDate() - 9);
      startDateTime = formatDate(startDateObj);
    }

    if (!studentId && AppSession.student) {
      studentId = AppSession.student.studentId;
    }

    const headers = {};
    if (AppSession.token) {
      headers['Authorization'] = AppSession.token;
    }

    const response = await NetworkManager.get(
      ApiWrapper.ENDPOINTS.ATTENDANCE,
      { startDateTime, endDateTime, studentId },
      headers,
      ApiWrapper.APP_API_BASE_URL
    );

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error || 'Failed to fetch attendance report' };
  }

  static calculateStats(attendanceData) {
    if (!attendanceData || !Array.isArray(attendanceData)) {
      return { present: 0, absent: 0, late: 0, total: 0, percentage: 0 };
    }

    let present = 0;
    let absent = 0;
    let late = 0;

    attendanceData.forEach(record => {
      if (record.Flag === 'P') present++;
      else if (record.Flag === 'A') absent++;
      else if (record.Flag === 'L') late++;
    });

    const total = present + absent + late;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, late, total, percentage };
  }

  static getTodayStatus(attendanceData) {
    if (!attendanceData || !Array.isArray(attendanceData)) {
      return { status: null, date: new Date() };
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const todayRecord = attendanceData.find(record => {
      const recordDate = record.AttendanceDate?.split('T')[0];
      return recordDate === todayStr;
    });

    const statusMap = { P: 'present', A: 'absent', L: 'late' };
    return {
      status: todayRecord ? (statusMap[todayRecord.Flag] || null) : null,
      date: today,
    };
  }

  static getMonthLabel(attendanceData) {
    if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
      const now = new Date();
      return now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }

    const date = new Date(attendanceData[0].AttendanceDate);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }
}

export default AttendanceService;
