import type { GroupInvite } from '@/types';
import InviteCard from './InviteCard';
import { useUserData } from '@/features/user';
import type { Ref } from 'react';
import { acceptGroupInvite, rejectGroupInvite } from '../services/groupInvites';
import { addGroupMember } from '../services/groupMembers';
import toast from 'react-hot-toast';

export function InvitesList({
  invites,
  setInvites,
  inviteListRef,
}: {
  invites: GroupInvite[] | null;
  setInvites: (invites: GroupInvite[]) => void;
  inviteListRef: Ref<HTMLDivElement>;
}) {
  const { userData } = useUserData();

  async function handleAccept(invite: GroupInvite) {
    if (!userData) return;
    const userObj = {
      userId: userData.userId,
      name: userData.name,
      avatarId: userData.avatarId,
    };

    try {
      await acceptGroupInvite(invite);
      const newInvites = invites!.filter(
        (inv) => inv.groupId != invite.groupId
      );
      setInvites(newInvites);
      await addGroupMember(invite.groupId, userObj);
      toast.success('Group joined successfully.');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function handleReject(invite: GroupInvite) {
    try {
      rejectGroupInvite(invite);
      const newInvites = invites!.filter(
        (inv) => inv.groupId != invite.groupId
      );
      setInvites(newInvites);
      toast.success('Invite rejected.');
    } catch (err: any) {
      toast.error('Unable to reject invite.');
    }
  }

  return (
    <div
      ref={inviteListRef}
      className="space-y-4 pb-20">
      {!invites ? (
        // TODO: add loading skeleton
        <div>Loading...</div>
      ) : !invites.length ? (
        <div>No Invites yet..</div>
      ) : (
        invites.map((invite) => (
          <InviteCard
            key={invite.groupId}
            invite={invite}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))
      )}
    </div>
  );
}
