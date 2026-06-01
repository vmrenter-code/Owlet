import {View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';

import HomeBg from '../components/HomeBg';
import OnboardingLayout from '../components/OnboardingLayout';

import { auth } from '../src/config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useProfile } from '../context/ProfileContext';
import { useAppState } from '../context/AppStateContext';

import jelli from '../assets/jellie.svg';
import fibi from '../assets/fibi.svg';
import cici from '../assets/cici.svg';
import solie from '../assets/solie.svg';
import suki from '../assets/suki.svg';
import dumi from '../assets/dumi.svg';



const AVATARS = [
  { id: '1', component: jelli },
  { id: '2', component: fibi },
  { id: '3', component: cici },
  { id: '4', component: solie },
  { id: '5', component: suki },
  { id: '6', component: dumi },
];

export default function PickProfile() {
  const { completeOnboarding } = useAppState();
  const { setProfileComplete } = useProfile();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  const [dob, setDob] = useState('');
  const [childName, setChildName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isFormValid = childName.trim().length > 0 && dob.length === 10;

  const formatDOB = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  };

  const handleContinue = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setProfileComplete(true);
    completeOnboarding();
  };

  const avatarSize = (width - 60 - 16) / 2;


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>

        <View style={styles.formatBg} pointerEvents="none">
          <HomeBg />
        </View>

        <OnboardingLayout
          step={5}
          totalSteps={5}
          onBack={() => navigation.goBack()}
          onNext={handleContinue}
          canProceed={!!selectedId}
          nextLabel="Continue"
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>

              <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>Select Your Avatar</Text>
                <Text style={styles.subtitleStyle}>
                  Pick a profile picture for your child.
                </Text>
              </View>

              <View style={styles.grid}>
                {AVATARS.map((avatar) => {
                  const isSelected = selectedId === avatar.id;
                  const AvatarSvg = avatar.component;
                  return (
                    <Pressable
                      key={avatar.id}
                      onPress={() => setSelectedId(avatar.id)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isSelected }}
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                      style={styles.avatarWrapper}
                    >
                      <View
                        style={[
                          styles.avatarCircle,
                          {
                            width: avatarSize,
                            height: avatarSize,
                            borderRadius: avatarSize / 2,
                          },
                          isSelected && styles.avatarCircleSelected,
                        ]}
                      >
                        <AvatarSvg
                          width={avatarSize - 2}
                          height={avatarSize - 2}
                        />
                      </View>
                      <Text style={[styles.avatarLabel, isSelected && styles.avatarLabelSelected]}>
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

            </View>
          </ScrollView>
        </OnboardingLayout>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formatBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  container: {
    flex: 1,
    gap: 28,
  },

  titleContainer: {
    gap: 6,
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

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },

  avatarWrapper: {
    width: '47%',
    alignItems: 'center',
    gap: 8,
  },

  avatarCircle: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a1a1a',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },

  avatarCircleSelected: {
    borderColor: '#5058b4',
    backgroundColor: '#f9fdfd',
  },

  avatarPlaceholder: {
    backgroundColor: '#fdfdfd',
  },

  avatarPlaceholderSelected: {
    backgroundColor: '#ffffff',
  },

  avatarLabel: {
    fontSize: 13,
    fontFamily: 'NotoSans-Regular',
    color: '#2E3332',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  avatarLabelSelected: {
    color: '#5058b4',
    fontFamily: 'NotoSans-SemiBold',
  },
});