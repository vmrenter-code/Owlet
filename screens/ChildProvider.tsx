import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import InputFields from '../components/InputFields';
import OnboardingLayout from '../components/OnboardingLayout';

export default function ChildProvider() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { childName, dob, race, ethnicity, gender, flow = 'onboarding' } = route.params ?? {};

  const [providerName, setProviderName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [npi, setNpi] = useState('');

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (text: string) => {
    setPhone(formatPhone(text));
  };

  const formatNpi = (text: string) => {
    return text.replace(/\D/g, '').slice(0, 10);
  };

  const handleNext = () => {
    navigation.navigate('ChildMedical', {
      childName,
      dob,
      race,
      ethnicity,
      gender,
      providerName: providerName.trim() || undefined,
      clinicName: clinicName.trim() || undefined,
      providerPhone: phone || undefined,
      providerAddress: address.trim() || undefined,
      npi: npi || undefined,
      flow,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <OnboardingLayout
        step={4}
        totalSteps={6}
        onBack={() => navigation.goBack()}
        onNext={handleNext}
        canProceed={true}
      >
        <View style={styles.stepContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStyle}>Provider information</Text>
            <Text style={styles.subtitleStyle}>
              Add your child's doctor or care team. You can skip this if you prefer.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Provider name</Text>
              <InputFields
                placeholder="e.g. Dr. Jane Smith"
                value={providerName}
                onChangeText={setProviderName}
                returnKeyType="next"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Clinic or practice</Text>
              <InputFields
                placeholder="e.g. Sunrise Pediatrics"
                value={clinicName}
                onChangeText={setClinicName}
                returnKeyType="next"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Phone number</Text>
              <InputFields
                placeholder="(555) 000-0000"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Address</Text>
              <InputFields
                placeholder="Street, city, state, ZIP"
                value={address}
                onChangeText={setAddress}
                returnKeyType="next"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>NPI number</Text>
              <InputFields
                placeholder="10-digit NPI"
                value={npi}
                onChangeText={(text) => setNpi(formatNpi(text))}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={10}
              />
              {npi.length > 0 && npi.length < 10 && (
                <Text style={styles.fieldHint}>{npi.length}/10 digits</Text>
              )}
            </View>
          </View>
        </View>
      </OnboardingLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContent: {
    gap: 20,
  },

  titleContainer: {
    gap: 6,
    marginBottom: 8,
  },

  titleStyle: {
    fontSize: 22,
    color: '#151515',
    fontFamily: 'NotoSans-SemiBold',
    letterSpacing: -0.2,
  },

  subtitleStyle: {
    fontSize: 15,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
    lineHeight: 21,
    letterSpacing: 0.1,
  },

  fieldGroup: {
    gap: 16,
  },

  fieldWrapper: {
    gap: 6,
  },

  fieldLabel: {
    fontSize: 13,
    fontFamily: 'NotoSans-SemiBold',
    color: '#2E3332',
    letterSpacing: 0.1,
    paddingLeft: 4,
  },

  fieldHint: {
    fontSize: 12,
    fontFamily: 'NotoSans-Regular',
    color: '#888',
    letterSpacing: 0.1,
    paddingLeft: 4,
    marginTop: 2,
  },
});