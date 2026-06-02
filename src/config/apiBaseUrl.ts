import { Platform } from 'react-native';
import Constants from 'expo-constants';

/** Metro host IP (e.g. 192.168.x.x) so the simulator/device can reach your Mac's API. */
function devMachineHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } })
      .manifest2?.extra?.expoClient?.hostUri;
  if (!hostUri) return null;
  const host = hostUri.split(':')[0];
  return host && host !== 'localhost' ? host : null;
}

export function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL.replace(/\/$/, '');
  }

  const devHost = devMachineHost();
  if (devHost) {
    return `http://${devHost}:4000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }

  return 'http://localhost:4000';
}

export const API_BASE_URL = getApiBaseUrl();
