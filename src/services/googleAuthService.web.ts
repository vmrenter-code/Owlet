/**
 * @react-native-google-signin/google-signin has no web build and touches the
 * native bridge at import time. Avoid importing it on web so the bundle loads
 * and the app can run in the browser.
 */
export function configureGoogleSignIn() {
  // no-op on web
}

export async function signInWithGoogle(): Promise<void> {
  throw new Error(
    'Google Sign-In is not available in the browser. Use the iOS or Android app to sign in with Google.'
  );
}
