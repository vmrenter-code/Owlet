import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Svg, Path, Circle } from 'react-native-svg';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import Home from '../screens/Home';
import ScreeningInstructions from '../screens/ScreeningInstructions';
import FAQ from '../screens/FAQ';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const floatingTabBar = {
  backgroundColor: 'transparent',
  borderRadius: 100,
  height: 73,
  paddingBottom: 0,
  paddingTop: 0,
  borderTopWidth: 0,
  position: 'absolute' as const,
  bottom: 24,
  margin: 10,
};

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen
        name="ScreeningInstructions"
        component={ScreeningInstructions}
      />
      <HomeStack.Screen name="FAQ" component={FAQ} />
    </HomeStack.Navigator>
  );
}

function PillTabButton({ children, onPress, focused, accessibilityState }: any) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
        tabBarActiveTintColor: '#90d3d3',
        tabBarInactiveTintColor: '#2E3332',
        tabBarLabelStyle: {
          fontFamily: 'NotoSans-Regular',
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
            intensity={70}
            tint="light"
            style={{
              flex: 1,
              borderRadius: 100,
              backgroundColor: "#ffffffa2",
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
      {/* home */}
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Svg width={20} height={20} viewBox="0 0 24 24">
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
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <Path
                    d="M5 8.5V20a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V8.5"
                    stroke={color}
                    strokeWidth={1.8}
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

      {/* screen */}
      <Tab.Screen
        name="Screen"
        component={ScreeningInstructions}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Svg width={18} height={18} viewBox="0 0 24 24">
              {focused ? (
                <Path
                  d="M5 4.27C5 3.01 6.38 2.26 7.4 2.97l13.02 8.73a1.75 1.75 0 0 1 0 2.9L7.4 23.03C6.38 23.74 5 22.99 5 21.73V4.27z"
                  fill={color}
                />
              ) : (
                <Path
                  d="M5 4.27C5 3.01 6.38 2.26 7.4 2.97l13.02 8.73a1.75 1.75 0 0 1 0 2.9L7.4 23.03C6.38 23.74 5 22.99 5 21.73V4.27z"
                  fill="none"
                  stroke={color}
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
              )}
            </Svg>
          ),
        }}
      />

      {/* history */}
      
    </Tab.Navigator>
  );
}