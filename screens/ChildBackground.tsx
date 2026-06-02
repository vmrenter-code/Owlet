import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import BackArrow from '../components/OnboardingBack';
import OnboardingLayout from '../components/OnboardingLayout';

const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
];

const RACE_OPTIONS = [
  'American Indian or Alaska Native',
  'Asian',
  'Black or African American',
  'Native Hawaiian or Other Pacific Islander',
  'White',
  'Two or More Races',
  'Other',
  'Prefer not to say',
];

const ETHNICITY_OPTIONS = [
  'Hispanic or Latino',
  'Not Hispanic or Latino',
  'Prefer not to say',
];

const ChevronDown = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke="#aaa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

function Dropdown({ placeholder, options, value, onChange }: {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.dropdown, pressed && styles.dropdownPressed]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={value || placeholder}
        accessibilityHint={`Opens ${placeholder} picker`}
        hitSlop={{ top: 4, bottom: 4 }}
      >
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown />
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>{placeholder}</Text>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Pressable
                      style={({ pressed }) => [
                        styles.option,
                        item === value && styles.optionSelected,
                        pressed && styles.optionPressed,
                      ]}
                      onPress={() => { onChange(item); setOpen(false); }}
                      accessibilityRole="radio"
                      accessibilityLabel={item}
                      accessibilityState={{ checked: item === value }}
                    >
                      <Text style={[styles.optionText, item === value && styles.optionTextSelected]}>
                        {item}
                      </Text>
                      {item === value && (
                        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                          <Path d="M5 12l5 5L20 7" stroke="#4a8f8f" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                      )}
                    </Pressable>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

export default function ChildBackground() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { childName, dob, flow = 'onboarding' } = route.params ?? {};
  const [gender, setGender] = useState('');

  const [race, setRace] = useState('');
  const [ethnicity, setEthnicity] = useState('');

  const handleNext = () => {
  navigation.navigate('ChildMedical', {
    childName,
    dob,
    race,
    ethnicity,
    gender,
    flow,
  });
};

  return (
      <View style={{ flex: 1 }}>
        <OnboardingLayout
          step={3}
          totalSteps={5}
          onBack={() => navigation.goBack()}
          onNext={handleNext}
          canProceed={true}
        >
            <View style={styles.stepContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>Personal details</Text>
                <Text style={styles.subtitleStyle}>This helps us provide better context. This step is optional.</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Dropdown
                  placeholder="Race"
                  options={RACE_OPTIONS}
                  value={race}
                  onChange={setRace}
                />
                <Dropdown
                  placeholder="Ethnicity"
                  options={ETHNICITY_OPTIONS}
                  value={ethnicity}
                  onChange={setEthnicity}
                />

                <View style={styles.fieldGroup}>
  
  <Dropdown
    placeholder="Gender"
    options={GENDER_OPTIONS}
    value={gender}
    onChange={setGender}
  />
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
    gap: 12,
  },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    shadowColor: '#1a1a1a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  dropdownPressed: {
    opacity: 0.75,
  },

  dropdownText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'NotoSans-Regular',
    color: '#151515',
  },

  dropdownPlaceholder: {
    color: '#aaa',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: '65%',
  },

  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: 'NotoSans-SemiBold',
    color: '#151515',
    letterSpacing: -0.2,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  optionSelected: {
    backgroundColor: '#f0fafa',
  },

  optionPressed: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },

  optionText: {
    fontSize: 15,
    color: '#151515',
    fontFamily: 'NotoSans-Regular',
    letterSpacing: 0.1,
  },

  optionTextSelected: {
    color: '#4a8f8f',
    fontFamily: 'NotoSans-SemiBold',
  },
});