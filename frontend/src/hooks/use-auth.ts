import { create } from 'zustand';
import { User, onAuthStateChanged, Unsubscribe } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authService } from '@/services/auth.service';

export const getFriendlyErrorMessage = (error: any): string => {
  const code = error?.code || '';
  const message = error?.message || '';

  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'Tên tài khoản hoặc mật khẩu không chính xác.';
  }
  if (code.includes('email-already-in-use')) {
    return 'Tài khoản hoặc Email này đã tồn tại. Vui lòng bấm Đăng nhập.';
  }
  if (code.includes('invalid-email')) {
    return 'Định dạng tài khoản/email không hợp lệ.';
  }
  if (code.includes('weak-password')) {
    return 'Mật khẩu quá ngắn, vui lòng nhập tối thiểu 6 ký tự.';
  }
  if (code.includes('network-request-failed')) {
    return 'Lỗi kết nối mạng, vui lòng kiểm tra internet và thử lại.';
  }
  if (code.includes('too-many-requests')) {
    return 'Đã thử quá nhiều lần. Vui lòng đợi 1-2 phút rồi thử lại.';
  }
  return message.replace('Firebase: Error ', '').replace(/\(auth\/.*\)\.?/, '').trim() || 'Đã có lỗi xảy ra khi xác thực.';
};

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  init: () => Unsubscribe;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await authService.loginWithEmail(email, password);
    } catch (err: any) {
      const friendlyMsg = getFriendlyErrorMessage(err);
      set({ error: friendlyMsg, loading: false });
      throw err;
    }
  },

  register: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      await authService.registerWithEmail(email, password, displayName);
    } catch (err: any) {
      const friendlyMsg = getFriendlyErrorMessage(err);
      set({ error: friendlyMsg, loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await authService.logoutUser();
      set({ user: null, loading: false });
    } catch (err: any) {
      set({ error: getFriendlyErrorMessage(err), loading: false });
    }
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ loading: false });
    } catch (err: any) {
      set({ error: getFriendlyErrorMessage(err), loading: false });
      throw err;
    }
  },

  init: () => {
    const timer = setTimeout(() => {
      set((state) => ({ initialized: true, loading: false }));
    }, 2000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(timer);
        set({ user, loading: false, initialized: true });
      },
      (err) => {
        clearTimeout(timer);
        console.error('Firebase Auth Init Error:', err);
        set({ user: null, loading: false, initialized: true, error: getFriendlyErrorMessage(err) });
      }
    );
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  },
}));
