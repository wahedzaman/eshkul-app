import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import BalanceCard from '../../components/BalanceCard';
import AttendanceCard from '../../components/AttendanceCard';
import HomeworkCard from '../../components/HomeworkCard';
import NewsAndNoticeCard from '../../components/NewsAndNoticeCard';
import ClassRoutineCard from '../../components/ClassRoutineCard';
import AcademicCalendarCard from '../../components/AcademicCalendarCard';
import AppSession from '../../services/AppSession';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-gray-50 px-4 pt-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      {/* {AppSession.hasRight(1915) && (
        <BalanceCard refreshTrigger={refreshTrigger} />
      )} */}

      {AppSession.hasRight(1911) && (
        <AttendanceCard refreshTrigger={refreshTrigger} />
      )}

      {AppSession.hasRight(1913) && (
        <HomeworkCard refreshTrigger={refreshTrigger} />
      )}

      <NewsAndNoticeCard refreshTrigger={refreshTrigger} />

      {/* {AppSession.hasRight(1912) && ( */}
      <ClassRoutineCard refreshTrigger={refreshTrigger} />
      {/* )} */}


      <AcademicCalendarCard refreshTrigger={refreshTrigger} />
      {/* Add padding at bottom for scroll */}
      <View className="h-20" />
    </ScrollView>
  );
}
