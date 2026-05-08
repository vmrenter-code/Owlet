import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import Launch from './screens/Launch';
import Login from './screens/Login';
import Signup from './screens/Signup';
import ForgotPassword from './screens/ForgotPassword';
import Home from './screens/Home';
import Settings from './screens/Settings';
import Account from './screens/Account';
import Notifications from './screens/Notifications';
import PrivacyData from './screens/PrivacyData';
import Accessibility from './screens/Accessibility';
import Support from './screens/Support';
import Languages from './screens/Languages';
import PastScreenings from './screens/PastScreenings';
import NotificationCenter from './screens/NotificationCenter';
import ViewResults from './screens/ViewResults';
import ClinicianNotes from './screens/ClinicianNotes';
import FAQ from './screens/FAQ';
import ScreeningInstructions from './screens/ScreeningInstructions';
import HomeBg from './components/HomeBg';
import MainTabs from './navigation/MainTabs';
import AboutUs from './screens/AboutUs';

import PositionChild from './screens/screening/PositionChild';
import ReadyToBegin from './screens/screening/ReadyToBegin';
import VideoScreen from './screens/screening/VideoScreen';
import ScreeningComplete from './screens/screening/ScreeningComplete';
import TroubleshootingScreen from './screens/screening/TroubleshootingScreen';
import TroubleshootingSolution from './screens/screening/TroubleshootingSolution';
import EKGPlacement from './screens/screening/EKGPlacement';
import { ScreeningProvider } from './context/ScreeningContext';
import { ChildProfileProvider } from './context/ChildProfileContext';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ScreeningProvider>
    <ChildProfileProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Launch"
        screenOptions={{
          contentStyle: { paddingTop: 0, marginTop: 0, backgroundColor: '#fff' },
          headerBackground: () => <HomeBg />,
          headerTransparent: false,
          headerShadowVisible: false,
          headerTitle: '',
          headerTintColor: '#49A3BD',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Launch" component={Launch} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
        <Stack.Screen name="PrivacyData" component={PrivacyData} options={{ headerShown: false }} />
        <Stack.Screen name="Accessibility" component={Accessibility} options={{ headerShown: false }} />
        <Stack.Screen name="Support" component={Support} options={{ headerShown: false }} />
        <Stack.Screen name="Languages" component={Languages} options={{ headerShown: false }} />
        <Stack.Screen name="PastScreenings" component={PastScreenings} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationCenter" component={NotificationCenter} options={{ headerShown: false }} />
        <Stack.Screen name="ViewResults" component={ViewResults} options={{ headerShown: false }} />
        <Stack.Screen name="ClinicianNotes" component={ClinicianNotes} options={{ headerShown: false }} />
        <Stack.Screen name="FAQ" component={FAQ} options={{ headerShown: false }} />
        <Stack.Screen name="ScreeningInstructions" component={ScreeningInstructions} options={{ headerShown: false }} />
        <Stack.Screen name="EKGPlacement" component={EKGPlacement} options={{ headerShown: false }} />
        <Stack.Screen name="PositionChild" component={PositionChild} options={{ headerShown: false }} />
        <Stack.Screen name="ReadyToBegin" component={ReadyToBegin} options={{ headerShown: false }} />
        <Stack.Screen name="VideoScreen" component={VideoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ScreeningComplete" component={ScreeningComplete} options={{ headerShown: false }} />
        <Stack.Screen name="TroubleshootingScreen" component={TroubleshootingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TroubleshootingSolution" component={TroubleshootingSolution} options={{ headerShown: false }} />
        <Stack.Screen name="AboutUs" component={AboutUs} options={{ headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
    </ChildProfileProvider>
    </ScreeningProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});