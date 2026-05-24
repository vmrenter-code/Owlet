import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';

/** Lock to landscape while on camera screening screens; restore portrait on leave. */
export function useScreeningLandscape() {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') {
        return undefined;
      }

      let active = true;

      (async () => {
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
          );
        } catch (e) {
          if (active) {
            console.warn('Could not lock landscape orientation:', e);
          }
        }
      })();

      return () => {
        active = false;
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        ).catch(() => {
          ScreenOrientation.unlockAsync().catch(() => {});
        });
      };
    }, [])
  );
}
