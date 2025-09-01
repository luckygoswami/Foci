import {
  addGroupMember,
  assignRole,
  fetchGroupById,
  fetchGroupInvitesBySender,
  FriendsInviteModal,
  GroupDetails,
  GroupMembersList,
  removeGroupMember,
  sendGroupInvite,
} from '@/features/groups';
import { useUserData } from '@/features/user';
import type { Friend, Group, GroupId, GroupInvite } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';

export default function GroupDetailsPage() {
  const { userData } = useUserData();
  const location = useLocation();
  const { groupId } = useParams<{ groupId: GroupId }>();
  const { groupData } = location.state || {};
  const [group, setGroup] = useState<Group | null>(groupData || null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [sentInvites, setSentInvites] = useState<GroupInvite[] | null>(null);
  const [role, setRole] = useState<
    'admin' | 'creator' | 'member' | 'spectator'
  >('spectator');

  useEffect(() => {
    if (!showInviteModal || !userData || !groupId || sentInvites) return;
    fetchGroupInvitesBySender(userData.userId, groupId)
      .then(setSentInvites)
      .catch((err) => toast.error(err.message));
  }, [showInviteModal]);

  useEffect(() => {
    if (!groupId || !userData) return;

    if (!group) {
      fetchGroupById(groupId)
        .then(setGroup)
        .catch((err) => toast.error(err.message));
    } else {
      setRole(assignRole(group, userData.userId));
    }
  }, [groupId, userData, group]);

  const inviteListFriends = (
    invites: GroupInvite[] | null
  ): (Friend & { invited: boolean })[] | null => {
    if (!invites) return null;

    const invitedUserIds = invites.map((invite) => invite.recipientId);
    const friendsNotInGroup = userData!.friends.filter(
      (friend) => !group?.memberIds.includes(friend.userId)
    );
    return friendsNotInGroup.map((friendObj) => {
      return invitedUserIds.includes(friendObj.userId)
        ? { ...friendObj, invited: true }
        : { ...friendObj, invited: false };
    });
  };

  function handleInvite(recipient: Friend & { invited: boolean }) {
    if (!groupId || !group || !userData) return;
    const {
      userId: senderId,
      name: senderName,
      avatarId: senderAvatarId,
    } = userData;
    const { name: groupName, avatarId: groupAvatarId } = group;

    const newInvite: GroupInvite = {
      senderId,
      senderName,
      senderAvatarId,
      groupId,
      groupName,
      groupAvatarId,
      recipientId: recipient.userId,
      createdAt: Date.now(),
      status: 'pending',
    };

    sendGroupInvite(newInvite).catch((err) => toast.error(err.message));
    setSentInvites((prev) => [...prev!, newInvite]);
  }

  function handleJoin() {
    if (!groupId || !userData) return;
    const userObj = {
      userId: userData.userId,
      name: userData.name,
      avatarId: userData.avatarId,
    };

    addGroupMember(groupId, userObj).catch((err) => toast.error(err.message));

    setRole('member');
    setGroup((prev) => ({
      ...prev!,
      memberIds: [...prev!.memberIds, userObj.userId],
      members: [
        ...prev!.members,
        { ...userObj, role: 'member', joinedAt: Date.now() },
      ],
    }));
  }

  function handleLeave() {
    if (!groupId || !userData) return;
    const memberObj = group?.members.find(
      (mem) => mem.userId == userData.userId
    );

    removeGroupMember(groupId, memberObj!).catch((err) =>
      toast.error(err.message)
    );

    setRole('spectator');
    const memberIds = group!.memberIds.filter((id) => id != userData.userId);
    const members = group!.members.filter(
      (mem) => mem.userId != userData.userId
    );
    setGroup((prev) => ({
      ...prev!,
      memberIds,
      members,
    }));
  }

  // TODO: add loading skeleton
  if (!group || !userData) return <div>Loading...</div>;

  return (
    <div
      role="region"
      aria-label="Group Details"
      className="bg-white flex flex-col justify-between p-5">
      <>
        <GroupDetails group={group} />
        <GroupMembersList members={group.members} />
        <FriendsInviteModal
          open={showInviteModal}
          onOpenChange={setShowInviteModal}
          onInvite={handleInvite}
          friends={inviteListFriends(sentInvites)}
        />
        {/* Actions */}
        <div className="actions-menu h-1/12 flex gap-4 mt-2">
          {role != 'spectator' ? (
            <>
              {role != 'member' && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex-1 py-2 rounded-xl bg-blue-200 text-blue-700 font-semibold text-xl flex items-center justify-center gap-2 hover:bg-blue-300 transition-colors">
                  <span className="text-2xl">&#8594;</span>
                  Invite
                </button>
              )}

              {role != 'creator' && (
                <button
                  onClick={handleLeave}
                  className="flex-1 py-2 rounded-xl bg-red-100 text-red-400 font-semibold text-lg flex items-center justify-center gap-2 hover:bg-red-200 transition-colors">
                  <span className="text-2xl">&#8592;</span>
                  Leave
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleJoin}
              className="flex-1 py-2 rounded-xl bg-blue-200 text-blue-700 font-semibold text-xl flex items-center justify-center gap-2 hover:bg-blue-300 transition-colors">
              <span className="text-2xl">&#8594;</span>
              Join
            </button>
          )}
        </div>
      </>
    </div>
  );
}
