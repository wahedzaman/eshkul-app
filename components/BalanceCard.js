import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

export default function BalanceCard() {
  const { t } = useTranslation();

  // Color System (Hex codes as requested)
  const colors = {
    gradientStart: '#BFDBFE', // Light Blue
    gradientEnd: '#E9D5FF',   // Light Purple
    buttonBg: '#0f172a',      // Dark Navy
    textPrimary: '#0f172a',   // Dark Navy
    textSecondary: '#6b7280', // Gray
    textBrand: '#2563eb',     // Brand Blue
    textWhite: '#ffffff',     // White
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-[32px] p-6 mb-6 w-full overflow-hidden"
    >
      <Text className="text-xl font-bold mb-6" style={{ color: colors.textPrimary }}>
        {t('balance_fees')}
      </Text>
      
      <View className="mb-8 w-full">
        <Text className="text-4xl font-extrabold mb-1" style={{ color: colors.textPrimary }}>
          TK 180
        </Text>
        <View className="flex-row justify-between items-center w-full">
          <Text className="text-base" style={{ color: colors.textSecondary }}>{t('due_amount')}</Text>
          <Text className="text-sm font-medium" style={{ color: colors.textBrand }}>
            {t('next_payment')}: Nov 25
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        className="rounded-full py-4 items-center w-full"
        style={{ backgroundColor: colors.buttonBg }}
      >
        <Text className="font-bold text-lg" style={{ color: colors.textWhite }}>
          {t('pay_now')} Tk 180
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
