import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // padding horizontal 24 * 2

const NoticeItem = ({ title, date, color }) => {
  const { t } = useTranslation();
  return (
    <View 
      style={{ width: CARD_WIDTH, backgroundColor: color }} 
      className="rounded-[32px] p-6 mr-4 h-48 flex-row justify-between items-center overflow-hidden relative"
    >
      {/* Background Shapes */}
      <View className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/10 rounded-l-full" />
      <View className="absolute right-10 top-10 w-10 h-10 bg-pink-300 rounded-full opacity-50" />
      
      <View className="flex-1 z-10">
        <Text className="text-white text-xl font-medium mb-2">{title}</Text>
        <Text className="text-white text-3xl font-bold">{date}</Text>
      </View>

      <View className="w-1/3 items-center justify-center z-10">
         {/* Placeholder for the illustration in the image */}
         <Ionicons name="document-text-outline" size={80} color="white" style={{ opacity: 0.8 }} />
      </View>
    </View>
  );
};

export default function NewsAndNoticeCard() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  const notices = [
    { id: 1, title: t('next_class_test'), date: '20 November 2025', color: '#2563eb' }, // Blue
    { id: 2, title: 'Science Fair', date: '25 December 2025', color: '#8B5CF6' }, // Purple
    { id: 3, title: 'Parent Meeting', date: '05 January 2026', color: '#10B981' }, // Green
  ];

  return (
    <View className="mb-6">
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="mb-4"
      >
        {notices.map((notice) => (
          <NoticeItem 
            key={notice.id} 
            title={notice.title} 
            date={notice.date} 
            color={notice.color} 
          />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View className="flex-row justify-center space-x-2">
        {notices.map((_, index) => (
          <View 
            key={index}
            className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
          />
        ))}
      </View>
    </View>
  );
}
