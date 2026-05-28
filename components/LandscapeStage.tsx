import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useScreeningLandscape } from '../hooks/useScreeningLandscape';
import RotateDeviceOverlay from './RotateDeviceOverlay';

type Props = {
  children: ReactNode;
  backgroundColor?: string;
};

/**
 * Wraps screening UI in a landscape coordinate space.
 *
 * - While the device is portrait, ONLY the "Rotate your device" overlay is
 *   rendered. The screening content (camera, video, face guide) is fully
 *   skipped so it never initializes or runs behind the prompt.
 * - Once the device is landscape (real or via the simulator fallback), the
 *   stage renders the screening content normally.
 */
export default function LandscapeStage({
  children,
  backgroundColor = '#000',
}: Props) {
  const { stageStyle, showRotateHint } = useScreeningLandscape();

  if (showRotateHint) {
    return (
      <View style={[styles.outer, { backgroundColor }]}>
        <RotateDeviceOverlay />
      </View>
    );
  }

  return (
    <View style={[styles.outer, { backgroundColor }]}>
      <View style={stageStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    overflow: 'hidden',
  },
});
