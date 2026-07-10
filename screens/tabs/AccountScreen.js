import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import AppSession from '../../services/AppSession';
import AccountManager from '../../services/AccountManager';
import ApiWrapper from '../../constants/ApiWrapper';
import AccountSwitcherDialog from '../../components/AccountSwitcherDialog';

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

const ProfileHeader = ({ onPress }) => {
  const { t } = useTranslation();
  const student = AppSession.student;

  const avatarUri = student.largeImageUrl
    ? (student.largeImageUrl.startsWith('http') ? student.largeImageUrl : `${ApiWrapper.API_CONTENT_URL_PREFIX}/${student.largeImageUrl}`)
    : (student.smallImageUrl
      ? (student.smallImageUrl.startsWith('http') ? student.smallImageUrl : `${ApiWrapper.API_CONTENT_URL_PREFIX}/${student.smallImageUrl}`)
      : null);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!student}
      activeOpacity={0.7}
      className="bg-white rounded-3xl p-4 mb-6 shadow-sm mx-4 flex-row items-center"
    >
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          className="w-14 h-14 rounded-full mr-4"
        />
      ) : (
        <Ionicons
          name="person-circle-outline"
          size={56}
          color="#9ca3af"
          className="mr-4"
        />
      )}
      <View className="flex-1">
        <Text className="text-[#0f172a] font-bold text-lg">
          {student?.name || AppSession.userName || ''}
        </Text>
        {student ? (
          <>
            <Text className="text-gray-500 text-sm">
              {t('roll_no')} {student.currentRollNo}
            </Text>
            <Text className="text-gray-500 text-sm">
              {t('class_label')} {student.academicClass}
            </Text>
            <Text className="text-gray-500 text-sm">
              {t('email')}: {student.emailAddress ?? 'N/A'}
            </Text>
          </>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );
};

export default function AccountScreen({ navigation }) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);

  const handleConfirmLogout = async () => {
    setIsModalVisible(false);
    const currentId = AccountManager.getActiveAccountId();
    const remaining = await AccountManager.removeAccount(currentId);
    await AppSession.clearSession();

    if (remaining.length > 0) {
      const nextAccount = remaining[0];
      await AccountManager.switchTo(nextAccount.id);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppContainer' }],
        })
      );
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const handleAccountSwitch = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AppContainer' }],
      })
    );
  };

  const handleAddAccount = () => {
    navigation.navigate('Login', { addAccount: true });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 pt-4">
        {/* Profile Header */}
        <ProfileHeader onPress={() => navigation.navigate('StudentDetails')} />

        {/* Account Management */}
        <MenuGroup title={t('account_management')} >
          <MenuItem
            icon="people-outline"
            label={t('account_switching')}
            onPress={() => setIsSwitcherVisible(true)}
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

        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="mx-4 mt-2 mb-8 bg-red-50 py-4 rounded-3xl border border-red-100 items-center justify-center flex-row"
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" className="mr-2" />
          <Text className="text-red-500 font-bold text-base">{t('logout')}</Text>
        </TouchableOpacity>

        <View className="h-20" />
      </ScrollView>

      <AccountSwitcherDialog
        visible={isSwitcherVisible}
        onClose={() => setIsSwitcherVisible(false)}
        onSwitch={handleAccountSwitch}
        onAddAccount={handleAddAccount}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white rounded-t-3xl p-6"
          >
            <Text className="text-[#0f172a] font-bold text-lg text-center mb-2">
              {t('confirm_logout_title')}
            </Text>

            <Text className="text-gray-500 text-sm text-center mb-6">
              {t('confirm_logout_desc')}
            </Text>

            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="flex-1 bg-gray-100 py-3.5 rounded-2xl items-center mr-2"
              >
                <Text className="text-gray-700 font-bold text-base">
                  {t('cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmLogout}
                className="flex-1 bg-red-500 py-3.5 rounded-2xl items-center ml-2"
              >
                <Text className="text-white font-bold text-base">
                  {t('logout')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
