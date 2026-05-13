import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './src/config/firebase';
import { ScreeningProvider } from './context/ScreeningContext';
import { ChildProfileProvider } from './context/ChildProfileContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

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

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScreeningProvider>
          <ChildProfileProvider>
            <NavigationContainer>
              {user ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
          </ChildProfileProvider>
        </ScreeningProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}