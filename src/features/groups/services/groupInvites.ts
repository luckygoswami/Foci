import {
  doc,
  setDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, GroupId, GroupInvite } from '@/types';

// Use unique doc id: `${groupId}_${recipientId}`
export const sendGroupInvite = async (groupInvite: GroupInvite) => {
  try {
    await setDoc(
      doc(
        db,
        'groupInvites',
        `${groupInvite.groupId}_${groupInvite.recipientId}`
      ),
      groupInvite
    );
  } catch (err) {
    throw new Error('Failed to send invite.');
  }
};

export const fetchGroupInvitesByRecipient = async (
  userId: FirebaseUserId
): Promise<GroupInvite[]> => {
  const q = query(
    collection(db, 'groupInvites'),
    where('recipientId', '==', userId),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];
  return snapshot.docs.map((doc) => ({ ...(doc.data() as GroupInvite) }));
};

export const fetchGroupInvitesBySender = async (
  senderId: FirebaseUserId,
  groupId: GroupId
): Promise<GroupInvite[]> => {
  const q = query(
    collection(db, 'groupInvites'),
    where('senderId', '==', senderId),
    where('groupId', '==', groupId),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];
  return snapshot.docs.map((doc) => ({ ...(doc.data() as GroupInvite) }));
};

export const acceptGroupInvite = async (invite: GroupInvite) => {
  const inviteRef = doc(
    db,
    'groupInvites',
    `${invite.groupId}_${invite.recipientId}`
  );
  await updateDoc(inviteRef, { status: 'accepted' });
};

export const rejectGroupInvite = async (invite: GroupInvite) => {
  const inviteRef = doc(
    db,
    'groupInvites',
    `${invite.groupId}_${invite.recipientId}`
  );
  await updateDoc(inviteRef, { status: 'rejected' });
};
