import {View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

import PrimaryBlueButton from '../components/PrimaryBlueButton';
import SelectedProfilePicture from '../components/SelectedProfilePic';
import ProfilePicture from '../components/ProfilePicture';
import HomeBg from '../components/HomeBg';

import { auth } from '../src/config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useProfile } from '../context/ProfileContext';

export default function PickProfile() {
  const { setProfileComplete } = useProfile();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const isSmallDevice = height < 700;

  const [dob, setDob] = useState('');
  const [childName, setChildName] = useState('');

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

  navigation.reset({
    index: 0,
    routes: [{ name: 'MainTabs' }],
  });
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>

        {/* Background */}
        <View style={styles.formatBg} pointerEvents="none">
          <HomeBg />
        </View>

        {/* Scrollable content */}
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

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={[styles.titleStyle, isSmallDevice && { fontSize: 24 }]}>
               Profile Picture
              </Text>
              <Text style={[styles.subtitleStyle, isSmallDevice && { fontSize: 14 }]}>
                Pick a profile picture for your child.
              </Text>
            </View>

            <View style = {styles.selectedProfileContainer}>
              <SelectedProfilePicture />
            </View>

            <View style = {styles.row}>
              <ProfilePicture />
              <ProfilePicture />
              <ProfilePicture />
            </View>

            <View style ={styles.row}>
              <ProfilePicture />
              <ProfilePicture />
              <ProfilePicture />
            </View>

            <View style={styles.buttonContainer}>
              <PrimaryBlueButton onPress={handleContinue}>
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    marginBottom: 40,
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  selectedProfileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },

  buttonContainer: {
    marginTop: 100
  }

});