import { AuthProvider } from '@/features/auth';
import { OnlineStatusProvider } from '@/features/connection';
import { UserDataProvider } from '@/features/user';
import { type ReactNode } from 'react';

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserDataProvider>
        <OnlineStatusProvider>{children}</OnlineStatusProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}
