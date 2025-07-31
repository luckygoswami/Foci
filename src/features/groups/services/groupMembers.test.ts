import { beforeEach, describe, expect, it, vi } from 'vitest';

import { addGroupMember, removeGroupMember } from './groupMembers';

import {
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  FieldValue,
} from 'firebase/firestore';

// ---- Mock Firestore & Firebase Config ---- //
vi.mock('@/lib/firebase-config', () => ({ db: {} }));
vi.mock('firebase/firestore', async () => {
  // Re-export actuals and override Firestore methods with spies
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    updateDoc: vi.fn(),
    arrayUnion: vi.fn(),
    arrayRemove: vi.fn(),
    doc: vi.fn(),
  };
});

describe('groupMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock arrayUnion to return dummy FieldValue with isEqual method
    vi.mocked(arrayUnion).mockImplementation((...items) => {
      return {
        _mockedItems: items,
        isEqual: () => false,
      } as unknown as FieldValue;
    });
    // Mock arrayRemove likewise
    vi.mocked(arrayRemove).mockImplementation((item) => {
      return {
        _mockedItem: item,
        isEqual: () => false,
      } as unknown as FieldValue;
    });
    // Mock doc() to always return string 'docRef'
    vi.mocked(doc).mockImplementation(() => 'docRef' as any);
  });

  it('addGroupMember updates group with new user', async () => {
    await addGroupMember('gid', { userId: 'u1', name: 'A', avatarId: 'v1' });
    // Check updateDoc called with ref and expected fields
    expect(updateDoc).toHaveBeenCalledWith(
      'docRef',
      expect.objectContaining({
        memberIds: expect.anything(),
        members: expect.anything(),
      })
    );
  });

  it('removeGroupMember removes member from group', async () => {
    await removeGroupMember('gid', {
      userId: 'u2',
      name: 'B',
      avatarId: 'v2',
      role: 'member',
      joinedAt: 0,
    });
    // Check updateDoc called to update members after removal
    expect(updateDoc).toHaveBeenCalledWith(
      'docRef',
      expect.objectContaining({
        memberIds: expect.anything(),
        members: expect.anything(),
      })
    );
  });
});
