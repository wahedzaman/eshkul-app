import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import Student from '../models/Student';
import Employee from '../models/Employee';
import EmployeeAddress from '../models/EmployeeAddress';
import Institute from '../models/Institute';

class AppSession {
  constructor() {
    if (AppSession.instance) {
      return AppSession.instance;
    }
    this.token = null;
    this.rights = [];
    this.userName = '';
    this.userSmallImage = '';
    this.userType = null;
    this.id = null;
    this.siblings = [];
    this.student = null;
    this.employee = null;
    this.employeeAddresses = [];
    this.academicSessionId = null;
    this.instituteCache = [];

    AppSession.instance = this;
  }

  get instituteId() {
    return this.instituteCache[0]?.id ?? null;
  }

  setSession(data) {
    this.token = data.Token || null;
    this.userName = data.UserName || '';
    this.userSmallImage = data.UserSmallImage || '';
    this.userType = data.UserType || null;
    this.id = data.Id || null;
    this.siblings = data.Siblings || [];

    if (data.Rights) {
      this.rights = typeof data.Rights === 'string'
        ? data.Rights.split(',').map(r => r.trim())
        : data.Rights;
    } else {
      this.rights = [];
    }
  }

  setStudent(student) {
    this.student = student;
  }

  setEmployee(employee, addresses = []) {
    this.employee = employee;
    this.employeeAddresses = addresses;
  }

  setInstituteCache(institutes) {
    this.instituteCache = institutes;
  }

  async loadSession() {
    try {
      const data = await StorageManager.getItem(Strings.STORAGE_KEYS.USER_SESSION);
      if (data) {
        this.setSession(data);
        
        // Load persistent student details if profile exists
        if (data.UserType === Strings.USER_TYPES.STUDENT) {
          const studentData = await StorageManager.getItem(Strings.STORAGE_KEYS.STUDENT_DETAILS);
          if (studentData && studentData.Student) {
            this.student = new Student(studentData.Student);
          }
        } else {
          const employeeData = await StorageManager.getItem(Strings.STORAGE_KEYS.EMPLOYEE_DETAILS);
          if (employeeData && employeeData.Employee) {
            this.employee = new Employee(employeeData.Employee);
            this.employeeAddresses = (employeeData.Addresses || []).map(a => new EmployeeAddress(a));
          }
        }
        
        const sessionId = await StorageManager.getItem(Strings.STORAGE_KEYS.ACADEMIC_SESSION_ID);
        if (sessionId) {
          this.academicSessionId = sessionId;
        }

        const cachedInstitutes = await StorageManager.getItem(Strings.STORAGE_KEYS.INSTITUTE_CACHE);
        if (Array.isArray(cachedInstitutes) && cachedInstitutes.length > 0) {
          this.instituteCache = cachedInstitutes.map(i => new Institute(i));
        }

        return true;
      }
    } catch (error) {
      console.error('AppSession loadSession Error:', error);
    }
    return false;
  }

  async clearSession() {
    this.token = null;
    this.rights = [];
    this.userName = '';
    this.userSmallImage = '';
    this.userType = null;
    this.id = null;
    this.siblings = [];
    this.student = null;
    this.employee = null;
    this.employeeAddresses = [];
    this.academicSessionId = null;
    this.instituteCache = [];
    try {
      await StorageManager.removeItem(Strings.STORAGE_KEYS.USER_SESSION);
      await StorageManager.removeItem(Strings.STORAGE_KEYS.STUDENT_DETAILS);
      await StorageManager.removeItem(Strings.STORAGE_KEYS.EMPLOYEE_DETAILS);
      await StorageManager.removeItem(Strings.STORAGE_KEYS.ACADEMIC_SESSION_ID);
      await StorageManager.removeItem(Strings.STORAGE_KEYS.INSTITUTE_CACHE);
    } catch (error) {
      console.error('AppSession clearSession Error:', error);
    }
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const instance = new AppSession();
export default instance;
