import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AppSession from '../../services/AppSession'

const ServiceItem = ({ icon, label, color = "#6b7280" }) => (
  <TouchableOpacity className="items-center justify-center w-[25%] mb-6">
    <View className="mb-2">
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text className="text-xs text-gray-600 text-center">{label}</Text>
  </TouchableOpacity>
);

const ServiceSection = ({ title, children }) => (
  <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm mx-4">
    <Text className="text-[#ff7f50] font-bold text-lg mb-4">{title}</Text>
    <View className="flex-row flex-wrap">
      {children}
    </View>
  </View>
);

export default function ServicesScreen() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-gray-50 pt-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Academic Section */}
      {/* todo:: add Has Any permission  */}
      <ServiceSection title={t('academic')}>
        {AppSession.rights !== 1916 && (
          <ServiceItem icon="library-outline" label={t('library')} color="#3B82F6" />
        )}

        {AppSession.rights !== 1912 && (
          <ServiceItem icon="calendar-outline" label={t('routine')} color="#10B981" />
        )}

        {/* todo: ask habib bhai */}
        <ServiceItem icon="people-outline" label={t('meeting')} color="#F59E0B" />

        {AppSession.rights !== 1919 && (
          <ServiceItem icon="exit-outline" label={t('leave')} color="#EF4444" />
        )}

        {AppSession.rights !== 1914 && (
          <ServiceItem icon="document-text-outline" label={t('result')} color="#8B5CF6" />
        )}

      </ServiceSection>

      {/* Admission Section */}
      <ServiceSection title={t('admission')}>

        {AppSession.rights !== 1915 && (
          <ServiceItem icon="cash-outline" label={t('fees')} color="#F59E0B" />
        )}

        {AppSession.rights !== 1915 && (
          <ServiceItem icon="card-outline" label={t('payment')} color="#3B82F6" />
        )}

        {AppSession.rights !== 1915 && (
          <ServiceItem icon="wallet-outline" label={t('wallet')} color="#10B981" />
        )}


        <ServiceItem icon="clipboard-outline" label={t('reg_forms')} color="#8B5CF6" />
      </ServiceSection>

      {/* Classroom Section */}
      <ServiceSection title={t('classroom')}>

        <ServiceItem icon="journal-outline" label={t('diary')} color="#EC4899" />

        {AppSession.rights !== 1913 && (
          <ServiceItem icon="create-outline" label={t('homework')} color="#14B8A6" />
        )}

        {AppSession.rights !== 1911 && (
          <ServiceItem icon="checkmark-done-outline" label={t('attendance')} color="#EF4444" />
        )}

      </ServiceSection>

      {/* Bottom Padding */}
      <View className="h-20" />
    </ScrollView>
  );
}
