import { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useScreeningLandscape } from '../hooks/useScreeningLandscape';
import RotateDeviceOverlay from './RotateDeviceOverlay';

type Props = {
  children: ReactNode;
  instruction?: string;
  showFaceGuide?: boolean;
  onBack: () => void;
  footer: ReactNode;
};

export default function ScreeningCameraLayout({
  children,
  instruction,
  showFaceGuide = true,
  onBack,
  footer,
}: Props) {
  useScreeningLandscape();
  const { width, height } = useWindowDimensions();
  const isWide = width >= height;
  const showRotateHint = !isWide;

  return (
    <View style={styles.root}>
      <View style={styles.cameraStage}>
        {children}

        {showRotateHint ? <RotateDeviceOverlay /> : null}

        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <View style={styles.recordIndicator}>
            <View style={styles.recordDot} />
          </View>
        </View>

        {isWide && instruction ? (
          <View style={styles.instructionWrap}>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ) : null}

        {isWide && showFaceGuide ? (
          <View style={styles.guideWrap} pointerEvents="none">
            <View style={styles.faceGuide} />
          </View>
        ) : null}

        {isWide ? <View style={styles.footerOverlay}>{footer}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraStage: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
  recordIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
  },
  instructionWrap: {
    position: 'absolute',
    top: 56,
    left: '12%',
    right: '12%',
    alignItems: 'center',
    zIndex: 10,
  },
  instructionText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  guideWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  faceGuide: {
    width: 300,
    height: 220,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: '#8b7bc7',
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
});
