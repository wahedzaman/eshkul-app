import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageManager {
  static async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`StorageManager setItem Error for key ${key}:`, error);
      return false;
    }
  }

  static async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`StorageManager getItem Error for key ${key}:`, error);
      return null;
    }
  }

  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`StorageManager removeItem Error for key ${key}:`, error);
      return false;
    }
  }

  static async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('StorageManager clear Error:', error);
      return false;
    }
  }
}

export default StorageManager;
