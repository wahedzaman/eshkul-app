import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import AppSession from './AppSession';
import Student from '../models/Student';
import StudentService from './StudentService';

class AccountManager {
  static async getAccounts() {
    const accounts = await StorageManager.getItem(Strings.STORAGE_KEYS.MULTI_ACCOUNTS);
    return accounts || [];
  }

  static async addAccount(sessionData, studentData = null) {
    const accounts = await this.getAccounts();

    const entry = {
      id: sessionData.Id,
      userName: sessionData.UserName || '',
      userSmallImage: sessionData.UserSmallImage || '',
      userType: sessionData.UserType || null,
      sessionData,
      studentData,
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
    }

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
    if (sessionData.UserType === Strings.USER_TYPES.STUDENT) {
      studentData = await StorageManager.getItem(Strings.STORAGE_KEYS.STUDENT_DETAILS);
    }

    await this.addAccount(sessionData, studentData);
  }
}

export default AccountManager;
