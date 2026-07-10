import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ActivityIndicator, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AccountManager from '../services/AccountManager';
import ApiWrapper from '../constants/ApiWrapper';
import Strings from '../constants/Strings';
import Colors from '../constants/Colors';

const AccountRow = ({ account, isActive, onSwitch, t }) => {
  const avatarUri = account.userSmallImage
    ? (account.userSmallImage.startsWith('http')
      ? account.userSmallImage
      : `${ApiWrapper.API_CONTENT_URL_PREFIX}/${account.userSmallImage}`)
    : null;

  const userTypeLabel = () => {
    switch (account.userType) {
      case Strings.USER_TYPES.STUDENT:
        return t('student_label');
      case Strings.USER_TYPES.TEACHER:
        return t('teacher_label');
      case Strings.USER_TYPES.EMPLOYEE:
        return t('employee_label');
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onSwitch(account.id)}
      disabled={isActive}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: isActive ? '#f0f9ff' : 'transparent',
        borderRadius: 16,
        marginBottom: 6,
        borderWidth: isActive ? 1 : 0,
        borderColor: isActive ? '#bae6fd' : 'transparent',
      }}
    >
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 }}
        />
      ) : (
        <View style={{ marginRight: 12 }}>
          <Ionicons name="person-circle-outline" size={44} color={Colors.gray[400]} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#0f172a' }}>
          {account.userName}
        </Text>
        <Text style={{ fontSize: 13, color: Colors.gray[500], marginTop: 2 }}>
          {userTypeLabel()}
        </Text>
      </View>
      {isActive ? (
        <View style={{
          backgroundColor: '#0f5279',
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700' }}>
            {t('active_account')}
          </Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
      )}
    </TouchableOpacity>
  );
};

export default function AccountSwitcherDialog({ visible, onClose, onSwitch, onAddAccount }) {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (visible) {
      loadAccounts();
    }
  }, [visible]);

  const loadAccounts = async () => {
    const list = await AccountManager.getAccounts();
    setAccounts(list);
    setActiveId(AccountManager.getActiveAccountId());
  };

  const handleSwitch = async (accountId) => {
    if (accountId === activeId) return;

    setIsSwitching(true);
    const result = await AccountManager.switchTo(accountId);
    setIsSwitching(false);

    if (result.success) {
      onClose();
      onSwitch();
    } else {
      Alert.alert(t('error'), t('login_error'), [{ text: t('ok') }]);
    }
  };

  const renderItem = ({ item }) => (
    <AccountRow
      account={item}
      isActive={item.id === activeId}
      onSwitch={handleSwitch}
      t={t}
    />
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            paddingBottom: 30,
            maxHeight: '70%',
          }}
        >
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: '#d1d5db',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 16,
          }} />

          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#0f172a',
            textAlign: 'center',
            marginBottom: 16,
          }}>
            {t('switch_account')}
          </Text>

          {isSwitching && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
            }}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={{ marginLeft: 8, color: Colors.gray[500], fontSize: 14 }}>
                {t('switching_account')}
              </Text>
            </View>
          )}

          <FlatList
            data={accounts}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            scrollEnabled={accounts.length > 4}
          />

          <TouchableOpacity
            onPress={() => {
              onClose();
              onAddAccount();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 12,
              marginHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: '#f1f5f9',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              borderStyle: 'dashed',
            }}
          >
            <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
            <Text style={{
              marginLeft: 8,
              fontSize: 15,
              fontWeight: '600',
              color: Colors.primary,
            }}>
              {t('add_account')}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
