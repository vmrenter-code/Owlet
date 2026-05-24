import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChildName from '../screens/ChildName';
import ChildDOB from '../screens/ChildDOB';
import ChildBackground from '../screens/ChildBackground';
import ChildMedical from '../screens/ChildMedical';
import PickProfile from '../screens/PickProfile';

export type OnboardingStackParamList = {
  ChildName: undefined;
  ChildDOB: { childName: string };
  ChildBackground: { childName: string; dob: string };
  ChildMedical: { childName: string; dob: string; race: string; ethnicity: string };
  PickProfile: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator
      initialRouteName="ChildName"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="ChildName" component={ChildName} />
      <Stack.Screen name="ChildDOB" component={ChildDOB} />
      <Stack.Screen name="ChildBackground" component={ChildBackground} />
      <Stack.Screen name="ChildMedical" component={ChildMedical} />
      <Stack.Screen name="PickProfile" component={PickProfile} />
    </Stack.Navigator>
  );
}