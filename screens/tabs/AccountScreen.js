import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const MenuItem = ({ icon, label, onPress, isLast, rightElement }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center py-4"
  >
    <View className="w-8 items-center mr-3">
      <Ionicons name={icon} size={22} color="#6b7280" />
    </View>
    <Text className="flex-1 text-[#0f172a] font-medium text-base">{label}</Text>
    {rightElement ? (
      rightElement
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    )}
  </TouchableOpacity>
);

const MenuGroup = ({ title, children, showNewBadge }) => (
  <View className="mb-6">
    {title && (
      <View className="flex-row items-center mb-2 px-4">
        <Text className="text-gray-500 text-sm font-medium mr-2">{title}</Text>
        {showNewBadge && (
          <View className="bg-red-500 px-2 py-0.5 rounded-full">
            <Text className="text-white text-[10px] font-bold">New</Text>
          </View>
        )}
      </View>
    )}
    <View className="bg-white rounded-3xl px-4 shadow-sm mx-4">
      {children}
    </View>
  </View>
);

const ProfileHeader = () => (
  <View className="bg-white rounded-3xl p-4 mb-6 shadow-sm mx-4 flex-row items-center">
    <Image 
      source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
      className="w-14 h-14 rounded-full mr-4"
    />
    <View className="flex-1">
      <Text className="text-[#0f172a] font-bold text-lg">Abir Hossain</Text>
      <Text className="text-gray-500 text-sm">GRN No: S2526002</Text>
      <Text className="text-gray-500 text-sm">Class : Play CC</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
  </View>
);

export default function AccountScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1 bg-gray-50 pt-4">
      {/* Profile Header */}
      <ProfileHeader />

      {/* General Section (No Title) */}
      <MenuGroup>
        <MenuItem icon="person-circle-outline" label={t('account')} />
        <View className="h-[1px] bg-gray-100" />
        <MenuItem icon="color-wand-outline" label={t('customization')} />
      </MenuGroup>

      {/* Account Management */}
      <MenuGroup title={t('account_management')} >
        <MenuItem 
          icon="people-outline" 
          label={t('account_switching')} 
          rightElement={
            <View className="flex-row items-center">
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          }
        />
      </MenuGroup>

      {/* Support & FAQs */}
      <MenuGroup title={t('support_faqs')}>
        <MenuItem icon="help-circle-outline" label={t('search_faq')} />
        <View className="h-[1px] bg-gray-100" />
        <MenuItem icon="chatbubble-ellipses-outline" label={t('contact_support')} isLast />
      </MenuGroup>

      {/* App */}
      <MenuGroup title={t('app_section')}>
        <MenuItem icon="apps-outline" label={t('app_updates')} isLast />
      </MenuGroup>

      <View className="h-20" />
    </ScrollView>
  );
}
