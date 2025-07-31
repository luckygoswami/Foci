import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  fetchGroupsJoinedByUser,
} from './groupApi';
import {
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from 'firebase/firestore';

// ---- Mocks ---- //
vi.mock('@/lib/firebase-config', () => ({ db: {} }));
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual<any>('firebase/firestore');
  return {
    ...actual,
    doc: vi.fn(),
    getDoc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
  };
});

// Helper: Minimal but realistic DocumentReference mock
const mockDocRef = {
  id: 'abc123',
  path: '/groups/abc123',
  firestore: {},
  converter: {},
  type: 'document',
  parent: {},
  withConverter: () => mockDocRef,
} as any;

// Helper: Create a full QueryDocumentSnapshot mock
function createMockDoc(data: any, id: string) {
  return {
    id,
    data: () => data,
    exists: () => true,
    get: (field: string) => data[field],
    metadata: {},
    ref: {},
  };
}

// Helper: Create an empty QuerySnapshot mock
function createEmptyQuerySnapshot() {
  return {
    empty: true,
    docs: [],
    size: 0,
    forEach: () => {},
    query: {},
    metadata: {},
    docChanges: () => [],
  } as any;
}

// Helper: Create a non-empty QuerySnapshot mock
function createQuerySnapshotWithDocs(docsArr: any[]) {
  const docs = docsArr.map(({ id, ...data }) => createMockDoc(data, id));
  return {
    empty: docs.length === 0,
    docs,
    size: docs.length,
    forEach: (cb: any) => docs.forEach(cb),
    query: {},
    metadata: {},
    docChanges: () => [],
  } as any;
}

// ---- Test Suite ---- //
describe('groupApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Always return a valid doc ref to prevent undefined being used in updateDoc, deleteDoc etc.
    vi.mocked(doc).mockReturnValue(mockDocRef);
  });

  it('fetchGroupById returns group data if exists', async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: 'Test Group' }),
      id: 'group1',
      ref: mockDocRef,
      metadata: {},
      get: () => undefined,
    } as any);
    const result = await fetchGroupById('group1');
    expect(result).toEqual({ name: 'Test Group' });
  });

  it('fetchGroupById returns null if not exists', async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => false,
      id: 'group1',
    } as any);
    const result = await fetchGroupById('group1');
    expect(result).toBeNull();
  });

  it('createGroup returns id on success', async () => {
    vi.mocked(addDoc).mockResolvedValueOnce(mockDocRef);
    const groupData = { name: 'test' } as any;
    const result = await createGroup(groupData);
    expect(result).toBe('abc123');
  });

  it('createGroup returns null on failure', async () => {
    vi.mocked(addDoc).mockRejectedValueOnce(new Error('fail'));
    const result = await createGroup({} as any);
    expect(result).toBeNull();
  });

  it('updateGroup calls updateDoc', async () => {
    await updateGroup('gid', { name: 'yo' });
    // ensure updateDoc is called with any doc ref and correct data
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { name: 'yo' });
  });

  it('deleteGroup will call deleteDoc when group exists', async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      id: 'gid',
      ref: mockDocRef,
      metadata: {},
      get: () => undefined,
    } as any);
    await deleteGroup('gid');
    expect(deleteDoc).toHaveBeenCalled();
  });

  it('deleteGroup does nothing if group does not exist', async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => false,
      id: 'gid',
    } as any);
    await deleteGroup('gid');
    expect(deleteDoc).not.toHaveBeenCalled();
  });

  it('fetchGroupsJoinedByUser returns mapped results', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce(
      createQuerySnapshotWithDocs([
        { id: '1', foo: 'bar' },
        { id: '2', x: 'y' },
      ])
    );
    const result = await fetchGroupsJoinedByUser('uid');
    expect(result).toEqual([
      { groupId: '1', foo: 'bar' },
      { groupId: '2', x: 'y' },
    ]);
  });

  it('fetchGroupsJoinedByUser returns empty array if none', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce(createEmptyQuerySnapshot());
    const result = await fetchGroupsJoinedByUser('uid');
    expect(result).toEqual([]);
  });
});
