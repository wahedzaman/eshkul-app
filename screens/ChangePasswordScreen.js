import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default function ChangePasswordScreen({ navigation }) {
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const isFormValid = currentPassword.trim() !== '' && newPassword.trim() !== '' && confirmPassword.trim() !== '' && newPassword === confirmPassword;
    const handleSubmit = () => {
        if (!isFormValid) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert(
                t('success'),
                t('password_change_success'),
                [
                    {
                        text: t('ok'),
                        onPress: () => navigation.goBack(),
                    }
                ]
            );
        }, 1500);
    };
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
                        <Ionicons name="arrow-back" size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-[#0f172a] font-bold text-lg text-center mr-8">
                        {t('change_password')}
                    </Text>
                </View>
                <KeyboardAwareScrollView 
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }} 
                    className="px-6 pt-6"
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    extraScrollHeight={Platform.OS === 'ios' ? 40 : 80}
                >
                    <Modal transparent={true} visible={isLoading} animationType="fade">
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                                <ActivityIndicator size="large" color="#0f5279" />
                                <Text style={{ marginTop: 10, color: '#0f5279' }}>{t('submitting')}</Text>
                            </View>
                        </View>
                    </Modal>
                    <View className="items-center mb-10 mt-4">
                        <Image
                            source={require('../assets/logo.png')}
                            style={{ width: 160, height: 96 }}
                            resizeMode="contain"
                        />
                    </View>
                    <View className="space-y-4">
                        <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm">
                            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-3" />
                            <TextInput
                                placeholder={t('current_password')}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrent}
                                autoCapitalize="none"
                                style={{ flex: 1, color: '#374151' }}
                                placeholderTextColor="#9ca3af"
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => newPasswordRef.current?.focus()}
                            />
                            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                                <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm mt-2">
                            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-3" />
                            <TextInput
                                ref={newPasswordRef}
                                placeholder={t('new_password')}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNew}
                                autoCapitalize="none"
                                style={{ flex: 1, color: '#374151' }}
                                placeholderTextColor="#9ca3af"
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                            />
                            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center bg-white rounded-full px-6 py-4 border border-gray-100 shadow-sm mt-2">
                            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-3" />
                            <TextInput
                                ref={confirmPasswordRef}
                                placeholder={t('confirm_password')}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirm}
                                autoCapitalize="none"
                                style={{ flex: 1, color: '#374151' }}
                                placeholderTextColor="#9ca3af"
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!isFormValid}
                            style={{ opacity: isFormValid ? 1 : 0.5 }}
                            className="bg-[#0f172a] rounded-full py-4 flex-row justify-center items-center mt-6 shadow-md"
                        >
                            <Text className="text-white font-bold text-lg">{t('submit')}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}