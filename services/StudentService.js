import NetworkManager from './NetworkManager';
import ApiWrapper from '../constants/ApiWrapper';
import StorageManager from './StorageManager';
import Strings from '../constants/Strings';
import AppSession from './AppSession';
import Student from '../models/Student';

class StudentService {
  static async fetchAndPersistDetails(studentId, token) {
    const headers = {
      'Authorization': token,
    };
    
    const response = await NetworkManager.get(
      ApiWrapper.ENDPOINTS.STUDENT_DETAILS,
      { id: studentId },
      headers,
      ApiWrapper.APP_API_BASE_URL
    );

    if (response.success && response.data && response.data.Student) {
      // Cache details in persistent storage
      await StorageManager.setItem(Strings.STORAGE_KEYS.STUDENT_DETAILS, response.data);
      
      // Map data and update the global AppSession
      const student = new Student(response.data.Student);
      AppSession.setStudent(student);
      
      return { success: true, student };
    }

    return { success: false, error: response.error || 'Failed to fetch student profile details' };
  }
}

export default StudentService;
