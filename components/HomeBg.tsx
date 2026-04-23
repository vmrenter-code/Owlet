HomeBg
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

export default function HomeBg() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          {/* Top-left cool blue blob */}
          <RadialGradient id="g1" cx="15%" cy="10%" r="55%">
            <Stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#ceecf3" stopOpacity="0" />
          </RadialGradient>

          {/* Top-right warm white blob */}
          <RadialGradient id="g2" cx="90%" cy="5%" r="50%">
            <Stop offset="0%" stopColor="#C8E8F0" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#faeafd" stopOpacity="0.35" />
          </RadialGradient>

          {/* Center subtle purple */}
          <RadialGradient id="g3" cx="50%" cy="45%" r="45%">
            <Stop offset="0%" stopColor="#dddaf8" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#e5bcf5" stopOpacity="0." />
          </RadialGradient>

          {/* Bottom-left cool mist */}
          <RadialGradient id="g4" cx="10%" cy="85%" r="50%">
            <Stop offset="0%" stopColor="#cde9f0" stopOpacity="0.7" />
            <Stop offset="100%" stopColor="#c9e5ec" stopOpacity="0" />
          </RadialGradient>

          {/* Bottom-right warm glow */}
          <RadialGradient id="g5" cx="85%" cy="90%" r="50%">
            <Stop offset="0%" stopColor="#bee1eb" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#D5EEF5" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Base: near white with faint blue tint */}
        <Rect width={width} height={height} fill="#F2FAFA" />
        <Rect width={width} height={height} fill="url(#g1)" />
        <Rect width={width} height={height} fill="url(#g2)" />
        <Rect width={width} height={height} fill="url(#g3)" />
        <Rect width={width} height={height} fill="url(#g4)" />
        <Rect width={width} height={height} fill="url(#g5)" />
      </Svg>
    </View>
  );
}