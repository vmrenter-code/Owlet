import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './navigation/RootNavigator';

import { AppStateProvider } from './context/AppStateContext';
import { ProfileProvider } from './context/ProfileContext';
import { ChildProfileProvider } from './context/ChildProfileContext';
import { ScreeningProvider } from './context/ScreeningContext';
import { ChildProvider } from './context/ChildContext';

export default function App() {
   const [fontsLoaded] = useFonts({
    'NotoSans-Regular': require('./assets/Noto_Sans/static/NotoSans-Regular.ttf'),
    'NotoSans-Medium': require('./assets/Noto_Sans/static/NotoSans-Medium.ttf'),
    'NotoSans-Bold': require('./assets/Noto_Sans/static/NotoSans-Bold.ttf'),
    'NotoSans-SemiBold': require('./assets/Noto_Sans/static/NotoSans-SemiBold.ttf'),
  });
  return (
    <AppStateProvider>
      <ChildProvider>
      <ProfileProvider>
          <ScreeningProvider>
            <NavigationContainer>
              <ChildProfileProvider>
                <RootNavigator />
              </ChildProfileProvider>
            </NavigationContainer>
          </ScreeningProvider>
      </ProfileProvider>
      </ChildProvider>
    </AppStateProvider>
  );
}