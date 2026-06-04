import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChildName from '../screens/ChildName';
import ChildDOB from '../screens/ChildDOB';
import ChildBackground from '../screens/ChildBackground';
import ChildMedical from '../screens/ChildMedical';
import ChildProvider from '../screens/ChildProvider';
import PickProfile from '../screens/PickProfile';

export type AddChildStackParamList = {
  ChildName: { flow: 'addChild' };
  ChildDOB: { childName: string; flow: 'addChild' };
  ChildBackground: { childName: string; dob: string; flow: 'addChild' };
  ChildMedical: {
    childName: string;
    dob: string;
    race: string;
    ethnicity: string;
    gender?: string;
    flow: 'addChild';
  };
  ChildProvider: {
    childName: string;
    dob: string;
    race: string;
    ethnicity: string;
    gender?: string;
    flow: 'addChild';
  };
  PickProfile: { flow: 'addChild' };
};

const Stack = createNativeStackNavigator<AddChildStackParamList>();

export default function AddChildStack() {
  return (
    <Stack.Navigator
      initialRouteName="ChildName"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen
        name="ChildName"
        component={ChildName}
        initialParams={{ flow: 'addChild' }}
      />
      <Stack.Screen name="ChildDOB" component={ChildDOB} />
      <Stack.Screen name="ChildBackground" component={ChildBackground} />
      <Stack.Screen name="ChildMedical" component={ChildMedical} />
      <Stack.Screen name="ChildProvider" component={ChildProvider} />
      <Stack.Screen
        name="PickProfile"
        component={PickProfile}
        initialParams={{ flow: 'addChild' }}
      />
    </Stack.Navigator>
  );
}
