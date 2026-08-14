import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, Modal, ActivityIndicator, Alert, findNodeHandle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@react-navigation/native';
import AuthService from '../services/AuthService';
import AccountManager from '../services/AccountManager';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function LoginScreen({ navigation, route }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef(null);
  const scrollRef = useRef(null);

  const isAddAccountMode = route?.params?.addAccount === true;
  const isFormValid = username.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormValid) return;

    const existingAccounts = await AccountManager.getAccounts();
    const alreadyLoggedIn = existingAccounts.find(
      a => a.userName.toLowerCase() === username.trim().toLowerCase()
    );
    if (alreadyLoggedIn) {
      Alert.alert(
        t('failed'),
        t('account_already_logged_in'),
        [{ text: t('ok') }]
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.login(username.trim(), password.trim());
      setIsLoading(false);

      if (response.success) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AppContainer' }],
          })
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
        <KeyboardAwareScrollView 
          ref={scrollRef}
          contentContainerStyle={{ flexGrow: 1, marginTop: 50, paddingBottom: 50 }} 
          className="px-6"
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 40 : 80}
        >
          <Modal transparent={true} visible={isLoading} animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <ActivityIndicator size="large" color="#0f5279" />
                <Text style={{ marginTop: 10, color: '#0f5279' }}>{t('logging_in')}</Text>
              </View>
            </View>
          </Modal>

          <View className="flex-row items-center mt-4 mb-10">
            {isAddAccountMode && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginRight: 12 }}
              >
                <Ionicons name="arrow-back" size={24} color="#0f172a" />
              </TouchableOpacity>
            )}
            {isAddAccountMode && (
              <Text className="text-lg font-bold text-[#0f172a]">{t('add_account')}</Text>
            )}
          </View>

          <View className="items-center mb-10">
            <Image
              source={require('../assets/logo.png')}
              style={{ width: 160, height: 96 }}
              resizeMode="contain"
            />
          </View>

          <View className="space-y-4">
            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
              <Ionicons name="person-outline" size={20} color="#9ca3af" className="mr-3" />
              <TextInput
                placeholder={t('user_id')}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={{ flex: 1, color: '#374151' }}
                placeholderTextColor="#9ca3af"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                  setTimeout(() => {
                    const node = findNodeHandle(passwordRef.current);
                    if (node) scrollRef.current?.scrollToFocusedInput(node);
                  }, 50);
                }}
              />
            </View>

            <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm mt-2">
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-3" />
              <TextInput
                ref={passwordRef}
                placeholder={t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={{ flex: 1, color: '#374151' }}
                placeholderTextColor="#9ca3af"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={!isFormValid}
              style={{ opacity: isFormValid ? 1 : 0.5 }}
              className="bg-[#0f172a] rounded-full py-4 flex-row justify-center items-center mt-6 shadow-md"
            >
              <Text className="text-white font-bold text-lg">{t('login')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
