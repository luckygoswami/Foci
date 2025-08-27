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
export async function sendGroupInvite(groupInvite: GroupInvite) {
  try {
    await setDoc(
      doc(
        db,
        'groupInvites',
        `${groupInvite.groupId}_${groupInvite.recipientId}`
      ),
      groupInvite
    );
  } catch (err: any) {
    console.error('Error in sending group invite:', err);
    throw new Error('Unable to send invite.');
  }
}

export async function fetchGroupInvitesByRecipient(
  userId: FirebaseUserId
): Promise<GroupInvite[]> {
  const q = query(
    collection(db, 'groupInvites'),
    where('recipientId', '==', userId),
    where('status', '==', 'pending')
  );

  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ ...(doc.data() as GroupInvite) }));
  } catch (err: any) {
    console.error('Error in fetching group invites:', err);
    throw new Error('Unable to fetch invites.');
  }
}

export async function fetchGroupInvitesBySender(
  senderId: FirebaseUserId,
  groupId: GroupId
): Promise<GroupInvite[]> {
  const q = query(
    collection(db, 'groupInvites'),
    where('senderId', '==', senderId),
    where('groupId', '==', groupId),
    where('status', '==', 'pending')
  );

  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ ...(doc.data() as GroupInvite) }));
  } catch (err: any) {
    console.error('Error in fetching group invites:', err);
    throw new Error('Unable to fetch invites.');
  }
}

export async function acceptGroupInvite(invite: GroupInvite) {
  const inviteRef = doc(
    db,
    'groupInvites',
    `${invite.groupId}_${invite.recipientId}`
  );

  try {
    await updateDoc(inviteRef, { status: 'accepted' });
  } catch (err: any) {
    console.error('Error in accepting group invite:', err);
    throw new Error('Unable to accept invite.');
  }
}

export async function rejectGroupInvite(invite: GroupInvite) {
  const inviteRef = doc(
    db,
    'groupInvites',
    `${invite.groupId}_${invite.recipientId}`
  );

  try {
    await updateDoc(inviteRef, { status: 'rejected' });
  } catch (err: any) {
    console.error('Error in rejecting group invite:', err);
    throw new Error('Unable to reject invite');
  }
}
