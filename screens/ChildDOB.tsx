import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import OnboardingLayout from '../components/OnboardingLayout';

export default function ChildDOB() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { childName } = route.params ?? {};

  const [dob, setDob] = useState('');
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const y = date.getFullYear();
    return `${m}/${d}/${y}`;
  };

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      setDobDate(selectedDate);
      setDob(formatDate(selectedDate));
    }
  };

  const handleNext = () => {
    navigation.navigate('ChildBackground', { childName, dob });
  };

  return (
    <View style={{ flex: 1 }}>
      <OnboardingLayout
        step={2}
        totalSteps={5}
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

            {/* Trigger field */}
            <Pressable
              onPress={() => setShowPicker(true)}
              style={styles.inputBox}
            >
              <Text style={[styles.inputText, !dob && styles.placeholder]}>
                {dob || 'Select date of birth'}
              </Text>
            </Pressable>

            {/* Native picker */}
            {showPicker && (
              <DateTimePicker
                value={dobDate || new Date()}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={handleChange}
              />
            )}

           

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

  inputBox: {
  backgroundColor: '#fff',
  borderRadius: 100,
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.1)',
},

inputText: {
  fontSize: 15,
  fontFamily: 'NotoSans-Regular',
  color: '#151515',
},

placeholder: {
  color: '#aaa',
},
});