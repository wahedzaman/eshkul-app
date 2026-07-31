export default {
  BASE_URL: 'https://eshkulcache.projuktinext.com',
  APP_API_BASE_URL: 'https://eshkulappapi.projuktinext.com',
  API_CONTENT_URL_PREFIX: 'https://content.eshkul.com',
  ENDPOINTS: {
    LOGIN: '/api/auth/Login',
    LOGIN_CACHE: '/api/Cache',
    PASSWORD_CHANGE: '/api/usersecurity/passwordchange',
    PASSWORD_CHANGE_CONFIRM: '/api/Cache/CacheUserInfo',
    STUDENT_DETAILS: '/api/student/details',
    EMPLOYEE_DETAILS: '/api/employee/details',
    NOTIFICATIONS: '/api/Notification/DetailsByUserId',
    ACADEDMIC_CALENDAR: '/api/AcademicCalendar',
    ATTENDANCE: '/api/student/AttendanceDetails',
    NOTICE: '/api/notice/listbyuser',
    TIMETABLE_STUDENT: '/api/Routine/Student',
    HOMEWORK_STUDENT: '/api/VcrDairy/GetAllforStudent'
  },
};
