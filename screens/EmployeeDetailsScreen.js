import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AppSession from '../services/AppSession';
import ApiWrapper from '../constants/ApiWrapper';

const DetailRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <View className="flex-row justify-between py-3 border-b border-gray-100">
      <Text className="text-gray-500 font-medium text-sm">{label}</Text>
      <Text className="text-[#0f172a] font-semibold text-sm text-right flex-1 ml-4">{value}</Text>
    </View>
  );
};

const DetailSection = ({ title, children }) => (
  <View className="bg-white rounded-3xl p-4 mb-6 shadow-sm mx-4">
    <Text className="text-[#0f172a] font-bold text-base mb-3 border-b border-gray-100 pb-2">{title}</Text>
    {children}
  </View>
);

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export default function EmployeeDetailsScreen({ navigation }) {
  const { t } = useTranslation();
  const employee = AppSession.employee;
  const addresses = AppSession.employeeAddresses || [];

  if (!employee) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 font-medium">{t('no_employee_details')}</Text>
      </SafeAreaView>
    );
  }

  const avatarUri = employee.largeImageUrl
    ? (employee.largeImageUrl.startsWith('http') ? employee.largeImageUrl : `${ApiWrapper.API_CONTENT_URL_PREFIX}/${employee.largeImageUrl}`)
    : (employee.smallImageUrl
      ? (employee.smallImageUrl.startsWith('http') ? employee.smallImageUrl : `${ApiWrapper.API_CONTENT_URL_PREFIX}/${employee.smallImageUrl}`)
      : null);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-[#0f172a] font-bold text-lg text-center mr-8">
          {t('details')}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="items-center py-6 bg-white border-b border-gray-100 mb-6">
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-sm mb-3"
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={96}
              color="#9ca3af"
              className="mb-3"
            />
          )}
          <Text className="text-[#0f172a] font-bold text-xl mb-1">{employee.name}</Text>
          <Text className="text-gray-500 text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full">
            {employee.designation}
          </Text>
        </View>

        <DetailSection title={t('employment_info')}>
          <DetailRow label={t('role')} value={employee.roles} />
          <DetailRow label={t('department')} value={employee.department} />
          <DetailRow label={t('designation')} value={employee.designation} />
          <DetailRow label={t('employee_type')} value={employee.employeeTypeName} />
          <DetailRow label={t('branches')} value={employee.branches} />
          <DetailRow label={t('joining_date')} value={formatDate(employee.joiningDate)} />
        </DetailSection>

        <DetailSection title={t('personal_info')}>
          <DetailRow label={t('pin')} value={employee.pin} />
          <DetailRow label={t('father_name')} value={employee.fatherName} />
          <DetailRow label={t('mother_name')} value={employee.motherName} />
          <DetailRow label={t('contact_no')} value={employee.contactNumber1 || employee.contactNumber2} />
          <DetailRow label={t('dob')} value={formatDate(employee.dob)} />
          <DetailRow label={t('gender')} value={employee.gender} />
          <DetailRow label={t('nationality')} value={employee.nationality} />
          <DetailRow label={t('religion')} value={employee.religion} />
          <DetailRow label={t('blood_group')} value={employee.bloodGroup} />
          <DetailRow label={t('marital_status')} value={employee.maritalStatus} />
          <DetailRow label={t('birth_city')} value={employee.birthCity} />
          <DetailRow label={t('birth_country')} value={employee.birthCountry} />
        </DetailSection>

        {addresses.length > 0 && (
          <DetailSection title={t('address_info')}>
            {addresses.map((addr) => (
              <View key={addr.id} className="mb-3">
                <Text className="text-[#0f172a] font-semibold text-sm mb-1">{addr.addressTypeName}</Text>
                <Text className="text-gray-500 text-sm">{addr.addressBody}</Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  {[addr.districtOrStateName, addr.countryName, addr.zipCode].filter(Boolean).join(', ')}
                </Text>
              </View>
            ))}
          </DetailSection>
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
