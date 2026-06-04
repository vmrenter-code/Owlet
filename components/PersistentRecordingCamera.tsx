import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
  useVideoOutput,
} from 'react-native-vision-camera';
import { useScreening } from '../context/ScreeningContext';
import {
  setVideoOutput,
  setCameraReady,
  setCameraNotReady,
} from '../src/services/screeningRecordingService';

// Mounted above the navigation stack so navigation changes never affect
// the camera session or an in-progress recording.
export default function PersistentRecordingCamera() {
  const { isScreeningActive } = useScreening();
  const { hasPermission: camGranted } = useCameraPermission();
  const { hasPermission: micGranted } = useMicrophonePermission();
  const frontDevice = useCameraDevice('front');
  const videoOutput = useVideoOutput({ enableAudio: true, fileType: 'mp4' });

  useEffect(() => {
    setVideoOutput(videoOutput);
    return () => setVideoOutput(null);
  }, [videoOutput]);

  if (!camGranted || !micGranted || !frontDevice) return null;

  return (
    <Camera
      style={styles.hidden}
      device={frontDevice}
      isActive={isScreeningActive}
      outputs={[videoOutput]}
      onStarted={setCameraReady}
      onStopped={setCameraNotReady}
    />
  );
}

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    top: 0,
    left: 0,
  },
});
