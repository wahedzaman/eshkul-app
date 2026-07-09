import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AcademicCalendarService from '../services/AcademicCalendarService';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function categorizeEvent(item) {
  if (item.isInstituteClose) return 'holiday';
  const text = (item.title + ' ' + item.description).toLowerCase();
  if (text.includes('exam')) return 'upcoming_exam';
  return 'events';
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const day = DAY_NAMES[date.getDay()];
  const dateNum = String(date.getDate()).padStart(2, '0');
  return { day, date: dateNum };
}

function getCurrentMonth(events) {
  if (events.length > 0) {
    const firstEvent = events[0];
    const date = new Date(firstEvent.fromDate);
    return MONTHS[date.getMonth()];
  }
  const now = new Date();
  return MONTHS[now.getMonth()];
}

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

const EventItem = ({ day, date, title, description }) => (
  <Animated.View 
    entering={FadeIn.duration(300)} 
    exiting={FadeOut.duration(200)} 
    layout={LinearTransition.springify().damping(16).stiffness(120)}
    className="flex-row mb-4"
  >
    {/* Date Column */}
    <View className="w-12 pt-1 mr-3 items-center">
      <Text className="text-[#0f172a] font-bold text-base">{day}</Text>
      <Text className="text-gray-500 text-xs">{date}</Text>
    </View>

    {/* Card Column */}
    <View className="flex-1 bg-gray-100 p-4 rounded-2xl">
      <Text className="text-[#0f172a] font-bold text-lg mb-1">{title}</Text>
      <Text className="text-gray-500 text-sm leading-5">{description}</Text>
    </View>
  </Animated.View>
);

export default function AcademicCalendarCard({ refreshTrigger }) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const result = await AcademicCalendarService.fetchCalendarEvents();
    if (result.success) {
      setEvents(result.data);
    } else {
      setEvents([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, refreshTrigger]);

  const categorizedEvents = events.map(item => ({
    ...item,
    _type: categorizeEvent(item),
    _formattedDate: formatDate(item.fromDate),
  }));

  const filteredEvents = activeFilter === 'all'
    ? categorizedEvents
    : categorizedEvents.filter(item => item._type === activeFilter);

  const currentMonth = getCurrentMonth(events);

  return (
    <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-[#0f172a]">{t('academic_calendar')}</Text>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="calendar-outline" size={18} color="#2563eb" className="mr-1" />
          <Text className="text-blue-600 font-bold">{currentMonth}</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        <FilterChip 
          label={t('all')} 
          isActive={activeFilter === 'all'} 
          onPress={() => setActiveFilter('all')}
        />
        <FilterChip 
          label={t('upcoming_exam')} 
          isActive={activeFilter === 'upcoming_exam'} 
          onPress={() => setActiveFilter('upcoming_exam')}
        />
        <FilterChip 
          label={t('holiday')} 
          isActive={activeFilter === 'holiday'} 
          onPress={() => setActiveFilter('holiday')}
        />
        <FilterChip 
          label={t('events')} 
          isActive={activeFilter === 'events'} 
          onPress={() => setActiveFilter('events')}
        />
      </ScrollView>

      {/* Events List */}
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" className="py-8" />
        ) : filteredEvents.length === 0 ? (
          <Text className="text-gray-500 text-center py-8">{t('no_notifications')}</Text>
        ) : (
          filteredEvents.map((item) => (
            <EventItem 
              key={item.id}
              day={item._formattedDate.day}
              date={item._formattedDate.date}
              title={item.title}
              description={item.description}
            />
          ))
        )}
      </View>
    </View>
  );
}
