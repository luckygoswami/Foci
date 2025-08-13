import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  runTransaction,
  arrayUnion,
  updateDoc,
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

export const fetchRequestsByRecipient = async (
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
): Promise<FriendRequest | null> => {
  const requestId = `${senderId}_${recipientId}`;
  const docRef = doc(db, 'friendRequests', requestId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data() as FriendRequest;
  return data.status == 'pending' ? data : null;
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

export const acceptFriendRequest = async (request: FriendRequest) => {
  const { senderId, recipientId } = request;
  const requestId = `${senderId}_${recipientId}`;
  const friend = {
    userId: request.senderId,
    name: request.senderName,
    avatarId: request.senderAvatarId,
  };
  const user = {
    userId: request.recipientId,
    name: request.recipientName,
    avatarId: request.recipientAvatarId,
  };

  await runTransaction(db, async (tx) => {
    const userRef = doc(db, 'users', recipientId);
    const friendRef = doc(db, 'users', senderId);
    const reqRef = doc(db, 'friendRequests', requestId);

    tx.update(userRef, {
      friends: arrayUnion(friend),
    });

    tx.update(friendRef, {
      friends: arrayUnion(user),
    });

    tx.update(reqRef, {
      status: 'accepted',
    });
  });
};

export const rejectFriendRequest = async (request: FriendRequest) => {
  const reqId = `${request.senderId}_${request.recipientId}`;

  const reqRef = doc(db, 'friendRequests', reqId);
  updateDoc(reqRef, {
    status: 'rejected',
  });
};
