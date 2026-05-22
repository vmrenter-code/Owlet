import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';
import AppStack from './AppStack';

import { useAppState } from '../context/AppStateContext';

export default function RootNavigator() {
  const { user } = useAppState();

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