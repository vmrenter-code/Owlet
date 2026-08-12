/**
 * react-native-vision-camera has no web build and touches the native bridge
 * at import time. Avoid importing it on web so the bundle loads and the app
 * can run in the browser. Screening recording is unavailable on web.
 */
export default function PersistentRecordingCamera() {
  return null;
}
