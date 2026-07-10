import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import RoutineService from '../services/RoutineService';
import ApiWrapper from '../constants/ApiWrapper';

const FilterChip = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-5 py-2 rounded-full mr-3 border ${isActive ? 'bg-[#0f172a] border-[#0f172a]' : 'bg-white border-gray-300'}`}
  >
    <Text className={`${isActive ? 'text-white' : 'text-[#0f172a]'} font-bold`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const RoutineItem = ({ dayName, timeStart, timeEnd, subject, room, teacher, isActive, isLast }) => (
  <Animated.View
    entering={FadeIn.duration(300)}
    exiting={FadeOut.duration(200)}
    layout={LinearTransition.springify().damping(16).stiffness(120)}
    className="flex-row mb-1 mx-4"
  >
    <View className="w-16 pt-1 mr-2 items-end">
      {dayName && <Text className="text-blue-500 font-bold text-[10px] mb-0.5">{dayName}</Text>}
      <Text className="text-[#0f172a] font-bold  text-sm">{timeStart}</Text>
      <Text className="text-gray-500 text-xs">{timeEnd}</Text>
    </View>

    <View className="items-center mr-3">
      <View className={`w-4 h-4 rounded-full border-2 ${isActive ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'} z-10`} />
      {!isLast && (
        <View className="w-[1px] bg-gray-300 flex-1 -mt-1" />
      )}
    </View>

    <View className={`flex-1 p-4 rounded-2xl mb-6 ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <View className="flex-row justify-between mb-1">
        <Text className="text-[#0f172a] font-bold text-lg flex-1">{subject}</Text>
        <Text className="text-gray-500 text-sm ml-2">{room}</Text>
      </View>

      <View className="flex-row items-center mt-2">
        <Image
          source={
            teacher.image
              ? { uri: `${ApiWrapper.API_CONTENT_URL_PREFIX}/${teacher.image}` }
              : require('../assets/user.png')
          }
          className="w-6 h-6 rounded-full mr-2"
        />
        <Text className="text-[#0f172a] text-sm flex-1">{teacher.name}</Text>
      </View>
    </View>
  </Animated.View>
);

function getCurrentPeriodIndex(schedule) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];
    const startParts = parseTimeStr(item.timeStart);
    const endParts = parseTimeStr(item.timeEnd);
    if (startParts !== null && endParts !== null) {
      if (currentMinutes >= startParts && currentMinutes < endParts) {
        return i;
      }
    }
  }
  return -1;
}

function parseTimeStr(timeStr) {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function getTodayLabel() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

export default function ClassRoutineListScreen({ navigation }) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('today');
  const [fullRoutine, setFullRoutine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutine();
  }, []);

  const fetchRoutine = async () => {
    setLoading(true);
    const result = await RoutineService.fetchRoutine();
    if (result.success && result.data) {
      setFullRoutine(result.data);
    }
    setLoading(false);
  };

  const schedule = RoutineService.buildScheduleForFilter(fullRoutine, activeFilter);
  const activeIndex = activeFilter === 'today' ? getCurrentPeriodIndex(schedule) : -1;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-[#0f172a] font-bold text-lg text-center mr-8">
          {t('class_routine') || 'Class Routine'}
        </Text>
      </View>

      <View className="bg-white px-4 py-4 mb-2 shadow-sm">
        <View className="flex-row justify-between items-center mb-4 px-2">
          <Text className="text-sm font-bold text-gray-600 uppercase tracking-wide">
            {activeFilter === 'today' ? t('today') : t('all')}
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#2563eb" className="mr-1" />
            <Text className="text-blue-600 font-bold capitalize">{t(getTodayLabel())}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterChip
            label={t('all')}
            isActive={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterChip
            label={t('today')}
            isActive={activeFilter === 'today'}
            onPress={() => setActiveFilter('today')}
          />
          <FilterChip
            label={t('upcoming')}
            isActive={activeFilter === 'upcoming'}
            onPress={() => setActiveFilter('upcoming')}
          />
        </ScrollView>
      </View>

      <ScrollView className="flex-1 pt-4">
        {loading ? (
          <View className="py-8 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : schedule.length > 0 ? (
          schedule.map((item, index, arr) => (
            <RoutineItem
              key={item.id}
              dayName={activeFilter !== 'today' ? t(item.dayName.toLowerCase()) : null}
              timeStart={item.timeStart}
              timeEnd={item.timeEnd}
              subject={item.subject}
              room={item.room}
              teacher={{ name: item.teacherName, image: item.teacherImage }}
              isActive={index === activeIndex}
              isLast={index === arr.length - 1}
            />
          ))
        ) : (
          <View className="py-8 items-center justify-center">
            <Text className="text-gray-500 font-medium">{t('no_routine_found')}</Text>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
