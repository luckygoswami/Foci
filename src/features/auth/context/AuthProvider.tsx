import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  type User,
} from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase-config';
import { authErrorToMessage } from '@/constants/authErrors';
import { feedback } from '@/lib/feedback';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  googleLogin: () => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  emailSignup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sentVerification, setSentVerification] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      try {
        setLoading(true);
        if (!user) {
          setUser(null);
          return;
        }

        if (user.emailVerified) {
          setUser(user);
        } else {
          setUser(null);
          if (!sentVerification) {
            sendEmailVerification(user, {
              url: window.location.origin,
            });
            feedback.success(
              'Verification email sent. Please check the inbox or spam folder.',
              { duration: 5000 }
            );
          }
        }
      } catch {
        setUser(null);
        feedback.error('Unable to verify account status. Please try again.');
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [sentVerification]);

  async function emailSignup(email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      setSentVerification(false);
    } catch (err: any) {
      console.error('Signup failed:', err);
      throw new Error(authErrorToMessage(err.code));
    }
  }

  async function emailLogin(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      setSentVerification(false);
    } catch (err: any) {
      console.error('Login failed:', err);
      throw new Error(authErrorToMessage(err.code));
    }
  }

  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    } catch (err: any) {
      console.error('Login failed:', err);
      throw new Error(authErrorToMessage(err.code));
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
    } catch (err: any) {
      console.error('Password reset failed:', err);
      throw new Error(authErrorToMessage(err.code));
    }
  }

  async function logout() {
    try {
      await signOut(firebaseAuth);
    } catch (err: any) {
      console.error('Logout failed:', err);
      throw new Error(authErrorToMessage(err.code));
    }
  }

  const authContextValue = useMemo(
    () => ({
      user,
      loading,
      googleLogin,
      emailLogin,
      emailSignup,
      resetPassword,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
