import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import AppSession from './AppSession';
import Student from '../models/Student';
import Employee from '../models/Employee';
import EmployeeAddress from '../models/EmployeeAddress';
import StudentService from './StudentService';
import EmployeeService from './EmployeeService';
import CacheService from './CacheService';

class AccountManager {
  static async getAccounts() {
    const accounts = await StorageManager.getItem(Strings.STORAGE_KEYS.MULTI_ACCOUNTS);
    return accounts || [];
  }

  static async addAccount(sessionData, studentData = null, employeeData = null) {
    const accounts = await this.getAccounts();

    const entry = {
      id: sessionData.Id,
      userName: sessionData.UserName || '',
      userSmallImage: sessionData.UserSmallImage || '',
      userType: sessionData.UserType || null,
      sessionData,
      studentData,
      employeeData,
    };

    const existingIndex = accounts.findIndex(a => a.id === entry.id);
    if (existingIndex !== -1) {
      accounts[existingIndex] = entry;
    } else {
      accounts.push(entry);
    }

    await StorageManager.setItem(Strings.STORAGE_KEYS.MULTI_ACCOUNTS, accounts);
  }

  static async removeAccount(accountId) {
    let accounts = await this.getAccounts();
    accounts = accounts.filter(a => a.id !== accountId);
    await StorageManager.setItem(Strings.STORAGE_KEYS.MULTI_ACCOUNTS, accounts);
    return accounts;
  }

  static async switchTo(accountId) {
    const accounts = await this.getAccounts();
    const target = accounts.find(a => a.id === accountId);
    if (!target) {
      return { success: false, error: 'account_not_found' };
    }

    AppSession.setSession(target.sessionData);
    await StorageManager.setItem(Strings.STORAGE_KEYS.USER_SESSION, target.sessionData);

    if (target.sessionData.UserType === Strings.USER_TYPES.STUDENT) {
      AppSession.setEmployee(null, []);
      await StorageManager.removeItem(Strings.STORAGE_KEYS.EMPLOYEE_DETAILS);

      const studentRes = await StudentService.fetchAndPersistDetails(
        target.sessionData.Id,
        target.sessionData.Token
      );
      if (!studentRes.success && target.studentData && target.studentData.Student) {
        const student = new Student(target.studentData.Student);
        AppSession.setStudent(student);
        await StorageManager.setItem(Strings.STORAGE_KEYS.STUDENT_DETAILS, target.studentData);
      }
    } else {
      AppSession.setStudent(null);
      await StorageManager.removeItem(Strings.STORAGE_KEYS.STUDENT_DETAILS);

      const employeeRes = await EmployeeService.fetchAndPersistDetails(
        target.sessionData.Id,
        target.sessionData.Token
      );
      if (!employeeRes.success && target.employeeData && target.employeeData.Employee) {
        const employee = new Employee(target.employeeData.Employee);
        const addresses = (target.employeeData.Addresses || []).map(a => new EmployeeAddress(a));
        AppSession.setEmployee(employee, addresses);
        await StorageManager.setItem(Strings.STORAGE_KEYS.EMPLOYEE_DETAILS, target.employeeData);
      }
    }

    await CacheService.fetchAndPersistLoginCache(target.sessionData.Token);

    return { success: true };
  }

  static getActiveAccountId() {
    return AppSession.id;
  }

  static async migrateIfNeeded() {
    const accounts = await this.getAccounts();
    if (accounts.length > 0) {
      return;
    }

    if (!AppSession.isAuthenticated()) {
      return;
    }

    const sessionData = await StorageManager.getItem(Strings.STORAGE_KEYS.USER_SESSION);
    if (!sessionData) {
      return;
    }

    let studentData = null;
    let employeeData = null;
    if (sessionData.UserType === Strings.USER_TYPES.STUDENT) {
      studentData = await StorageManager.getItem(Strings.STORAGE_KEYS.STUDENT_DETAILS);
    } else {
      employeeData = await StorageManager.getItem(Strings.STORAGE_KEYS.EMPLOYEE_DETAILS);
    }

    await this.addAccount(sessionData, studentData, employeeData);
  }
}

export default AccountManager;
