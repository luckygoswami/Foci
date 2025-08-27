import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, UserData } from '@/types';

export async function fetchUserDataByUserId(
  userId: FirebaseUserId
): Promise<UserData | undefined> {
  const userRef = doc(db, 'users', userId);

  try {
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? (snapshot.data() as UserData) : undefined;
  } catch (err) {
    console.error('Error fetching user data by userId:', err);
    throw new Error('Something went wrong.');
  }
}

export async function updateUser(
  userId: FirebaseUserId,
  data: Partial<UserData>
): Promise<void> {
  const userRef = doc(db, 'users', userId);

  try {
    await updateDoc(userRef, data);
  } catch (err) {
    console.error('Error in updating user:', err);
    throw new Error('Unable to update.');
  }
}
