import { Alert, Platform } from 'react-native';

/**
 * Alert.alert() is a no-op on web (react-native-web doesn't implement it),
 * so error/confirmation messages silently disappear there. This falls back
 * to window.alert/confirm on web and the real native Alert everywhere else.
 */
export function showAlert(
  title: string,
  message?: string,
  buttons?: { text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }[]
) {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;

  if (buttons && buttons.length > 1) {
    const confirmButton = buttons.find((b) => b.style !== 'cancel') ?? buttons[buttons.length - 1];
    if ((globalThis as any).confirm(text)) {
      confirmButton.onPress?.();
    }
    return;
  }

  (globalThis as any).alert(text);
  buttons?.[0]?.onPress?.();
}
