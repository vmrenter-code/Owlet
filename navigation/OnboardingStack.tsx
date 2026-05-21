import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AboutYourChild from '../screens/AboutYourChild';
import PickProfile from '../screens/PickProfile';

export type OnboardingStackParamList = {
  AboutYourChild: undefined;
  PickProfile: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator
      initialRouteName="AboutYourChild"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="AboutYourChild" component={AboutYourChild} />
      <Stack.Screen name="PickProfile" component={PickProfile} />
    </Stack.Navigator>
  );
}