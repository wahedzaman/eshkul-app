class Notification {
  constructor(data) {
    this.statusUpdatedAt = data.StatusUpdatedAt || '';
    this.notificationText = data.NotificationText || '';
    this.notificationId = data.NotificationId || null;
  }
}

export default Notification;
