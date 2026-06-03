import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import LargeInput from '../components/LargeInput';
import OnboardingLayout from '../components/OnboardingLayout';
import { useChild } from '../context/ChildContext';
import { createChildViaApi } from '../src/services/childApiService';
import { birthdayToIso, isAddChildFlow } from '../utils/childFlow';

const MEDICAL_CHIPS = [
  'Premature birth',
  'NICU stay',
  'Previous diagnosis',
  'Speech delay',
  'Motor delay',
  'Hearing loss',
  'Vision issues',
  'Seizures',
  'Allergies',
  'None of the above',
];

export default function ChildMedical() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { childName, dob, race, ethnicity, gender, flow = 'onboarding' } = route.params ?? {};

  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const { updateChildren, selectChild } = useChild();
  const addingChild = isAddChildFlow(flow);

  const toggleChip = (chip: string) => {
    if (chip === 'None of the above') {
      setSelectedChips(['None of the above']);
      return;
    }
    setSelectedChips((prev) => {
      const without = prev.filter((c) => c !== 'None of the above');
      return without.includes(chip)
        ? without.filter((c) => c !== chip)
        : [...without, chip];
    });
  };

  const handleContinue = async () => {
    if (saving) return;
    if (!childName?.trim()) {
      Alert.alert('Name required', 'Go back and enter your child\'s name.');
      return;
    }

    setSaving(true);
    try {
      const isoBirthday = birthdayToIso(dob);
      try {
        const child = await createChildViaApi({
          name: childName.trim(),
          birthday: isoBirthday,
          race,
          ethnicity,
          gender,
          medicalHistory: selectedChips,
          medicalNotes: medicalNotes.trim() || undefined,
        });
        await selectChild(child);
        await updateChildren();
      } catch (err) {
        Alert.alert(
          'Could not save profile',
          err instanceof Error
            ? err.message
            : 'Your child\'s information could not be saved to your account. Make sure you are signed in and the server is running, then try again.',
        );
        return;
      }

      navigation.navigate('PickProfile', {
        flow: addingChild ? 'addChild' : 'onboarding',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <OnboardingLayout
        step={4}
        totalSteps={5}
        onBack={() => navigation.goBack()}
        onNext={handleContinue}
        canProceed={true}
        loading={saving}
        nextLabel="Continue"
      >
        <View style={styles.stepContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStyle}>Medical History</Text>
            <Text style={styles.subtitleStyle}>
              Select any that apply. You can skip this if you prefer.
            </Text>
          </View>

          <View style={styles.chipGrid}>
            {MEDICAL_CHIPS.map((chip) => {
              const isSelected = selectedChips.includes(chip);
              return (
                <Pressable
                  key={chip}
                  onPress={() => toggleChip(chip)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={chip}
                  accessibilityState={{ checked: isSelected }}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {chip}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <LargeInput
            placeholder="Any additional notes (optional)..."
            multiline
            height={120}
            value={medicalNotes}
            onChangeText={setMedicalNotes}
          />
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    shadowColor: '#1a1a1a',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#dfe2ff',
    borderColor: '#5058b4',
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'NotoSans-Regular',
    color: '#151515',
    letterSpacing: 0.1,
  },
  chipTextSelected: {
    color: '#5058b4',
    fontFamily: 'NotoSans-SemiBold',
  },
});
