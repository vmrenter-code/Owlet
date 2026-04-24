import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

export const userAuthServices = {
  login: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message ?? 'Unable to log out.' };
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: username.trim() });
      return { success: true, user: result.user };
    } catch (error: any) {
      let message = 'Something went wrong.';
      switch (error.code) {
        case 'auth/email-already-in-use': message = 'That email is already in use.'; break;
        case 'auth/invalid-email':        message = 'Please enter a valid email.'; break;
        case 'auth/weak-password':        message = 'Password must be at least 6 characters.'; break;
      }
      return { success: false, error: message };
    }
  },

  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      let message = 'Failed to send reset email.';
      switch (error.code) {
        case 'auth/invalid-email': message = 'Please enter a valid email.'; break;
        case 'auth/user-not-found': message = 'User not found.'; break;
        case 'auth/too-many-requests': message = 'Too many requests. Try again later.'; break;
      }
      return { success: false, error: message };
    }
  },

  deleteAccount: async () => {
    try {
      if (!auth.currentUser) {
        return { success: false, error: 'No active user found.' };
      }

      await deleteUser(auth.currentUser);
      return { success: true };
    } catch (error: any) {
      let message = 'Failed to delete account. Please try again.';
      switch (error?.code) {
        case 'auth/requires-recent-login':
          message = 'For security, please log in again and then delete your account.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Try again later.';
          break;
      }
      return { success: false, error: message };
    }
  }
};

export default userAuthServices;