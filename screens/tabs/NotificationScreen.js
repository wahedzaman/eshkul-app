import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';

const notifications = [
  {
    id: '1',
    date: '01 May 2025',
    title: 'British Council, 10 Minute School launch English assessment partnership',
    description: 'The British Council and 10 Minute School have announced a strategic partnership in Dhaka on Tuesday to expand access to internationally'
  },
  {
    id: '2',
    date: '01 May 2025',
    title: 'British Council, 10 Minute School launch English assessment partnership',
    description: 'The British Council and 10 Minute School have announced a strategic partnership in Dhaka on Tuesday to expand access to internationally'
  },
  {
    id: '3',
    date: '01 May 2025',
    title: 'British Council, 10 Minute School launch English assessment partnership',
    description: 'The British Council and 10 Minute School have announced a strategic partnership in Dhaka on Tuesday to expand access to internationally'
  },
  {
    id: '4',
    date: '01 May 2025',
    title: 'British Council, 10 Minute School launch English assessment partnership',
    description: 'The British Council and 10 Minute School have announced a strategic partnership in Dhaka on Tuesday to expand access to internationally'
  },
];

const NotificationCard = ({ item }) => (
  <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm mx-4">
    <Text className="text-[#ff7f50] font-bold text-sm mb-2">{item.date}</Text>
    <Text className="text-[#0f172a] font-bold text-lg mb-2 leading-6">
      {item.title}
    </Text>
    <Text className="text-gray-600 text-sm leading-5">
      {item.description}
    </Text>
  </View>
);

export default function NotificationScreen() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
