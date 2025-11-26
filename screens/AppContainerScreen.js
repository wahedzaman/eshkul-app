import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import HomeScreen from './tabs/HomeScreen';
import NotificationScreen from './tabs/NotificationScreen';
import ServicesScreen from './tabs/ServicesScreen';
import AccountScreen from './tabs/AccountScreen';

const Tab = createBottomTabNavigator();

export default function AppContainerScreen() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: t('home'), tabBarLabel: t('home') }}
      />
      <Tab.Screen 
        name="Notification" 
        component={NotificationScreen} 
        options={{ title: t('notification'), tabBarLabel: t('notification') }}
      />
      <Tab.Screen 
        name="Services" 
        component={ServicesScreen} 
        options={{ title: t('services'), tabBarLabel: t('services') }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen} 
        options={{ title: t('account'), tabBarLabel: t('account') }}
      />
    </Tab.Navigator>
  );
}
