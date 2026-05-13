import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Launch from '../screens/Launch';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ForgotPassword from '../screens/ForgotPassword';
import AboutYourChild from '../screens/AboutYourChild';
import PickProfile from '../screens/PickProfile';

export type AuthStackParamList = {
  Launch: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  AboutYourChild: undefined;
  PickProfile: undefined;

};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Launch"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="Launch" component={Launch} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="AboutYourChild" component={AboutYourChild} />
      <Stack.Screen name="PickProfile" component={PickProfile} />
    </Stack.Navigator>
  );
}