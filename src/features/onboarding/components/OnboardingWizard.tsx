import { useState } from 'react';
import type { OnboardingState } from '../types';
import type { UserData } from '@/types';
import type { User } from 'firebase/auth';
import { db } from '@/lib/firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { Progress } from './Progress';
import { StepBasics } from './StepBasics';
import { StepAvatar } from './StepAvatar';
import { StepStudy } from './StepStudy';
import {
  defaultState,
  populateName,
  populateSubjects,
  populateUsername,
  reserveUsername,
} from '../services/onboarding';
import { useAuth } from '@/features/auth';
import { useUserData } from '@/features/user';
import toast from 'react-hot-toast';

export function OnboardingWizard({
  user,
  onComplete,
}: {
  user: User;
  onComplete?: () => void;
}) {
  const { logout } = useAuth();
  const { setUserData } = useUserData();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OnboardingState>(() => defaultState(user));
  const [loading, setLoading] = useState(false);
  const MAX_STEP = 3;

  const handleNext = () => setStep((s) => Math.min(MAX_STEP, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  async function handleSubmit() {
    setLoading(true);
    try {
      const now = Date.now();
      const { uid: userId, email } = user;
      const username = populateUsername(userId, form);
      const name = populateName(userId, form);
      const subjects = populateSubjects(form);
      const { avatarId, bio, dailyTargetMinutes, weeklyTargetMinutes } = form;

      await reserveUsername(user.uid, username);

      const userDoc: UserData = {
        userId,
        username,
        name,
        email,
        avatarId: avatarId ?? 'boy_2423856',
        bio,
        subjects,
        dailyTargetMinutes,
        weeklyTargetMinutes,
        totalStudyTime: 0,
        lastActive: now,
        friends: [],
        createdAt: now,
        updatedAt: now,
        streak: { current: 0, longest: 0, lastActivityDate: now - 86400000 },
        privacySettings: {
          showStudyTime: true,
          showOnlineStatus: true,
        },
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userDoc);
        setUserData(userDoc);
        onComplete?.();
        toast.success(
          <span>
            Welcome to Foci, <strong>{name}</strong>!
          </span>
        );
      } catch {
        throw new Error('Unable to create user. Try again later.');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div
        className="flex"
        role="region"
        aria-label="Onboarding form">
        <form className="flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md bg-white rounded-2xl shadow p-6">
            <Progress
              step={step}
              max={MAX_STEP}
            />
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-600">
                  Setting up account for
                  <br />
                  <span className="font-semibold text-slate-800">
                    {user.email}
                  </span>
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={logout}>
                Not you?
              </button>
            </div>

            {step === 1 && (
              <StepBasics
                form={form}
                setForm={setForm}
              />
            )}
            {step === 2 && (
              <StepAvatar
                form={form}
                setForm={setForm}
              />
            )}
            {step === 3 && (
              <StepStudy
                form={form}
                setForm={setForm}
              />
            )}
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleBack}
                disabled={step === 1}
                type="button"
                className="px-4 py-2 rounded-md bg-muted text-muted-foreground disabled:opacity-50 shadow-sm">
                Back
              </button>
              {step < MAX_STEP ? (
                <button
                  onClick={handleNext}
                  type="button"
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground shadow-sm">
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  type="button"
                  className="px-4 py-2 rounded-md bg-green-600 text-white disabled:opacity-50 shadow-sm">
                  {loading ? 'Creating...' : 'Create Profile'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
