import React from 'react';
import { View, Text, ScrollView, Image, SafeAreaView, TouchableOpacity } from 'react-native';
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

export default function StudentDetailsScreen({ navigation }) {
  const { t } = useTranslation();
  const student = AppSession.student;

  if (!student) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 font-medium">{t('no_student_details') || 'No student details available'}</Text>
      </SafeAreaView>
    );
  }

  const avatarUri = student.largeImageUrl
    ? (student.largeImageUrl.startsWith('http') ? student.largeImageUrl : `${ApiWrapper.BASE_URL}/${student.largeImageUrl}`)
    : (student.smallImageUrl
      ? (student.smallImageUrl.startsWith('http') ? student.smallImageUrl : `${ApiWrapper.BASE_URL}/${student.smallImageUrl}`)
      : null);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-[#0f172a] font-bold text-lg text-center mr-8">
          {t('student_details')}
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
          <Text className="text-[#0f172a] font-bold text-xl mb-1">{student.name}</Text>
          <Text className="text-gray-500 text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full">
            {t('roll_no')} {student.currentRollNo}
          </Text>
        </View>

        <DetailSection title={t('academic_info')}>
          <DetailRow label={t('class_label')} value={student.academicClass} />
          <DetailRow label={t('section')} value={student.academicSection} />
          <DetailRow label={t('group')} value={student.academicGroup} />
          <DetailRow label={t('shift')} value={student.academicShift} />
          <DetailRow label={t('session')} value={student.academicSession} />
          <DetailRow label={t('branch')} value={student.academicBranch} />
        </DetailSection>

        <DetailSection title={t('personal_info')}>
          <DetailRow label={t('pin')} value={student.pin} />
          <DetailRow label={t('father_name')} value={student.fatherName} />
          <DetailRow label={t('mother_name')} value={student.motherName} />
          <DetailRow label={t('contact_no')} value={student.contactNumber1 || student.contactNumber2} />
          <DetailRow label={t('joining_date')} value={student.joiningDate} />
        </DetailSection>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
