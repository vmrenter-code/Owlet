import type { CameraVideoOutput, Recorder } from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

let videoOutput: CameraVideoOutput | null = null;
let activeRecorder: Recorder | null = null;
let cameraIsReady = false;
let cameraReadyAt = 0;
let isRecording = false;
let recordingStartTime: number | null = null;
let currentRecordingUri: string | null = null;
let recordingResolve: ((uri: string | null) => void) | null = null;
const CAMERA_STABILIZATION_DELAY_MS = 250;

export const setVideoOutput = (output: CameraVideoOutput | null) => {
  videoOutput = output;
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
  if (!videoOutput) {
    console.error('Video output not initialized');
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
      await new Promise((resolve) =>
        setTimeout(resolve, CAMERA_STABILIZATION_DELAY_MS - elapsedSinceReady)
      );
    }

    isRecording = true;
    recordingStartTime = Date.now();
    currentRecordingUri = null;

    console.log('Creating recorder...');
    activeRecorder = await videoOutput.createRecorder({ maxDuration: 600 });

    console.log('Starting video recording to:', activeRecorder.filePath);
    await activeRecorder.startRecording(
      (filePath) => {
        // React Native fetch requires file:// prefix to read local files
        const normalizedUri = filePath.startsWith('file://') ? filePath : `file://${filePath}`;
        console.log('Recording finished:', normalizedUri);
        currentRecordingUri = normalizedUri;
        isRecording = false;
        activeRecorder = null;
        if (recordingResolve) {
          recordingResolve(filePath);
          recordingResolve = null;
        }
      },
      (error) => {
        console.error('Recording error:', error);
        isRecording = false;
        activeRecorder = null;
        if (recordingResolve) {
          recordingResolve(currentRecordingUri);
          recordingResolve = null;
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Error starting recording:', error);
    isRecording = false;
    recordingStartTime = null;
    activeRecorder = null;
    return false;
  }
};

export const stopScreeningRecording = async (): Promise<string | null> => {
  // Recording already completed on its own
  if (!isRecording && currentRecordingUri) {
    const savedUri = currentRecordingUri;
    currentRecordingUri = null;
    recordingStartTime = null;
    return savedUri;
  }

  if (!isRecording || !activeRecorder) {
    console.warn('No recording in progress');
    return null;
  }

  try {
    const stopPromise = new Promise<string | null>((resolve) => {
      recordingResolve = resolve;
    });

    try {
      await activeRecorder.stopRecording();
    } catch (stopErr) {
      console.warn('stopRecording threw, waiting for callback to settle:', stopErr);
    }

    const result = await Promise.race([
      stopPromise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 15000)),
    ]);

    if (result) {
      const timestampKey = new Date().toISOString().replace(/[:.]/g, '-');
      try {
        await AsyncStorage.setItem(
          `screening_recording_${timestampKey}`,
          JSON.stringify({
            uri: result,
            timestamp: Date.now(),
            duration: recordingStartTime ? Date.now() - recordingStartTime : 0,
          })
        );
      } catch (e) {
        console.log('Error saving recording metadata:', e);
      }
    }

    console.log('Recording saved with URI:', result);
    recordingStartTime = null;
    isRecording = false;
    recordingResolve = null;

    return result;
  } catch (error) {
    console.error('Error stopping recording:', error);
    isRecording = false;
    recordingResolve = null;
    return null;
  }
};

export const isCurrentlyRecording = (): boolean => {
  return isRecording;
};

export const getLastRecordingUri = (): string | null => {
  return currentRecordingUri;
};
