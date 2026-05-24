import { Platform } from 'react-native';

/** On web, blur focused controls before navigation so inactive screens are not aria-hidden traps. */
export function blurActiveElement() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }
  const active = document.activeElement as HTMLElement | null;
  active?.blur?.();
}
