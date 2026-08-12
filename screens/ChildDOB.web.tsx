import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import OnboardingLayout from '../components/OnboardingLayout';

/**
 * @react-native-community/datetimepicker has no web implementation (it just
 * renders null and warns), so this uses a native HTML date input instead.
 * See ChildDOB.native.tsx for the mobile implementation.
 */
export default function ChildDOB() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { childName, flow = 'onboarding' } = route.params ?? {};

  const [dob, setDob] = useState('');
  const [isoValue, setIsoValue] = useState('');

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${m}/${d}/${y}`;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setIsoValue(value);
    setDob(value ? formatDate(value) : '');
  };

  const handleNext = () => {
    if (!dob) return;
    navigation.navigate('ChildBackground', { childName, dob, flow });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={{ flex: 1 }}>
      <OnboardingLayout
        step={2}
        totalSteps={6}
        onBack={() => navigation.goBack()}
        onNext={handleNext}
        canProceed={!!dob}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.stepContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleStyle}>When were they born?</Text>
              <Text style={styles.subtitleStyle}>
                We use this to personalize their screening.
              </Text>
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Birthday</Text>
              <View style={styles.inputBox}>
                {React.createElement('input', {
                  type: 'date',
                  value: isoValue,
                  max: today,
                  onChange: handleChange,
                  style: {
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 15,
                    fontFamily: 'NotoSans-Regular',
                    color: '#151515',
                    width: '100%',
                  },
                })}
              </View>
            </View>
          </View>
        </ScrollView>
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
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'NotoSans-SemiBold',
    color: '#2E3332',
    letterSpacing: 0.1,
    paddingLeft: 4,
  },
  fieldWrapper: {
    gap: 6,
  },
});
