import { useAuth } from '@/features/auth/context/AuthProvider';
import { db } from '@/lib/firebase-config';
import type { UserData } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { feedback } from '@/lib/feedback';

type UserDataContextType = {
  userData: UserData | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>;
  loading: boolean;
};

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(undefined);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        feedback.error('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const value = useMemo(
    () => ({ userData, setUserData, loading }),
    [userData, loading]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context)
    throw new Error('useUserData must be used within a UserDataProvider');
  return context;
};
