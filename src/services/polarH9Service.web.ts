import { useState, useCallback } from 'react';

/**
 * Web has no Bluetooth LE stack compatible with react-native-ble-plx.
 * Avoid importing ble-plx on web so the bundle loads and the app can run in the browser.
 */
export function usePolarH9() {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectToH9 = useCallback(async () => {
    setScanning(false);
    setConnected(false);
    setHeartRate(null);
    setError(
      'Bluetooth heart rate (Polar H9) is not available in the browser. Use the iOS or Android app to connect your sensor.'
    );
  }, []);

  const disconnect = useCallback(() => {
    setScanning(false);
    setConnected(false);
    setHeartRate(null);
    setError(null);
  }, []);

  return { heartRate, connected, scanning, error, connectToH9, disconnect };
}
