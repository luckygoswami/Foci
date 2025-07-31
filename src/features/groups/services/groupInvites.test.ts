import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  sendGroupInvite,
  fetchGroupInvitesByRecipient,
  fetchGroupInvitesBySender,
  acceptGroupInvite,
  rejectGroupInvite,
} from './groupInvites';

import {
  setDoc,
  getDocs,
  updateDoc,
  doc,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

// ---- Firestore Mock Helpers ---- //

// Returns a minimal mock QueryDocumentSnapshot for tests
function makeMockDoc(dataObj: any, id: string = 'doc1'): QueryDocumentSnapshot {
  return {
    id,
    data: () => dataObj,
    exists: true,
    get: (field: string) => dataObj[field],
    metadata: {},
    ref: {},
  } as any;
}

// Returns a mock QuerySnapshot with docs for tests
function makeMockQuerySnapshot(docsArr: any[]): QuerySnapshot {
  const docs = docsArr.map((data, i) => makeMockDoc(data, `doc${i + 1}`));
  return {
    docs,
    size: docs.length,
    empty: docs.length === 0,
    forEach: (cb: any) => docs.forEach(cb),
    query: {},
    metadata: {},
    docChanges: () => [],
  } as any;
}

// Returns an empty QuerySnapshot mock
function makeEmptyQuerySnapshot(): QuerySnapshot {
  return {
    docs: [],
    size: 0,
    empty: true,
    forEach: () => {},
    query: {},
    metadata: {},
    docChanges: () => [],
  } as any;
}

// ---- Global Mocks ---- //
vi.mock('@/lib/firebase-config', () => ({ db: {} }));
vi.mock('firebase/firestore', async () => {
  // Re-export actuals and override Firestore core methods with spies
  const actual = await vi.importActual<any>('firebase/firestore');
  return {
    ...actual,
    doc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    getDocs: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
  };
});

describe('groupInvites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure doc() always returns a doc reference object for calls in tests
    vi.mocked(doc).mockReturnValue({
      id: 'mock-id',
      path: '/mock/path',
      firestore: {},
      converter: {},
      type: 'document',
      parent: {},
      withConverter: () => ({}),
    } as any);
  });

  it('sendGroupInvite calls setDoc', async () => {
    vi.mocked(setDoc).mockResolvedValueOnce(undefined);
    await sendGroupInvite({
      senderId: 's',
      senderName: 'foo',
      senderAvatarId: 'sa',
      groupId: 'g',
      groupName: 'gn',
      groupAvatarId: 'ga',
      recipientId: 'u',
      createdAt: 1,
      status: 'pending',
    });
    expect(setDoc).toHaveBeenCalled();
  });

  it('fetchGroupInvitesByRecipient returns group invites', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce(
      makeMockQuerySnapshot([{ x: 'y' }])
    );
    const result = await fetchGroupInvitesByRecipient('u1');
    expect(result).toEqual([{ x: 'y' }]);
  });

  it('fetchGroupInvitesByRecipient returns [] when empty', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce(makeEmptyQuerySnapshot());
    const result = await fetchGroupInvitesByRecipient('u1');
    expect(result).toEqual([]);
  });

  it('fetchGroupInvitesBySender returns group invites', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce(
      makeMockQuerySnapshot([{ x: 'y' }])
    );
    const result = await fetchGroupInvitesBySender('sid', 'gid');
    expect(result).toEqual([{ x: 'y' }]);
  });

  it('acceptGroupInvite updates invite status to accepted', async () => {
    await acceptGroupInvite({
      senderId: 's',
      senderName: 'foo',
      senderAvatarId: 'sa',
      groupId: 'g',
      groupName: 'gn',
      groupAvatarId: 'ga',
      recipientId: 'u',
      createdAt: 1,
      status: 'pending',
    });
    // updateDoc should be called with a doc ref and correct status
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      status: 'accepted',
    });
  });

  it('rejectGroupInvite updates invite status to rejected', async () => {
    await rejectGroupInvite({
      senderId: 's',
      senderName: 'foo',
      senderAvatarId: 'sa',
      groupId: 'g',
      groupName: 'gn',
      groupAvatarId: 'ga',
      recipientId: 'u',
      createdAt: 1,
      status: 'pending',
    });
    // updateDoc should be called with a doc ref and correct status
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      status: 'rejected',
    });
  });
});
