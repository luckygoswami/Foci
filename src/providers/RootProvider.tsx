import { AuthProvider } from '@/features/auth';
import { OnlineStatusProvider } from '@/features/connection';
import { CurrentSessionProvider } from '@/features/sessions';
import { UserDataProvider } from '@/features/user';
import { type ReactNode } from 'react';

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnlineStatusProvider>
      <AuthProvider>
        <UserDataProvider>
          <CurrentSessionProvider>{children}</CurrentSessionProvider>
        </UserDataProvider>
      </AuthProvider>
    </OnlineStatusProvider>
  );
}
