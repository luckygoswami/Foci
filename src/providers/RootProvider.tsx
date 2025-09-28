import { AuthProvider } from '@/features/auth';
import { OnlineStatusProvider } from '@/features/connection';
import { CurrentSessionProvider } from '@/features/sessions';
import { UserDataProvider } from '@/features/user';
import { type ReactNode } from 'react';
import { ConfirmProvider } from './ConfirmationContext';

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnlineStatusProvider>
      <ConfirmProvider>
        <AuthProvider>
          <UserDataProvider>
            <CurrentSessionProvider>{children}</CurrentSessionProvider>
          </UserDataProvider>
        </AuthProvider>
      </ConfirmProvider>
    </OnlineStatusProvider>
  );
}
