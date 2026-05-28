import { Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback } from 'react';
import { resetScreeningLandscapeState } from './useScreeningLandscape';

/**
 * Locks the screen to portrait orientation while focused.
 * Use on screens that need portrait (Home, EKGPlacement, ScreeningComplete, etc.)
 * to ensure the device rotates back after a screening session.
 */
export function usePortraitLock() {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') return;

      resetScreeningLandscapeState();
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).catch(() => {});
    }, [])
  );
}
