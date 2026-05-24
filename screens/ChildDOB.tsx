import { View, Text, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import OnboardingLayout from '../components/OnboardingLayout';
import CalendarPicker from '../components/CalendarPicker';

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${y}`;
}

export default function ChildDOB() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { childName } = route.params ?? {};

  const [dobIso, setDobIso] = useState<string | null>(null);

  const defaultViewDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 2);
    return d;
  }, []);

  const handleNext = () => {
    if (!dobIso) return;
    navigation.navigate('ChildBackground', { childName, dob: formatDisplayDate(dobIso) });
  };

  return (
    <View style={{ flex: 1 }}>
      <OnboardingLayout
        step={2}
        totalSteps={5}
        onBack={() => navigation.goBack()}
        onNext={handleNext}
        canProceed={!!dobIso}
      >
          <View style={styles.stepContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleStyle}>When were they born?</Text>
              <Text style={styles.subtitleStyle}>
                We use this to personalize their screening.
              </Text>
            </View>

            {dobIso ? (
              <View style={styles.selectedDateBadge}>
                <Text style={styles.selectedDateText}>{formatDisplayDate(dobIso)}</Text>
              </View>
            ) : null}

            <View style={styles.calendarWrapper}>
              <CalendarPicker
                value={dobIso}
                maxDate={new Date()}
                defaultViewDate={defaultViewDate}
                onChange={setDobIso}
              />
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
  calendarWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#1a1a1a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  selectedDateBadge: {
    alignSelf: 'center',
    backgroundColor: '#f3f0fa',
    borderWidth: 1,
    borderColor: '#5058b4',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectedDateText: {
    fontSize: 13,
    fontFamily: 'NotoSans-SemiBold',
    color: '#5058b4',
    letterSpacing: 0.1,
  },
});
