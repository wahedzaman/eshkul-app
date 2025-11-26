import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const RoutineItem = ({ timeStart, timeEnd, subject, room, topic, teacher, isActive, isLast }) => (
  <View className="flex-row mb-1">
    {/* Time Column */}
    <View className="w-16 pt-1 mr-2 items-end">
      <Text className="text-[#0f172a] font-bold text-base">{timeStart}</Text>
      <Text className="text-gray-500 text-xs">{timeEnd}</Text>
    </View>

    {/* Timeline Column */}
    <View className="items-center mr-3">
      <View className={`w-4 h-4 rounded-full border-2 ${isActive ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'} z-10`} />
      {!isLast && (
        <View className="w-[1px] bg-gray-300 flex-1 -mt-1" />
      )}
    </View>

    {/* Card Column */}
    <View className={`flex-1 p-4 rounded-2xl mb-6 ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <View className="flex-row justify-between mb-1">
        <Text className="text-[#0f172a] font-bold text-lg">{subject}</Text>
        <Text className="text-gray-500 text-sm">{room}</Text>
      </View>
      
      <Text className="text-[#0f172a] text-sm mb-3">{topic}</Text>
      
      <View className="flex-row items-center">
        <Image 
          source={{ uri: teacher.image }} 
          className="w-6 h-6 rounded-full mr-2"
        />
        <Text className="text-[#0f172a] text-sm">{teacher.name}</Text>
      </View>
    </View>
  </View>
);

export default function ClassRoutineCard() {
  const { t } = useTranslation();

  const routineData = [
    {
      id: 1,
      timeStart: '10:00',
      timeEnd: '10:30',
      subject: 'English',
      room: 'R201',
      topic: 'Chapter 3: Introduction',
      teacher: { name: 'Esther Howard', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
      isActive: true
    },
    {
      id: 2,
      timeStart: '10:30',
      timeEnd: '11:00',
      subject: 'Bangla',
      room: 'R201',
      topic: 'Chapter 3: Introduction',
      teacher: { name: 'Arlene McCoy', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
      isActive: false
    },
    {
      id: 3,
      timeStart: '11:00',
      timeEnd: '11:30',
      subject: 'Math',
      room: 'R201',
      topic: 'Chapter 3: Introduction',
      teacher: { name: 'Brooklyn Simmons', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
      isActive: false
    }
  ];

  return (
    <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-[#0f172a]">{t('class_routine')}</Text>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="calendar-outline" size={18} color="#2563eb" className="mr-1" />
          <Text className="text-blue-600 font-bold">November</Text>
        </TouchableOpacity>
      </View>

      {/* Timeline List */}
      <View>
        {routineData.map((item, index) => (
          <RoutineItem 
            key={item.id}
            {...item}
            isLast={index === routineData.length - 1}
          />
        ))}
      </View>

      {/* Footer Button */}
      <TouchableOpacity className="border border-blue-500 rounded-full py-3 items-center mt-2">
        <Text className="text-blue-600 font-bold">{t('view_full_routine')}</Text>
      </TouchableOpacity>
    </View>
  );
}
