import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const FilterChip = ({ label, count, isActive, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-3 border ${isActive ? 'bg-[#0f172a] border-[#0f172a]' : 'bg-white border-gray-300'}`}
  >
    <Text className={`${isActive ? 'text-white' : 'text-[#0f172a]'} font-bold`}>
      {count} {label}
    </Text>
  </TouchableOpacity>
);

const HomeworkItem = ({ subject, chapter, description, assignedDate, submissionDate, teacherName }) => {
  const { t } = useTranslation();
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-500 text-xs">{t('assigned')} {assignedDate}</Text>
        <Text className="text-gray-500 text-xs">{t('submission_date')}</Text>
      </View>
      
      <View className="flex-row justify-between mb-2">
        <Text className="text-[#0f172a] font-bold text-lg">{subject}</Text>
        <Text className="text-green-600 font-bold">{submissionDate}</Text>
      </View>

      <Text className="text-[#0f172a] font-medium mb-1">{t('chapter')} {chapter}</Text>
      <Text className="text-gray-600 text-sm mb-4">{description}</Text>

      <View className="h-[1px] bg-gray-100 mb-3" />

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
            className="w-8 h-8 rounded-full mr-2"
          />
          <Text className="text-[#0f172a] font-medium">{teacherName}</Text>
        </View>
        
        <View className="flex-row space-x-3">
          <TouchableOpacity className="bg-blue-500 p-2 rounded-full">
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-500 p-2 rounded-full">
            <Ionicons name="call-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function HomeworkCard() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('assigned');

  return (
    <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm">
      <Text className="text-xl font-bold text-[#0f172a] mb-4">{t('homework_title')}</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        <FilterChip 
          label={t('assigned')} 
          count={2} 
          isActive={activeFilter === 'assigned'} 
          onPress={() => setActiveFilter('assigned')}
        />
        <FilterChip 
          label={t('completed')} 
          count={4} 
          isActive={activeFilter === 'completed'} 
          onPress={() => setActiveFilter('completed')}
        />
        <FilterChip 
          label={t('not_completed')} 
          count={1} 
          isActive={activeFilter === 'not_completed'} 
          onPress={() => setActiveFilter('not_completed')}
        />
      </ScrollView>

      <View>
        <HomeworkItem 
          subject="Mathematics"
          chapter="1"
          description="Practice page 34–35 from textbook"
          assignedDate="11 Nov, Thu"
          submissionDate="15 Nov"
          teacherName="Nabila Rahman"
        />
        <HomeworkItem 
          subject="Mathematics"
          chapter="1"
          description="Practice page 34–35 from textbook"
          assignedDate="11 Nov, Mon"
          submissionDate="15 Nov"
          teacherName="Nabila Rahman"
        />
      </View>
    </View>
  );
}
