import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged, User, getAuth } from 'firebase/auth';
import { auth } from './src/config/firebase';
import { ScreeningProvider } from './context/ScreeningContext';
import { ChildProvider } from './context/ChildContext';
import { ChildProfileProvider } from './context/ChildProfileContext';
import { ProfileProvider } from './context/ProfileContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useProfile } from './context/ProfileContext';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import OnboardingStack from './navigation/OnboardingStack';

const BASE_URL = 'http://localhost:4000';


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'NotoSans-Regular': require('./assets/Noto_Sans/static/NotoSans-Regular.ttf'),
    'NotoSans-Medium': require('./assets/Noto_Sans/static/NotoSans-Medium.ttf'),
    'NotoSans-Bold': require('./assets/Noto_Sans/static/NotoSans-Bold.ttf'),
    'NotoSans-SemiBold': require('./assets/Noto_Sans/static/NotoSans-SemiBold.ttf'),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  if (!fontsLoaded || !authReady) return null;
/*
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      console.log("USER LOGGED IN:", user.uid);
      const token = await user.getIdToken();

    const res = await fetch(`${BASE_URL}/users/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });

    return unsubscribe;
  }, []);*/

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ChildProvider>
        <ScreeningProvider>
          <ProfileProvider>
            <ChildProfileProvider>
              <NavigationGate user={user} />
            </ChildProfileProvider>
          </ProfileProvider>
        </ScreeningProvider>
        </ChildProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function NavigationGate({ user }: { user: User | null }) {
  const { profileComplete, loading } = useProfile();

  if (loading) return null;

  return (
    <NavigationContainer>
      {user ? (
        profileComplete ? <AppStack /> : <OnboardingStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}