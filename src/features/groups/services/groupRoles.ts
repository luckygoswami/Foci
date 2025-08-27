import type { Group, GroupMember, FirebaseUserId } from '@/types';

export type GroupMemberRoles = {
  creator: GroupMember;
  admins: GroupMember[];
  members: GroupMember[];
};

export function getGroupRoles(groupMembers: GroupMember[]): GroupMemberRoles {
  const creator = groupMembers.find(
    (mem) => mem.role === 'creator'
  ) as GroupMember;
  const admins = groupMembers.filter((mem) => mem.role === 'admin');
  const members = groupMembers.filter((mem) => mem.role === 'member');
  return { creator, admins, members };
}

export function assignRole(group: Group, userId: FirebaseUserId) {
  const member = group.members.find((mem) => mem.userId == userId);
  return member ? member.role : 'spectator';
}
