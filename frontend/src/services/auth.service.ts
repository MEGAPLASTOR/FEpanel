import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User 
} from 'firebase/auth';

export const authService = {
  async loginWithEmail(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    try {
      const idToken = await userCredential.user.getIdToken();
      await fetch('/api/login', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    } catch (e) {
      console.warn('Cookie sync warning:', e);
    }
    return userCredential.user;
  },

  async registerWithEmail(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    try {
      const idToken = await userCredential.user.getIdToken();
      await fetch('/api/login', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    } catch (e) {
      console.warn('Cookie sync warning:', e);
    }
    return userCredential.user;
  },

  async logoutUser() {
    await signOut(auth);
    try {
      await fetch('/api/logout');
    } catch (e) {
      // ignore
    }
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};
