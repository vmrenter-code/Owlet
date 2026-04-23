import {View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity, Modal, FlatList} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

import InputFields from '../components/InputFields';
import PrimaryBlueButton from '../components/PrimaryBlueButton';
import LargeInput from '../components/LargeInput';
import HomeBg from '../components/HomeBg';

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

function Dropdown({ placeholder, options, value, onChange }: {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.dropdown} onPress={() => setOpen(true)}>
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value || placeholder}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>{placeholder}</Text>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.option, item === value && styles.optionSelected]}
                      onPress={() => { onChange(item); setOpen(false); }}
                    >
                      <Text style={[styles.optionText, item === value && styles.optionTextSelected]}>
                        {item}
                      </Text>
                      {item === value }
                    </TouchableOpacity>
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
  const { height } = useWindowDimensions();

  const isSmallDevice = height < 700;

  const [dob, setDob] = useState('');
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>

        <View style={styles.formatBg} pointerEvents="none">
          <HomeBg />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + (isSmallDevice ? 16 : 24),
              paddingBottom: insets.bottom + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            <View style={styles.titleContainer}>
              <Text style={[styles.titleStyle, isSmallDevice && { fontSize: 24 }]}>
                About Your Child
              </Text>
              <Text style={[styles.subtitleStyle, isSmallDevice && { fontSize: 14 }]}>
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
                <InputFields
                  placeholder="Date of Birth (MM/DD/YYYY)"
                  keyboardType="number-pad"
                  value={dob}
                  onChangeText={(text) => setDob(formatDOB(text))}
                  maxLength={10}
                />
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
                  height={isSmallDevice ? 110 : 140}
                />
              </View>
            </View>

            <View style={styles.bottomSection}>
              <PrimaryBlueButton
                onPress={() => navigation.replace('PickProfile')}
                disabled={!isFormValid}
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
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    gap: 4,
  },
  titleContainer: {
    gap: 6,
    marginBottom: 6,
  },
  titleStyle: {
    fontSize: 22,
    color: '#151515',
    fontFamily: 'NotoSans-SemiBold',
  },
  subtitleStyle: {
    fontSize: 15,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
    lineHeight: 22,
  },
  section: {
    gap: 10,
    marginTop: 10,
  },
  subHeader: {
    fontSize: 17,
    color: '#2E3332',
    fontFamily: 'NotoSans-SemiBold',
  },
  fieldGroup: {
    gap: 10,
  },
  bottomSection: {
    marginTop: 24,
    width: '100%',
  },

  // Dropdown
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 17,
    borderColor: '#F0F1F1',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 1
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: '#2E3332',
    padding: 0,
    margin: 0,
  },
  dropdownPlaceholder: {
    color: '#2E3332',
  },
  chevron: {
    fontSize: 20,
    color: '#2E3332',
    transform: [{ rotate: '90deg' }],
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'NotoSans-SemiBold',
    color: '#2E3332',
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
    backgroundColor: '#F0F7FF',
  },
  optionText: {
    fontSize: 15,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
  },
  optionTextSelected: {
    color: '#1A6FE0',
    fontFamily: 'NotoSans-SemiBold',
  },

});