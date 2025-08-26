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

export async function sendFriendRequest(
  friendRequest: FriendRequest
): Promise<void> {
  const { senderId, recipientId } = friendRequest;

  if (senderId === recipientId) {
    throw new Error('Cannot send a friend request to self.');
  }

  try {
    await setDoc(
      doc(db, 'friendRequests', `${senderId}_${recipientId}`),
      friendRequest
    );
  } catch (err: any) {
    console.error('Sending friend request failed:', err);
    throw new Error('Failed to send friend request.');
  }
}

export async function fetchRequestsByRecipient(
  recipientId: FirebaseUserId
): Promise<FriendRequest[]> {
  const q = query(
    collection(db, 'friendRequests'),
    where('recipientId', '==', recipientId),
    where('status', '==', 'pending')
  );

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as FriendRequest);
  } catch (err: any) {
    console.error('Fetching friend requests failed:', err);
    throw new Error('Failed to fetch friend requests.');
  }
}

export async function hasSentFriendRequest(
  senderId: FirebaseUserId,
  recipientId: FirebaseUserId
): Promise<FriendRequest | null> {
  const requestId = `${senderId}_${recipientId}`;
  const docRef = doc(db, 'friendRequests', requestId);

  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;

    const data = snapshot.data() as FriendRequest;
    return data.status == 'pending' ? data : null;
  } catch (err: any) {
    console.error('Error in checking friend request sent or not:', err);
    throw new Error('Something went wrong!');
  }
}

export async function unfriendUser(
  userId: FirebaseUserId,
  friendId: FirebaseUserId
) {
  if (userId === friendId) throw new Error('Cannot unfriend yourself');

  try {
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
  } catch (err: any) {
    throw new Error('Unable to unfriend user.');
  }
}

export async function acceptFriendRequest(request: FriendRequest) {
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

  try {
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
  } catch (err: any) {
    throw new Error('Unable to accept friend request.');
  }
}

export async function rejectFriendRequest(request: FriendRequest) {
  const reqId = `${request.senderId}_${request.recipientId}`;
  const reqRef = doc(db, 'friendRequests', reqId);

  try {
    updateDoc(reqRef, { status: 'rejected' });
  } catch (err: any) {
    throw new Error('Unable to reject friend request.');
  }
}
