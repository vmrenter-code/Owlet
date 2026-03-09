import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import React from 'react';

// Screens
import Launch from './screens/Launch';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import ScreeningInstructions from './screens/ScreeningInstructions';
import HomeBg from './components/HomeBg';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'NotoSans-Regular': require('./assets/Noto_Sans/static/NotoSans-Regular.ttf'),
    'NotoSans-Medium': require('./assets/Noto_Sans/static/NotoSans-Medium.ttf'),
    'NotoSans-Bold': require('./assets/Noto_Sans/static/NotoSans-Bold.ttf'),
    'NotoSans-SemiBold': require('./assets/Noto_Sans/static/NotoSans-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { paddingTop: 0, marginTop: 0, backgroundColor: '#fff' },
          headerBackground: () => <HomeBg />,
          headerTransparent: false,      // boolean ✅
          headerShadowVisible: false,    // boolean ✅
          headerTitle: '',
          headerTintColor: '#49A3BD',
          animation: 'slide_from_right',  // optional, safe string
        }}
      >
        <Stack.Screen name="Launch" component={Launch} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="ScreeningInstructions" component={ScreeningInstructions} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}