import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, G } from 'react-native-svg';

export default function AttendanceCard() {
  const { t } = useTranslation();

  // Style variables
  const cardBgColor = 'bg-white';
  const titleColor = 'text-navy';
  const linkColor = 'text-brand';
  const badgeBgColor = 'bg-green-100';
  const badgeTextColor = 'text-green-600';

  // Chart Data
  const radius = 45;
  const strokeWidth = 12; // Thicker stroke
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2;
  
  const total = 29;
  const present = 24;
  const late = 3;
  const absent = 2;

  // Calculate stroke lengths
  // We add a small gap by subtracting from the length
  const gap = 5; 
  const presentStroke = ((present / total) * halfCircumference) - gap;
  const lateStroke = ((late / total) * halfCircumference) - gap;
  const absentStroke = ((absent / total) * halfCircumference) - gap;

  // Offsets
  // Present starts at 0 (left in rotated view)
  // Late starts after Present
  const lateOffset = -((present / total) * halfCircumference);
  // Absent starts after Present + Late
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
        <Text className="text-gray-500 mr-3 text-base">{t('today')} 11 Nov</Text>
        <View className={`px-3 py-1 rounded-full ${badgeBgColor}`}>
          <Text className={`text-xs font-bold ${badgeTextColor}`}>{t('present')}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        {/* Semi Circle Chart */}
        <View className="items-center justify-center relative" style={{ height: 100, width: 120 }}>
          <Svg height="120" width="120" viewBox="0 0 120 120">
            <G rotation="-180" origin="60, 60">
               {/* Background Arc */}
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
              
              {/* Present Arc (Blue) */}
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

              {/* Late Arc (Yellow) */}
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

              {/* Absent Arc (Red) */}
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
          <View className="absolute top-12 items-center">
            <Text className="text-3xl font-bold text-navy">92%</Text>
            <Text className="text-xs text-gray-500">November 2025</Text>
          </View>
        </View>

        {/* Legend */}
        <View className="flex-1 ml-6">
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 rounded-full bg-brand mr-3" />
            <Text className="text-gray-600 text-sm">24 {t('days_presents')}</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 rounded-full bg-warning mr-3" />
            <Text className="text-gray-600 text-sm">3 {t('late_entry')}</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-danger mr-3" />
            <Text className="text-gray-600 text-sm">2 {t('days_absent')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
