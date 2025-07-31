import { describe, it, expect } from 'vitest';

import { getGroupRoles, assignRole } from './groupRoles';

// ---- Mock group members for role partition/assignment tests ---- //
const members = [
  {
    userId: 'c',
    name: 'Creator',
    avatarId: 'a1',
    role: 'creator' as 'creator',
    joinedAt: 1,
  },
  {
    userId: 'a',
    name: 'Admin',
    avatarId: 'a2',
    role: 'admin' as 'admin',
    joinedAt: 2,
  },
  {
    userId: 'm',
    name: 'Member',
    avatarId: 'a3',
    role: 'member' as 'member',
    joinedAt: 3,
  },
];

describe('groupRoles', () => {
  // ---- Tests getGroupRoles returns correct role groups ---- //
  it('getGroupRoles partitions roles correctly', () => {
    const result = getGroupRoles(members);
    expect(result.creator.userId).toBe('c');
    expect(result.admins[0].userId).toBe('a');
    expect(result.members[0].userId).toBe('m');
  });

  // ---- Tests assignRole returns the right role for known users ---- //
  it('assignRole returns role for known user', () => {
    const group = { members };
    expect(assignRole(group as any, 'c')).toBe('creator');
    expect(assignRole(group as any, 'a')).toBe('admin');
    expect(assignRole(group as any, 'm')).toBe('member');
  });

  // ---- Tests assignRole returns spectator for unknown user ---- //
  it("assignRole returns 'spectator' for unknown user", () => {
    const group = { members };
    expect(assignRole(group as any, 'notfound')).toBe('spectator');
  });
});
