import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

function RotateDeviceIcon() {
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72" fill="none">
      <Rect
        x={22}
        y={14}
        width={28}
        height={44}
        rx={4}
        stroke="#ffffff"
        strokeWidth={2.5}
      />
      <Path
        d="M54 36a18 18 0 0 1-18 18"
        stroke="#ffffff"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Path
        d="M48 50l6-4-6-4"
        stroke="#ffffff"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function RotateDeviceOverlay() {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <RotateDeviceIcon />
      <Text style={styles.text}>Rotate your device for the camera view</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
    zIndex: 20,
  },
  text: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});
