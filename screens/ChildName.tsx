import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isAddChildFlow, type ChildFlowMode } from '../utils/childFlow';
import InputFields from '../components/InputFields';
import OnboardingLayout from '../components/OnboardingLayout';

export default function ChildName() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const flow: ChildFlowMode = route.params?.flow === 'addChild' ? 'addChild' : 'onboarding';
  const [childName, setChildName] = useState('');

  const handleNext = () => {
    navigation.navigate('ChildDOB', { childName, flow });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    if (isAddChildFlow(flow)) {
      navigation.getParent()?.goBack();
    }
  };

  return (
      <View style={{ flex: 1 }}>
        <OnboardingLayout
          step={1}
          totalSteps={6}
          showBackOnFirstStep
          onBack={handleBack}
          onNext={handleNext}
          canProceed={childName.trim().length > 0}
        >
            <View style={styles.stepContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>What's your child's name?</Text>
                <Text style={styles.subtitleStyle}>This is how they'll appear in the app.</Text>
              </View>


              <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>First name</Text>
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
            </View>
        </OnboardingLayout>
      </View>
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