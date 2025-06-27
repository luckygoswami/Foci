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

type UserDataContextType = {
  userData: UserData | undefined;
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
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } catch (e) {
        console.log('Failed to fetch userData: ', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const value = useMemo(() => ({ userData, loading }), [userData, loading]);

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
