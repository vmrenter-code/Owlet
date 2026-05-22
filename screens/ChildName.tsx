import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import InputFields from '../components/InputFields';
import OnboardingLayout from '../components/OnboardingLayout';

export default function ChildName() {
  const navigation = useNavigation<any>();
  const [childName, setChildName] = useState('');

  const handleNext = () => {
    navigation.navigate('ChildDOB', { childName });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <OnboardingLayout
          step={1}
          totalSteps={5}
          onBack={() => navigation.goBack()}
          onNext={handleNext}
          canProceed={childName.trim().length > 0}
        >
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.stepContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>What's your child's name?</Text>
                <Text style={styles.subtitleStyle}>This is how they'll appear in the app.</Text>
              </View>

              <InputFields
                placeholder="Child's first name"
                maxLength={15}
                value={childName}
                onChangeText={setChildName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={childName.trim().length > 0 ? handleNext : undefined}
              />
              <Text style={styles.charCount}>{childName.length}/15</Text>
            </View>
          </ScrollView>
        </OnboardingLayout>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  stepContent: {
    gap: 16,
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

  charCount: {
    fontSize: 13,
    color: '#2E3332',
    fontFamily: 'NotoSans-Regular',
    textAlign: 'right',
    letterSpacing: 0.1,
  },
});