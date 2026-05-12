import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Svg, Path, Circle } from 'react-native-svg';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import React from 'react';

import Home from '../screens/Home';
import FAQ from '../screens/FAQ';
import PastScreenings from '../screens/PastScreenings';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const floatingTabBar = {
  backgroundColor: '#ffffff',
  height: 82,
  paddingBottom: 0,
  paddingTop: 0,
  borderTopWidth: 0.5,
  borderTopColor: '#e0e0e0',
  
};

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="FAQ" component={FAQ} />
    </HomeStack.Navigator>
  );
}

function PillTabButton({ children, onPress, focused }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View
        onTouchEnd={onPress}
        style={{
          backgroundColor: focused ? '#f0fafa' : 'transparent',
          borderRadius: 100,
          borderWidth: focused ? 1.5 : 0,
          borderColor: '#90d3d3',
          paddingHorizontal: 14,
          paddingVertical: 10,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 70,
          minHeight: 56,
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: floatingTabBar,
        tabBarActiveTintColor: '#3d7474',
        tabBarInactiveTintColor: '#1f2221',
        tabBarLabelStyle: {
          fontFamily: 'NotoSans-SemiBold',
          fontSize: 10,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarButton: (props) => (
          <PillTabButton {...props} focused={props.accessibilityState?.selected} />
        ),
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint="light"
            style={{
              flex: 1,
              borderRadius: 100,
              backgroundColor: '#ffffffa2',
              overflow: 'hidden',
              borderWidth: 0.5,
              borderColor: 'rgb(255, 255, 255)',
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 24,
            }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Svg width={24} height={24} viewBox="0 0 24 24">
              {focused ? (
                <Path
                  d="M12 2L2 10h2v10a1 1 0 0 0 1 1h5v-6h4v6h5a1 1 0 0 0 1-1V10h2L12 2z"
                  fill={color}
                />
              ) : (
                <>
                  <Path
                    d="M3 10.5L12 3l9 7.5"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <Path
                    d="M5 8.5V20a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V8.5"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </>
              )}
            </Svg>
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={PastScreenings}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Svg width={24} height={24} viewBox="0 0 24 24">
              {focused ? (
                <>
                  <Circle cx="12" cy="12" r="10" fill={color} />
                  <Path
                    d="M12 7v5.5l3.5 3.5"
                    stroke="#ffffff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </>
              ) : (
                <>
                  <Circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                  />
                  <Path
                    d="M12 7v5.5l3.5 3.5"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </>
              )}
            </Svg>
          ),
        }}
      />
    </Tab.Navigator>
  );
}