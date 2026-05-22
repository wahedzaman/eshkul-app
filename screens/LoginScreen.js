import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AuthService from '../services/AuthService';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = username.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const response = await AuthService.login(username.trim(), password.trim());
      setIsLoading(false);

      if (response.success) {
        Alert.alert(
          t('success'),
          t('login_success'),
          [
            {
              text: t('ok'),
              onPress: () => navigation.replace('AppContainer'),
            }
          ]
        );
      } else {
        const errorMsg = response.type === 'failed' ? t('login_failed') : t('login_error');
        Alert.alert(
          t('failed'),
          errorMsg,
          [{ text: t('ok') }]
        );
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        t('error'),
        t('login_error'),
        [{ text: t('ok') }]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 50 }} className="px-6">
          {/* Loading Modal */}
          <Modal transparent={true} visible={isLoading} animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <ActivityIndicator size="large" color="#0f5279" />
                <Text style={{ marginTop: 10, color: '#0f5279' }}>{t('logging_in')}</Text>
              </View>
            </View>
          </Modal>

          {/* Header */}
          <View className="flex-row items-center mt-4 mb-10">
            <Text className="text-2xl font-bold text-[#0f5279]"></Text>
          </View>

          {/* Logo */}
          <View className="items-center mb-10">
            <Image
              source={require('../assets/logo.png')}
              style={{ width: 160, height: 96 }}
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* User ID Input */}
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <Ionicons name="person-outline" size={20} color="#9ca3af" className="mr-3" />
              <TextInput
                placeholder={t('user_id')}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={{ flex: 1, color: '#374151' }}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm mt-2">
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-3" />
              <TextInput
                placeholder={t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={{ flex: 1, color: '#374151' }}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="items-end mt-2">
              <Text className="text-gray-500 text-sm font-medium">{t('forgot_password')}</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={!isFormValid}
              style={{ opacity: isFormValid ? 1 : 0.5 }}
              className="bg-[#0f172a] rounded-full py-4 flex-row justify-center items-center mt-6 shadow-md"
            >
              <Text className="text-white font-bold text-lg">{t('login')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
