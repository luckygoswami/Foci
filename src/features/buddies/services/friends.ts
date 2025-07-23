import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, FriendRequest } from '@/types';

export const sendFriendRequest = async (
  fromId: FirebaseUserId,
  toId: FirebaseUserId,
  message?: string
): Promise<void> => {
  if (fromId === toId) {
    throw new Error("You can't send a friend request to yourself.");
  }

  const friendRequest: FriendRequest = {
    fromId,
    toId,
    createdAt: Date.now(),
    status: 'pending',
    message,
  };

  await addDoc(collection(db, 'friendRequests'), friendRequest);
};

export const getFriendRequests = async (
  userId: FirebaseUserId
): Promise<FriendRequest[]> => {
  const q = query(
    collection(db, 'friendRequests'),
    where('toId', '==', userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FriendRequest);
};
