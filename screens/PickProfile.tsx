import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { isAddChildFlow } from '../utils/childFlow';
import { useWindowDimensions } from 'react-native';

import HomeBg from '../components/HomeBg';
import OnboardingLayout from '../components/OnboardingLayout';
import { useProfile } from '../context/ProfileContext';
import { useAppState } from '../context/AppStateContext';
import { useChild } from '../context/ChildContext';

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
  const route = useRoute<any>();
  const flow = route.params?.flow;
  const { width } = useWindowDimensions();
  const { selectedChild, setChildAvatar, updateChildren } = useChild();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (saving || !selectedId) return;

    const childId = selectedChild?.id;
    if (!childId) {
      Alert.alert(
        'No child profile',
        'Go back and finish your child\'s details before choosing an avatar.',
      );
      return;
    }

    setSaving(true);
    try {
      const saved = await setChildAvatar(childId, selectedId);
      if (!saved) {
        Alert.alert(
          'Could not save avatar',
          'Your profile picture could not be saved. Please try again.',
        );
        return;
      }
      await updateChildren();

      if (isAddChildFlow(flow)) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          }),
        );
        return;
      }

      setProfileComplete(true);
      completeOnboarding();
    } finally {
      setSaving(false);
    }
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
          loading={saving}
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
                  Pick a profile picture for {selectedChild?.name ?? 'your child'}.
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
                      accessibilityLabel={`Profile picture option ${avatar.id}`}
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
});
