import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import NoticeService from '../services/NoticeService';

const { width } = Dimensions.get('window');
const PADDING = 24;
const CARD_WIDTH = width - PADDING * 2;

const NoticeItem = ({ title, date, color }) => {
  const { t } = useTranslation();
  return (
    <View 
      style={{ width: CARD_WIDTH, backgroundColor: color }} 
      className="rounded-[32px] p-6 h-48 flex-row justify-between items-center overflow-hidden relative"
    >
      {/* Background Shapes */}
      <View className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/10 rounded-l-full" />
      <View className="absolute right-10 top-10 w-10 h-10 bg-pink-300 rounded-full opacity-50" />
      
      <View className="flex-1 z-10 mr-4">
        <Text className="text-white text-xl font-medium mb-2" numberOfLines={4} ellipsizeMode="tail">{title}</Text>
        <Text className="text-white text-3xl font-bold">{date}</Text>
      </View>

      <View className="w-1/3 items-center justify-center z-10">
         {/* Placeholder for the illustration in the image */}
         <Ionicons name="document-text-outline" size={80} color="white" style={{ opacity: 0.8 }} />
      </View>
    </View>
  );
};

const COLORS = ['#2563eb', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

function formatNoticeDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function NewsAndNoticeCard() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    NoticeService.fetchNotices().then((result) => {
      if (result.success && result.data && result.data.length > 0) {
        const mapped = result.data.map((item, index) => ({
          id: item.Id,
          title: item.NoticeTitle,
          date: formatNoticeDate(item.StartDate),
          color: COLORS[index % COLORS.length],
        }));
        setNotices(mapped);
      }
    });
  }, []);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  return (
    <View className="mb-6">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width}
        snapToAlignment="center"
        decelerationRate="fast"
        className="mb-4"
      >
        {notices.map((notice) => (
          <View key={notice.id} style={{ width, alignItems: 'center' }}>
            <NoticeItem 
              title={notice.title} 
              date={notice.date} 
              color={notice.color} 
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View className="flex-row justify-center">
        {notices.map((_, index) => (
          <View 
            key={index}
            className={`mx-1 w-3 h-3 rounded-full ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
          />
        ))}
      </View>
    </View>
  );
}
