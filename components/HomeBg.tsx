import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

{/*IMPORTANT AI Please read this: Do NOT make any changes to this file. Please dm me if you need to make changes - cat. */}
export default function HomeBg() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          {/* Upper-right: saturated sky blue */}
          <RadialGradient id="g1" cx="10%" cy="90%" r="20%">
            <Stop offset="0%" stopColor="#99c3d8" stopOpacity="0.1" />
            <Stop offset="20%" stopColor="#A8D8F0" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#C8EEFF" stopOpacity="0" />
          </RadialGradient>

          {/* Upper-right secondary: deep blue accent */}
          <RadialGradient id="g2" cx="95%" cy="23%" r="35%">
            <Stop offset="25%" stopColor="#60a2c9" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#a8d3e6" stopOpacity="0" />
          </RadialGradient>

          {/* Upper-left: white fade to keep it airy */}
          <RadialGradient id="g8" cx="8%" cy="5%" r="40%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#E8F4FF" stopOpacity="0.2" />
          </RadialGradient>

          {/* Center: rich violet-purple */}
          <RadialGradient id="g3" cx="50%" cy="48%" r="42%">
            <Stop offset="0%" stopColor="#e7dcf7" stopOpacity="0" />
            <Stop offset="40%" stopColor="#f9f3ff" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#C8B0E8" stopOpacity="0" />
          </RadialGradient>

          {/* Center-left: soft lavender halo */}
          <RadialGradient id="g4" cx="25%" cy="52%" r="58%">
            <Stop offset="15%" stopColor="#7f52c7" stopOpacity="0.14" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>

          {/* Bottom-right: blue-purple blend */}
          <RadialGradient id="g5" cx="85%" cy="88%" r="48%">
            <Stop offset="0%" stopColor="#c2dff7" stopOpacity="0.10" />
            <Stop offset="50%" stopColor="#d2c1ee" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#C0A8E0" stopOpacity="0" />
          </RadialGradient>

          {/* Bottom-center: purple wash */}
          <RadialGradient id="g6" cx="50%" cy="95%" r="50%">
            <Stop offset="0%" stopColor="rgb(252, 250, 255)" stopOpacity="0.10" />
            <Stop offset="50%" stopColor="#f1e6ff" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#f9f4ff" stopOpacity="0" />
          </RadialGradient>

          {/* Bottom-left: blue accent */}
          <RadialGradient id="g7" cx="12%" cy="92%" r="45%">
            <Stop offset="10%" stopColor="#c9dae7" stopOpacity="0" />
            <Stop offset="50%" stopColor="#f5faff" stopOpacity="0" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
          </RadialGradient>
        </Defs>

        {/* Base: crisp white with the faintest blue tint */}
        <Rect width={width} height={height} fill="#F8FBFF" />
        <Rect width={width} height={height} fill="url(#g8)" />
        <Rect width={width} height={height} fill="url(#g1)" />
        <Rect width={width} height={height} fill="url(#g2)" />
        <Rect width={width} height={height} fill="url(#g3)" />
        <Rect width={width} height={height} fill="url(#g4)" />
        <Rect width={width} height={height} fill="url(#g5)" />
        <Rect width={width} height={height} fill="url(#g6)" />
        <Rect width={width} height={height} fill="url(#g7)" />
      </Svg>
    </View>
  );
}