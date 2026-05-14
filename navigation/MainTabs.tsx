import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Svg, Path, Circle } from 'react-native-svg';
import { View, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';

import Home from '../screens/Home';
import FAQ from '../screens/FAQ';
import PastScreenings from '../screens/PastScreenings';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="FAQ" component={FAQ} />
    </HomeStack.Navigator>
  );
}

function PillTabButton({ children, onPress, focused, accessibilityLabel, accessibilityRole, accessibilityState }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable
        onPress={onPress}
        accessibilityRole={accessibilityRole ?? 'button'}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={accessibilityState}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{
          backgroundColor: focused ? '#f0fafa' : 'transparent',
          borderRadius: 100,
          borderWidth: focused ? 1.5 : 0,
          borderColor: '#90d3d3',
          paddingHorizontal: 14,
          paddingVertical: 10,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 56,
          minHeight: 56,
        }}
      >
        {children}
      </Pressable>
    </View>
  );
}

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 0,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: '#3d7474',
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle: {
          fontFamily: 'NotoSans-SemiBold',
          fontSize: 11,
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
          intensity={90}
          tint="light"
          style={{
            flex: 1,
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.88)',
            borderTopWidth: 0.5,
            borderTopColor: 'rgba(0,0,0,0.15)',
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowOffset: { width: 0, height: -3 },
            shadowRadius: 8,
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