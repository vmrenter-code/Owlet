import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export const userAuthServices = {
  login: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
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
  }
};

export default userAuthServices;