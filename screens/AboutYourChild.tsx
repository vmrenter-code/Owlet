import {View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable, Modal, FlatList, Platform} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';

import InputFields from '../components/InputFields';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import LargeInput from '../components/LargeInput';
import HomeBg from '../components/HomeBg';
import BackArrow from '../components/BackArrow';
import CalendarPicker from '../components/CalendarPicker';

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
    <Path
      d="M6 9l6 6 6-6"
      stroke="#aaa"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
                          <Path
                            d="M5 12l5 5L20 7"
                            stroke="#4a8f8f"
                            strokeWidth={2.2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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

export default function AboutYourChild() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [dob, setDob] = useState('');
  const [dobIso, setDobIso] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [childName, setChildName] = useState('');
  const [race, setRace] = useState('');
  const [ethnicity, setEthnicity] = useState('');

  const isFormValid = childName.trim().length > 0 && dob.length === 10;

  const formatDOB = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  };

  const handleCalendarChange = (isoDate: string) => {
    setDobIso(isoDate);
    const [y, m, d] = isoDate.split('-');
    setDob(`${m}/${d}/${y}`);
  };

  const handleDismissDatePicker = () => setShowDatePicker(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>

        <View style={styles.formatBg} pointerEvents="none">
          <HomeBg />
        </View>

        <View style={[styles.backArrowWrapper, { paddingTop: insets.top + 8 }]}>
          <BackArrow />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 56,
              paddingBottom: insets.bottom + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            <View style={styles.titleContainer}>
              <Text style={styles.titleStyle}>
                About Your Child
              </Text>
              <Text style={styles.subtitleStyle}>
                Enter your child's first name. You can also add their birth date, background, and any relevant medical or developmental history.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.subHeader}>Basic Info</Text>
              <View style={styles.fieldGroup}>
                <InputFields
                  placeholder="Child's Name"
                  maxLength={15}
                  value={childName}
                  onChangeText={setChildName}
                />

                <Pressable
                  style={({ pressed }) => [styles.dropdown, pressed && styles.dropdownPressed]}
                  onPress={() => setShowDatePicker(true)}
                  accessibilityRole="button"
                  accessibilityLabel={dob || 'Select date of birth'}
                  hitSlop={{ top: 4, bottom: 4 }}
                >
                  <Text style={[styles.dropdownText, !dob && styles.dropdownPlaceholder]}>
                    {dob || 'Date of Birth (MM/DD/YYYY)'}
                  </Text>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="#aaa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </Pressable>

                <Modal visible={showDatePicker} transparent animationType="slide">
                  <TouchableWithoutFeedback onPress={handleDismissDatePicker}>
                    <View style={styles.modalOverlay}>
                      <TouchableWithoutFeedback>
                        <View style={[styles.modalSheet, styles.calendarSheet, { paddingBottom: insets.bottom + 16 }]}>
                          <View style={styles.modalHandle} />
                          <Text style={styles.modalTitle}>Date of Birth</Text>
                          <View style={styles.calendarWrapper}>
                            <CalendarPicker
                              value={dobIso}
                              onChange={handleCalendarChange}
                              maxDate={new Date()}
                            />
                          </View>
                          <Pressable
                            style={styles.dateConfirmButton}
                            onPress={handleDismissDatePicker}
                            accessibilityRole="button"
                            accessibilityLabel="Confirm date of birth"
                          >
                            <Text style={styles.dateConfirmText}>Confirm</Text>
                          </Pressable>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>

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
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.subHeader}>Medical History</Text>
              <View style={styles.fieldGroup}>
                <LargeInput
                  placeholder="Type here..."
                  multiline
                  height={140}
                />
              </View>
            </View>

            <View style={styles.bottomSection}>
              <PrimaryBlueButton
                onPress={() => navigation.replace('PickProfile')}
                disabled={!isFormValid}
                fullWidth
              >
                Continue
              </PrimaryBlueButton>
            </View>

          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formatBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 0,
  },

  backArrowWrapper: {
    position: 'absolute',
    top: 0,
    left: 8,
    zIndex: 100,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 8,
  },

  titleContainer: {
    gap: 6,
    marginBottom: 6,
  },

  titleStyle: {
    fontSize: 22,
    color: '#151515',
    fontFamily: 'NotoSans-SemiBold',
    letterSpacing: -0.2,
  },

  subtitleStyle: {
    fontSize: 15,
    color: '#888',
    fontFamily: 'NotoSans-Regular',
    lineHeight: 21,
    letterSpacing: 0.1,
  },

  section: {
    gap: 10,
    marginTop: 10,
  },

  subHeader: {
    fontSize: 18,
    color: '#151515',
    fontFamily: 'NotoSans-SemiBold',
    letterSpacing: -0.2,
  },

  fieldGroup: {
    gap: 12,
  },

  bottomSection: {
    marginTop: 24,
    width: '100%',
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
    padding: 0,
    margin: 0,
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

  calendarSheet: {
    maxHeight: '85%',
  },

  calendarWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 8,
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

  dateConfirmButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 100,
    backgroundColor: '#4a8f8f',
    alignItems: 'center',
    shadowColor: '#2a5f5f',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },

  dateConfirmText: {
    fontSize: 15,
    fontFamily: 'NotoSans-SemiBold',
    color: '#ffffff',
    letterSpacing: 0.1,
  },
});