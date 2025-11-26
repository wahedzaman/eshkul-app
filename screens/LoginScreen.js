import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useTranslation } from 'react-i18next';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [isChecked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.replace('AppContainer');
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
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
            {/* Institute Dropdown Mock */}
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm mb-4">
              <Ionicons name="school-outline" size={20} color="#9ca3af" className="mr-3" />
              <Text className="flex-1 text-[#9ca3af]">{t('select_institute')}</Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </View>

            {/* User ID Input */}
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-3" />
              <TextInput 
                placeholder="Username"
                style={{ flex: 1, color: '#374151' }}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm mt-2">
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-3" />
              <TextInput 
                placeholder={t('password')}
                secureTextEntry={!showPassword}
                style={{ flex: 1, color: '#374151' }}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="items-end mt-2">
              <Text className="text-gray-500 text-sm font-medium">Forget Password?</Text>
            </TouchableOpacity>

            {/* Keep me logged in */}
            {/* <View className="flex-row items-center mt-2">
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#ff7f50' : undefined}
                style={{ marginRight: 8, borderRadius: 4 }}
              />
              <Text className="text-gray-600">{t('keep_logged_in')}</Text>
            </View> */}

            {/* Login Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              className="bg-[#0f172a] rounded-full py-4 flex-row justify-center items-center mt-6 shadow-md"
            >
              <Text className="text-white font-bold text-lg">{t('login')}</Text>
            </TouchableOpacity>

             {/* Create Account Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500">{t('Or')} </Text>
            </View>

            {/* Google Login */}
            <TouchableOpacity className="flex-row justify-center items-center mt-4 bg-white border border-gray-300 rounded-full py-4 shadow-sm">
              <Image 
                 source={require('../assets/google_logo.png')} 
                style={{ width: 24, height: 24, marginRight: 12 }} 
                resizeMode="contain"
              />
              <Text className="text-gray-700 font-medium text-lg">Sign In with Google</Text>
            </TouchableOpacity>

             {/* Create Account Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500">{t('new_user')} </Text>
              <TouchableOpacity>
                <Text className="text-[#0f5279] font-bold">{t('create_account')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
