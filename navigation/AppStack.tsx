import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import Settings from '../screens/Settings';
import Account from '../screens/Account';
import Notifications from '../screens/Notifications';
import PrivacyData from '../screens/PrivacyData';
import Accessibility from '../screens/Accessibility';
import Support from '../screens/Support';
import Languages from '../screens/Languages';
import PastScreenings from '../screens/PastScreenings';
import NotificationCenter from '../screens/NotificationCenter';
import ViewResults from '../screens/ViewResults';
import ClinicianNotes from '../screens/ClinicianNotes';
import FAQ from '../screens/FAQ';
import ScreeningInstructions from '../screens/ScreeningInstructions';
import AboutUs from '../screens/AboutUs';
import EKGPlacement from '../screens/screening/EKGPlacement';
import PositionChild from '../screens/screening/PositionChild';
import ReadyToBegin from '../screens/screening/ReadyToBegin';
import VideoScreen from '../screens/screening/VideoScreen';
import ScreeningComplete from '../screens/screening/ScreeningComplete';
import TroubleshootingScreen from '../screens/screening/TroubleshootingScreen';
import TroubleshootingSolution from '../screens/screening/TroubleshootingSolution';
import RaceEthnicity from '../screens/RaceEthnicity';


export type AppStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Settings: undefined;
  Account: undefined;
  Notifications: undefined;
  PrivacyData: undefined;
  Accessibility: undefined;
  Support: undefined;
  Languages: undefined;
  PastScreenings: undefined;
  NotificationCenter: undefined;
  ViewResults: undefined;
  ClinicianNotes: undefined;
  FAQ: undefined;
  ScreeningInstructions: undefined;
  AboutUs: undefined;
  EKGPlacement: undefined;
  PositionChild: undefined;
  ReadyToBegin: undefined;
  VideoScreen: undefined;
  ScreeningComplete: undefined;
  TroubleshootingScreen: undefined;
  TroubleshootingSolution: undefined;
  RaceEthnicity: undefined;

};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="PrivacyData" component={PrivacyData} />
      <Stack.Screen name="Accessibility" component={Accessibility} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="Languages" component={Languages} />
      <Stack.Screen name="PastScreenings" component={PastScreenings} />
      <Stack.Screen name="NotificationCenter" component={NotificationCenter} />
      <Stack.Screen name="ViewResults" component={ViewResults} />
      <Stack.Screen name="ClinicianNotes" component={ClinicianNotes} />
      <Stack.Screen name="FAQ" component={FAQ} />
      <Stack.Screen name="ScreeningInstructions" component={ScreeningInstructions} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="EKGPlacement" component={EKGPlacement} />
      <Stack.Screen name="PositionChild" component={PositionChild} />
      <Stack.Screen name="ReadyToBegin" component={ReadyToBegin} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen name="ScreeningComplete" component={ScreeningComplete} />
      <Stack.Screen name="TroubleshootingScreen" component={TroubleshootingScreen} />
      <Stack.Screen name="TroubleshootingSolution" component={TroubleshootingSolution} />
      <Stack.Screen name="RaceEthnicity" component={RaceEthnicity} />
    </Stack.Navigator>
  );
}