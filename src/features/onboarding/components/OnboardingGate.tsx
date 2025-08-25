import { useAuth } from '@/features/auth';
import { db } from '@/lib/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { OnboardingWizard } from './OnboardingWizard';
import { LoadingScreen } from '@/components';

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user || authLoading) return;

    const checkOnboardingStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setNeedsOnboarding(!userDoc.exists());
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        setNeedsOnboarding(true);
      }
    };

    checkOnboardingStatus();
  }, [user, authLoading]);

  if (authLoading || needsOnboarding === null) {
    return <LoadingScreen />;
  }

  if (needsOnboarding) {
    return <OnboardingWizard user={user!} />;
  }

  return <>{children}</>;
}
