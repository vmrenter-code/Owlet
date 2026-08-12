/**
 * Metro picks `googleAuthService.web.ts` on web and `googleAuthService.native.ts` on iOS/Android
 * before this file. This re-export exists so TypeScript can resolve the import path.
 */
export { configureGoogleSignIn, signInWithGoogle } from './googleAuthService.native';
