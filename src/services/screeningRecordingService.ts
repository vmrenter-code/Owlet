import { CameraView } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

let cameraRef: CameraView | null = null;
let cameraIsReady = false;
let cameraReadyAt = 0;
let isRecording = false;
let recordingStartTime: number | null = null;
let currentRecordingUri: string | null = null;
let recordingPromise: Promise<{ uri: string } | undefined> | null = null;
const CAMERA_STABILIZATION_DELAY_MS = 250;

export const initializeCameraRef = (ref: CameraView) => {
  cameraRef = ref;
};

export const setCameraReady = () => {
  cameraIsReady = true;
  cameraReadyAt = Date.now();
};

export const setCameraNotReady = () => {
  cameraIsReady = false;
  cameraReadyAt = 0;
};

export const startScreeningRecording = async (): Promise<boolean> => {
  if (!cameraRef) {
    console.error('Camera ref not initialized');
    return false;
  }

  if (!cameraIsReady) {
    console.warn('Camera is not ready yet');
    return false;
  }

  if (isRecording) {
    console.warn('Recording already in progress');
    return false;
  }

  try {
    const elapsedSinceReady = Date.now() - cameraReadyAt;
    if (elapsedSinceReady < CAMERA_STABILIZATION_DELAY_MS) {
      await new Promise((resolve) => setTimeout(resolve, CAMERA_STABILIZATION_DELAY_MS - elapsedSinceReady));
    }

    isRecording = true;
    recordingStartTime = Date.now();
    currentRecordingUri = null;

    console.log('Starting video recording...');
    recordingPromise = cameraRef.recordAsync({
      maxDuration: 600, // temp 10 min max (idk how long vids will be)
    });

    recordingPromise
      .then((video) => {
        console.log('recordAsync response:', video);
        if (video?.uri) {
          currentRecordingUri = video.uri;
        } else {
          console.error('recordAsync returned no URI. Response was:', video);
        }
      })
      .catch((error) => {
        console.error('recordAsync promise failed:', error);
      })
      .finally(() => {
        isRecording = false;
        recordingPromise = null;
      });

    return true;
  } catch (error) {
    console.error('Error starting recording:', error);
    isRecording = false;
    recordingStartTime = null;
    recordingPromise = null;
    return false;
  }
};


 //Stop recording and save video file URI
 
export const stopScreeningRecording = async (): Promise<string | null> => {
  if (!cameraRef || !recordingPromise) {
    console.warn('No recording in progress');
    return null;
  }

  try {
    // Stop the recording. recordAsync promise resolves after this.
    await cameraRef.stopRecording();

    const video = await recordingPromise;

    if (!video?.uri) {
      console.error('No recording URI available');
      isRecording = false;
      recordingStartTime = null;
      recordingPromise = null;
      return null;
    }

    currentRecordingUri = video.uri;
    const timestampKey = new Date().toISOString().replace(/[:.]/g, '-');

    // Save recording metadata to AsyncStorage for later retrieval
    try {
      const recordingMetadata = {
        uri: currentRecordingUri,
        timestamp: Date.now(),
        duration: recordingStartTime ? Date.now() - recordingStartTime : 0,
      };
      await AsyncStorage.setItem(
        `screening_recording_${timestampKey}`,
        JSON.stringify(recordingMetadata)
      );
    } catch (e) {
      console.log('Error saving recording metadata:', e);
    }

    console.log('Recording saved with URI:', currentRecordingUri);
    const savedUri = currentRecordingUri;
    currentRecordingUri = null;
    recordingStartTime = null;
    recordingPromise = null;
    isRecording = false;

    return savedUri;
  } catch (error) {
    console.error('Error stopping recording:', error);
    isRecording = false;
    recordingPromise = null;
  }

  return null;
};

export const isCurrentlyRecording = (): boolean => {
  return isRecording;
};

//get uri of last recording (if any) for testing purposes, will be used in future to upload to cloud or whatever.
export const getLastRecordingUri = (): string | null => {
  return currentRecordingUri;
};

