import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import HomeworkService from '../services/HomeworkService';

function formatAssignedDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDay = days[date.getDay()];
  return `${day} ${month}, ${weekDay}`;
}

function formatSubmissionDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  return `${day} ${month}`;
}

const FilterChip = ({ label, count, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-3 border ${isActive ? 'bg-[#0f172a] border-[#0f172a]' : 'bg-white border-gray-300'}`}
  >
    <Text className={`${isActive ? 'text-white' : 'text-[#0f172a]'} font-bold`}>
      {count ? `${count} ` : ''}{label}
    </Text>
  </TouchableOpacity>
);

const HomeworkItem = ({ subject, chapter, description, assignedDate, submissionDate, teacherName }) => {
  const { t } = useTranslation();
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition.springify().damping(16).stiffness(120)}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm mx-4"
    >
      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-500 text-xs">{t('assigned')} {assignedDate}</Text>
        <Text className="text-gray-500 text-xs">{t('submission_date')}</Text>
      </View>

      <View className="flex-row justify-between items-start mb-2 space-x-4">
        <Text className="text-[#0f172a] font-bold text-lg flex-1" numberOfLines={2}>{subject}</Text>
        <Text className="text-green-600 font-bold">{submissionDate}</Text>
      </View>

      <Text className="text-[#0f172a] font-medium mb-1">{chapter ? `${t('chapter')} ${chapter}` : ''}</Text>
      <Text className="text-gray-600 text-sm mb-4">{description}</Text>

      <View className="h-[1px] bg-gray-100 mb-3" />

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image
            source={require('../assets/user.png')}
            className="w-8 h-8 rounded-full mr-2"
          />
          <Text className="text-[#0f172a] font-medium">{teacherName}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function HomeworkListScreen({ navigation }) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const result = await HomeworkService.fetchHomework();
    if (result.success && result.data) {
      setHomeworks(result.data);
    }
    setLoading(false);
  };

  const filteredHomeworks = homeworks.filter(item => {
    if (activeFilter === 'all') return true;

    const today = new Date();
    const itemDate = new Date(item.StartDate);

    if (activeFilter === 'today') {
      return (
        itemDate.getFullYear() === today.getFullYear() &&
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getDate() === today.getDate()
      );
    } else if (activeFilter === 'upcoming') {
      const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      return itemDate >= tomorrow;
    }
    return true;
  });

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-[#0f172a] font-bold text-lg text-center mr-8">
          {t('homework_title') || 'Homework'}
        </Text>
      </View>

      <View className="bg-white px-4 py-4 mb-2 shadow-sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterChip
            label={t('all')}
            isActive={activeFilter === 'all'}
            onPress={() => handleFilterChange('all')}
          />
          <FilterChip
            label={t('today')}
            isActive={activeFilter === 'today'}
            onPress={() => handleFilterChange('today')}
          />
          <FilterChip
            label={t('upcoming')}
            isActive={activeFilter === 'upcoming'}
            onPress={() => handleFilterChange('upcoming')}
          />
        </ScrollView>
      </View>

      <ScrollView className="flex-1 pt-4">
        {loading ? (
          <View className="py-8 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : filteredHomeworks.length > 0 ? (
          filteredHomeworks.map((item, index) => {
            const chapterDesc = item.VcrDiaryGroups && item.VcrDiaryGroups.length > 0 ? item.VcrDiaryGroups[0].Description : '';
            return (
              <HomeworkItem
                key={item.Id || index}
                subject={item.Title}
                chapter={chapterDesc}
                description={item.Homework}
                assignedDate={formatAssignedDate(item.StartDate)}
                submissionDate={formatSubmissionDate(item.EndDate)}
                teacherName={item.TeacherName}
              />
            );
          })
        ) : (
          <View className="py-8 items-center justify-center">
            <Text className="text-gray-500 font-medium">{t('no_homework_found')}</Text>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
