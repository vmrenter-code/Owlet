import { Platform, useWindowDimensions } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useEffect, useState } from 'react';

export type LandscapeStage = {
  isLandscape: boolean;
  width: number;
  height: number;
  stageStyle: ViewStyle;
  isFaked: boolean;
  showRotateHint: boolean;
};

const ROTATE_FALLBACK_DELAY_MS = 2500;

// Module-level so the fake-landscape state persists across consecutive
// screening screens (PositionChild → ReadyToBegin → VideoScreen).
let fakeLandscapeActive = false;

export function resetScreeningLandscapeState() {
  fakeLandscapeActive = false;
}

export function useScreeningLandscape(): LandscapeStage {
  const { width: vpW, height: vpH } = useWindowDimensions();
  const viewportIsLandscape = vpW > vpH;
  const [fakeLandscape, setFakeLandscape] = useState(() => fakeLandscapeActive);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') return;

      // Allow free rotation. Do NOT force landscape and do NOT re-lock to
      // portrait on cleanup — re-locking caused the simulator to flash back
      // to portrait between screening screens. Portrait re-lock is handled
      // by the screens that actually need it (EKGPlacement, ScreeningComplete,
      // Home), not here.
      ScreenOrientation.unlockAsync().catch(() => {});
      setFakeLandscape(fakeLandscapeActive);
    }, [])
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      setFakeLandscape(false);
      return;
    }

    if (viewportIsLandscape) {
      if (fakeLandscapeActive) fakeLandscapeActive = false;
      setFakeLandscape(false);
      return;
    }

    if (fakeLandscapeActive) {
      setFakeLandscape(true);
      return;
    }

    const timer = setTimeout(() => {
      fakeLandscapeActive = true;
      setFakeLandscape(true);
    }, ROTATE_FALLBACK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [viewportIsLandscape]);

  if (Platform.OS === 'web') {
    return {
      isLandscape: viewportIsLandscape,
      width: vpW,
      height: vpH,
      stageStyle: {
        position: 'absolute',
        width: vpW,
        height: vpH,
        left: 0,
        top: 0,
      },
      isFaked: false,
      showRotateHint: false,
    };
  }

  if (viewportIsLandscape) {
    return {
      isLandscape: true,
      width: vpW,
      height: vpH,
      stageStyle: {
        position: 'absolute',
        width: vpW,
        height: vpH,
        left: 0,
        top: 0,
      },
      isFaked: false,
      showRotateHint: false,
    };
  }

  if (!fakeLandscape) {
    return {
      isLandscape: false,
      width: vpW,
      height: vpH,
      stageStyle: {
        position: 'absolute',
        width: vpW,
        height: vpH,
        left: 0,
        top: 0,
      },
      isFaked: false,
      showRotateHint: true,
    };
  }

  const stageW = vpH;
  const stageH = vpW;
  const left = (vpW - stageW) / 2;
  const top = (vpH - stageH) / 2;

  return {
    isLandscape: true,
    width: stageW,
    height: stageH,
    stageStyle: {
      position: 'absolute',
      width: stageW,
      height: stageH,
      left,
      top,
      transform: [{ rotate: '90deg' }],
    },
    isFaked: true,
    showRotateHint: false,
  };
}
