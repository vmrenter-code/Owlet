import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';

let configured = false;

export function configureGoogleSignIn() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: '398374460192-ln7hlk3h862ks0a7hl6hcmmbcim7rfhf.apps.googleusercontent.com',
    iosClientId: '398374460192-q5umdtk9qkcueu62fhg859v44kr6jate.apps.googleusercontent.com',
  });
  configured = true;
}

export async function signInWithGoogle(): Promise<void> {
  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  await GoogleSignin.signOut();
  const signInResult = await GoogleSignin.signIn();

  const idToken = signInResult.data?.idToken ?? (signInResult as any).idToken;
  if (!idToken) throw new Error('No ID token found');

  const googleCredential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(auth, googleCredential);
}
