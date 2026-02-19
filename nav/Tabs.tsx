//Bottom tab bar. 
//Once we make the screens that belong on the bottom tab bar, they'll
//be added as a Tab.Screen
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home'

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#49A3BD',
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          shadowOffset: {width: 2, height:0},
          shadowOpacity: 0.22,
          shadowRadius: 10,
          borderTopColor: '#dddddd',
        },
      }}
    >
      <Tab.Screen name="Home" component={Home} />

    </Tab.Navigator>
  );
}