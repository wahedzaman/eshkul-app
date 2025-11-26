import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

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
  <View className="flex-row mb-4">
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
  </View>
);

export default function AcademicCalendarCard() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  const events = [
    {
      id: 1,
      day: 'Sun',
      date: '01',
      title: 'Annual Sports',
      description: 'Lorem Ipsum" is standard placeholder text used mainly in design.',
      type: 'events'
    },
    {
      id: 2,
      day: 'Thu',
      date: '23',
      title: 'Final Exam',
      description: 'Lorem Ipsum" is standard placeholder text used mainly in design.',
      type: 'upcoming_exam'
    }
  ];

  return (
    <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-[#0f172a]">{t('academic_calendar')}</Text>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="calendar-outline" size={18} color="#2563eb" className="mr-1" />
          <Text className="text-blue-600 font-bold">November</Text>
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
        {events.map((item) => (
          <EventItem 
            key={item.id}
            {...item}
          />
        ))}
      </View>
    </View>
  );
}
