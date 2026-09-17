import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AcademicCalendarService from '../services/AcademicCalendarService';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(isoString) {
  if (!isoString) return { day: '', date: '', fullDate: '' };
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return { day: '', date: '', fullDate: '' };
  const day = DAY_NAMES[date.getDay()];
  const dateNum = String(date.getDate()).padStart(2, '0');
  const month = SHORT_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const fullDate = `${dateNum} ${month} ${year}`;
  return { day, date: dateNum, fullDate };
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


const EventItem = ({ day, date, title, description, fullDate }) => (
  <Animated.View
    entering={FadeIn.duration(300)}
    exiting={FadeOut.duration(200)}
    layout={LinearTransition.springify().damping(16).stiffness(120)}
    className="flex-row items-center mb-4"
  >
    {/* Date Column */}
    <View className="w-12 mr-3 items-center justify-center">
      <Text className="text-[#0f172a] font-bold text-base">{day}</Text>
    </View>

    {/* Card Column */}
    <View className="flex-1 bg-gray-100 p-4 rounded-2xl">
      <Text className="text-[#0f172a] font-bold text-lg mb-1">{title}</Text>
      <Text className="text-gray-500 text-sm leading-5">{description}</Text>
      {fullDate ? (
        <Text className="text-gray-400 text-xs mt-2">{fullDate}</Text>
      ) : null}
    </View>
  </Animated.View>
);

export default function AcademicCalendarCard({ refreshTrigger }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
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

  const formattedEvents = events.map(item => ({
    ...item,
    _formattedDate: formatDate(item.fromDate),
  }));

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

      {/* Events List */}
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" className="py-8" />
        ) : formattedEvents.length === 0 ? (
          <Text className="text-gray-500 text-center py-8">{t('no_notifications')}</Text>
        ) : (
          formattedEvents.slice(0, 5).map((item) => (
            <EventItem
              key={item.id}
              day={item._formattedDate.day}
              date={item._formattedDate.date}
              title={item.title}
              description={item.description}
              fullDate={item._formattedDate.fullDate}
            />
          ))
        )}
      </View>
      {formattedEvents.length > 5 && (
        <TouchableOpacity
          className="border border-blue-500 rounded-full py-3 items-center mt-2"
          onPress={() => navigation.navigate('AcademicCalendarList')}
        >
          <Text className="text-blue-600 font-bold">{t('view_full_calendar')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
