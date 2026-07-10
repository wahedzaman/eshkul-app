import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import Student from '../models/Student';
import Employee from '../models/Employee';
import EmployeeAddress from '../models/EmployeeAddress';

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

    AppSession.instance = this;
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
    try {
      await StorageManager.removeItem(Strings.STORAGE_KEYS.USER_SESSION);
      await StorageManager.removeItem(Strings.STORAGE_KEYS.STUDENT_DETAILS);
      await StorageManager.removeItem(Strings.STORAGE_KEYS.EMPLOYEE_DETAILS);
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
