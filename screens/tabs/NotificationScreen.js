import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import NotificationService from '../../services/NotificationService';

const formatNumber = (num, lng) => {
  const numStr = String(num);
  if (lng && lng.startsWith('bn')) {
    const banglaDigits = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return numStr.split('').map(digit => banglaDigits[digit] || digit).join('');
  }
  return numStr;
};

const getTimeAgo = (dateStr, t, lng) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) {
    return t('just_now');
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    if (minutes === 1) return t('minute_ago');
    return `${formatNumber(minutes, lng)} ${t('minutes_ago')}`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    if (hours === 1) return t('hour_ago');
    return `${formatNumber(hours, lng)} ${t('hours_ago')}`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    if (days === 1) return t('day_ago');
    return `${formatNumber(days, lng)} ${t('days_ago')}`;
  }
  const weeks = Math.floor(days / 7);
  if (days < 30) {
    if (weeks === 1) return t('week_ago');
    return `${formatNumber(weeks, lng)} ${t('weeks_ago')}`;
  }
  const months = Math.floor(days / 30);
  if (days < 365) {
    if (months === 1) return t('month_ago');
    return `${formatNumber(months, lng)} ${t('months_ago')}`;
  }
  const years = Math.floor(days / 365);
  if (years === 1) return t('year_ago');
  return `${formatNumber(years, lng)} ${t('years_ago')}`;
};

const NotificationCard = ({ item, t, lng }) => {
  const timeAgo = getTimeAgo(item.statusUpdatedAt, t, lng);
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 mx-4">
      <Text className="text-gray-400 text-xs mb-1">
        {timeAgo}
      </Text>
      <Text className="text-gray-800 text-base leading-6">
        {item.notificationText}
      </Text>
    </View>
  );
};

export default function NotificationScreen() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    const response = await NotificationService.fetchNotifications();
    if (response.success) {
      let data = response.data || [];
      // Enforce a stable order by sorting descending by date
      data.sort((a, b) => {
        const dateA = new Date(a.statusUpdatedAt).getTime();
        const dateB = new Date(b.statusUpdatedAt).getTime();
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return dateB - dateA; // Newest first
        }
        return 0;
      });

      console.log('--- [Notification Screen Received Data] ---');
      data.forEach((item, idx) => {
        console.log(`Index: ${idx} | Date: ${item.statusUpdatedAt} | Text: ${item.notificationText}`);
      });
      console.log('-------------------------------------------');
      setNotifications(data);
      setError(null);
    } else {
      setError(response.error);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [loadNotifications]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" className="mb-4" />
        <Text className="text-[#0f172a] font-bold text-lg text-center mb-2">{t('error')}</Text>
        <Text className="text-gray-500 text-sm text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            loadNotifications();
          }}
          className="bg-blue-600 px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold text-base">{t('retry') || 'Retry'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationCard item={item} t={t} lng={i18n.language} />}
        keyExtractor={(item, index) => item.notificationId ? item.notificationId.toString() : index.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Ionicons name="notifications-off-outline" size={64} color="#9ca3af" className="mb-4" />
            <Text className="text-gray-500 text-base font-semibold text-center">
              {t('no_notifications')}
            </Text>
          </View>
        }
      />
    </View>
  );
}
