import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';
import AppStack from './AppStack';
import { useAppState } from '../context/AppStateContext';

export default function RootNavigator() {
  const { user } = useAppState();

  // Lock to portrait by default for the whole app.
  // Camera screening screens call unlockAsync() themselves.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    ).catch(() => {});
  }, []);

  return (
    <>
      {!user ? (
        <AuthStack />
      ) : !user.hasCompletedOnboarding ? (
        <OnboardingStack />
      ) : (
        <AppStack />
      )}
    </>
  );
}
