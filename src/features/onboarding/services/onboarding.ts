import type { User } from 'firebase/auth';
import type { OnboardingState } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, Subject } from '@/types';
import { newId } from '@/lib/utils';

export function defaultState(user: User): OnboardingState {
  return {
    username: '',
    name: user.displayName || '',
    bio: '',
    subjects: [],
    dailyTargetMinutes: 120,
    weeklyTargetMinutes: 900,
  };
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  try {
    if (!username || username.trim() === '') {
      throw new Error('Username cannot be empty.');
    }

    const ref = doc(db, 'usernames', username.toLowerCase());
    const snap = await getDoc(ref);

    return !snap.exists();
  } catch (err: any) {
    console.error('Error checking username availability:', err);
    throw new Error('Username check failed. Try again later.');
  }
}

export function sanitiseUsername(username: string): string {
  return username.toLowerCase().replace(/[^A-Za-z0-9_]/g, '');
}

export function isValidUsername(username: string): boolean {
  return /^[a-z][a-z0-9_]{2,19}$/.test(username);
}

export async function reserveUsername(uid: string, username: string) {
  const isValid = isValidUsername(username.toLowerCase());
  if (!isValid) {
    throw new Error('Invalid username.');
  }

  const usernamesRef = doc(db, 'usernames', username.toLowerCase());
  try {
    const nameSnap = await getDoc(usernamesRef);
    if (nameSnap.exists()) {
      throw new Error('Username already taken.');
    }

    await setDoc(usernamesRef, { uid, createdAt: Date.now() });
    // no-op for user doc here; we will set after onboarding completes
  } catch (err: any) {
    console.error('Error in reserving username:', err);
    throw new Error('Unable to get username. Try again later.');
  }
}

export function populateUsername(
  userId: FirebaseUserId,
  form: OnboardingState
): string {
  if (form.username) return form.username;

  const now = String(Date.now());
  const name = sanitiseUsername(form.name) || 'member';
  const username = `${name.slice(0, 10)}_${userId.slice(0, 2)}${now.slice(
    -3,
    13
  )}`;

  return username.toLowerCase();
}

export function populateSubjects(form: OnboardingState): Subject[] {
  const { subjects } = form;
  if (subjects.length) {
    return subjects;
  }

  const now = Date.now();

  return [
    {
      name: 'study',
      subjectId: newId(),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function populateName(userId: FirebaseUserId, form: OnboardingState) {
  return form.name || `User ${userId.slice(0, 3)}`;
}
