import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, G } from 'react-native-svg';
import AttendanceService from '../services/AttendanceService';

export default function AttendanceCard() {
  const { t } = useTranslation();

  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0, percentage: 0 });
  const [todayStatus, setTodayStatus] = useState(null);
  const [todayDate, setTodayDate] = useState(null);
  const [monthLabel, setMonthLabel] = useState('');

  const fetchData = useCallback(async () => {
    const result = await AttendanceService.fetchAttendanceReport();
    if (result.success && result.data) {
      setStats(AttendanceService.calculateStats(result.data));
      const today = AttendanceService.getTodayStatus(result.data);
      setTodayStatus(today.status);
      setTodayDate(today.date);
      setMonthLabel(AttendanceService.getMonthLabel(result.data));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cardBgColor = 'bg-white';
  const titleColor = 'text-navy';
  const linkColor = 'text-brand';

  const badgeBgColor = todayStatus === 'present' ? 'bg-green-100' : todayStatus === 'absent' ? 'bg-red-100' : 'bg-yellow-100';
  const badgeTextColor = todayStatus === 'present' ? 'text-green-600' : todayStatus === 'absent' ? 'text-red-600' : 'text-yellow-600';

  const todayLabel = todayStatus === 'present' ? t('present') : todayStatus === 'absent' ? t('absent') : t('late');

  const dateFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' });

  const radius = 45;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2;

  const { present, late, absent, total, percentage } = stats;

  const gap = 5;

  const presentStroke = present > 0 ? ((present / total) * halfCircumference) - gap : 0;
  const lateStroke = late > 0 ? ((late / total) * halfCircumference) - gap : 0;
  const absentStroke = absent > 0 ? ((absent / total) * halfCircumference) - gap : 0;

  const lateOffset = -((present / total) * halfCircumference);
  const absentOffset = -(((present + late) / total) * halfCircumference);

  return (
    <View className={`rounded-[32px] p-6 mb-6 shadow-sm ${cardBgColor}`}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className={`text-lg font-bold ${titleColor}`}>{t('attendance_overview')}</Text>
        <TouchableOpacity>
          <Text className={`font-bold ${linkColor}`}>{t('view_all')}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center mb-8">
        <Text className="text-gray-500 mr-3 text-base">
          {t('today')} {todayDate ? dateFormatter.format(todayDate) : ''}
        </Text>
        {todayStatus && (
          <View className={`px-3 py-1 rounded-full ${badgeBgColor}`}>
            <Text className={`text-xs font-bold ${badgeTextColor}`}>{todayLabel}</Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between">
        <View className="items-center justify-center relative" style={{ height: 100, width: 120 }}>
          <Svg height="120" width="120" viewBox="0 0 120 120">
            <G rotation="-180" origin="60, 60">
              <Circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${halfCircumference} ${circumference}`}
                strokeLinecap="round"
              />

              <Circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#2563eb"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${presentStroke} ${circumference}`}
                strokeLinecap="round"
              />

              <Circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#eab308"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${lateStroke} ${circumference}`}
                strokeDashoffset={lateOffset}
                strokeLinecap="round"
              />

              <Circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#ef4444"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${absentStroke} ${circumference}`}
                strokeDashoffset={absentOffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          <View style={{ position: 'absolute', top: 42, left: 0, right: 0, alignItems: 'center' }}>
            <Text className="text-3xl font-bold text-navy">{percentage}%</Text>
          </View>
        </View>

        <View className="flex-1 ml-6">
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 rounded-full bg-brand mr-3" />
            <Text className="text-gray-600 text-sm">{present} {t('days_presents')}</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 rounded-full bg-warning mr-3" />
            <Text className="text-gray-600 text-sm">{late} {t('late_entry')}</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-danger mr-3" />
            <Text className="text-gray-600 text-sm">{absent} {t('days_absent')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
