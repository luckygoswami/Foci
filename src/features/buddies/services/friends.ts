import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  runTransaction,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, FriendRequest, UserData } from '@/types';

export const sendFriendRequest = async (
  friendRequest: FriendRequest
): Promise<void> => {
  const { senderId, recipientId } = friendRequest;

  if (senderId === recipientId) {
    throw new Error("You can't send a friend request to yourself.");
  }

  await setDoc(
    doc(db, 'friendRequests', `${senderId}_${recipientId}`),
    friendRequest
  );
};

export const fetchFriendRequests = async (
  recipientId: FirebaseUserId
): Promise<FriendRequest[]> => {
  const q = query(
    collection(db, 'friendRequests'),
    where('recipientId', '==', recipientId),
    where('status', '==', 'pending')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FriendRequest);
};

export const hasSentFriendRequest = async (
  senderId: FirebaseUserId,
  recipientId: FirebaseUserId
): Promise<boolean> => {
  const requestId = `${senderId}_${recipientId}`;
  const docRef = doc(db, 'friendRequests', requestId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() && snapshot.data().status == 'pending';
};

export const unfriendUser = async (
  userId: FirebaseUserId,
  friendId: FirebaseUserId
) => {
  if (userId === friendId) throw new Error('Cannot unfriend yourself');

  await runTransaction(db, async (tx) => {
    const userRef = doc(db, 'users', userId);
    const friendRef = doc(db, 'users', friendId);

    const [userSnap, friendSnap] = await Promise.all([
      tx.get(userRef),
      tx.get(friendRef),
    ]);

    if (!userSnap.exists() || !friendSnap.exists()) {
      throw new Error('User or friend not found');
    }

    const userData = userSnap.data() as UserData;
    const friendData = friendSnap.data() as UserData;

    tx.update(userRef, {
      friends: userData.friends.filter((f) => f.userId !== friendId),
    });

    tx.update(friendRef, {
      friends: friendData.friends.filter((f) => f.userId !== userId),
    });
  });
};
