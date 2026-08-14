import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class FirebaseService {
  static pushToken = null;
  static fcmToken = null;
  static isInitialized = false;

  static async initialize() {
    try {
      if (!Device.isDevice) {
        console.log('[FirebaseService] Push notifications require a physical device');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('[FirebaseService] Notification permission not granted');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0f5279',
        });
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (projectId) {
        const expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId });
        FirebaseService.pushToken = expoPushToken.data;
        console.log('[FirebaseService] Expo push token:', expoPushToken.data);
      }

      const devicePushToken = await Notifications.getDevicePushTokenAsync();
      FirebaseService.fcmToken = devicePushToken.data;
      console.log('[FirebaseService] FCM device token:', devicePushToken.data);

      FirebaseService.isInitialized = true;
      console.log('[FirebaseService] Initialized successfully');

      await FirebaseService.syncTokenToServer();
    } catch (error) {
      console.log('[FirebaseService] Initialization failed (non-fatal):', error.message);
    }
  }

  static async syncTokenToServer() {
  }

  static onMessageReceived(notification) {
    console.log('[FirebaseService] Notification received:', notification);
  }
}

export default FirebaseService;
