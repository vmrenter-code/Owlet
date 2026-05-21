import {View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

import PrimaryBlueButton from '../components/PrimaryBlueButton';
import HomeBg from '../components/HomeBg';
import BackArrow from '../components/BackArrow';

import { auth } from '../src/config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useProfile } from '../context/ProfileContext';
import { useAppState } from '../context/AppStateContext';

const AVATARS = [
  { id: '1', label: 'solie' },
  { id: '2', label: 'jellie' },
  { id: '3', label: 'suki' },
  { id: '4', label: 'cici' },
  { id: '5', label: 'fibi' },
  { id: '6', label: 'dumi' },
];

export default function PickProfile() {
  const { completeOnboarding } = useAppState();
  const { setProfileComplete } = useProfile();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
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

        <View style={[styles.backArrowWrapper, { paddingTop: insets.top + 8 }]}>
          <BackArrow />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 56,
              paddingBottom: 24,
            },
          ]}
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
                return (
                  <Pressable
                    key={avatar.id}
                    onPress={() => setSelectedId(avatar.id)}
                    accessibilityRole="radio"
                    accessibilityLabel={`${avatar.label} avatar`}
                    accessibilityState={{ checked: isSelected }}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    style={styles.avatarWrapper}
                  >
                    <View style={[
                      styles.avatarCircle,
                      { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
                      isSelected && styles.avatarCircleSelected,
                    ]}>
                      <View style={[
                        styles.avatarPlaceholder,
                        { width: avatarSize - 8, height: avatarSize - 8, borderRadius: (avatarSize - 8) / 2 },
                        isSelected && styles.avatarPlaceholderSelected,
                      ]} />
                    </View>
                  </Pressable>
                );
              })}
            </View>

          </View>
        </ScrollView>

        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
          <PrimaryBlueButton
            onPress={handleContinue}
            fullWidth
            disabled={!selectedId}
          >
            Continue
          </PrimaryBlueButton>
        </View>

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
  },

  avatarCircle: {
    backgroundColor: '#eae9fa',
    borderWidth: 3,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a1a1a',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
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

  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});