import SearchBox from '@/components/SearchBox';
import { useAuth } from '@/features/auth';
import {
  createGroup,
  CreateGroupBottomSheet,
  getGroupsJoinedByUser,
  GroupCard,
} from '@/features/groups';
import { useUserData } from '@/features/user';
import { generateRandomCode } from '@/lib/utils';
import type { FirebaseUserId, GroupId, Group } from '@/types';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

function GroupsDashboard() {
  const userId = useAuth().user?.uid as FirebaseUserId;
  const [showSheet, setShowSheet] = useState(false);
  const { userData } = useUserData();
  const [groups, setGroups] = useState<(Group & { groupId: string })[]>([]);

  function handleSubmit(
    groupData: Pick<
      Group,
      'name' | 'avatarId' | 'description' | 'isPublic' | 'tags'
    >
  ) {
    const now = Date.now();
    const newGroup: Group & { groupId?: GroupId } = {
      ...groupData,
      creatorId: userId,
      memberCount: 1,
      members: [{ userId, role: 'admin', joinedAt: now }],
      memberIds: [userId],
      joinCode: generateRandomCode(),
      createdAt: now,
      updatedAt: now,
    };

    createGroup(newGroup)
      .then((groupId) => {
        if (groupId) {
          setGroups((prev) => [...prev, { ...newGroup, groupId }]);
        }
        // TODO: show a success notification here
      })
      .catch((err) => console.error('Create Group: ', err));
  }

  useEffect(() => {
    if (!userData) return;

    async function fetchGroups() {
      try {
        const groups = await getGroupsJoinedByUser(userId);
        setGroups(groups);
      } catch (err) {
        console.error(err);
      }
    }

    fetchGroups();
  }, [userData]);

  return (
    <main className="flex flex-col px-2 gap-3">
      <div className="mt-2">
        <SearchBox type="group" />
      </div>

      <div className="flex-[1] flex flex-col border-x border-t rounded-tr-2xl rounded-tl-2xl px-2 border-black overflow-hidden">
        <h1 className="font-bold text-3xl m-2">Joined Groups</h1>
        <div className="flex-[1] overflow-y-auto">
          <div className="space-y-4 pb-20">
            {!groups ? (
              <div>Loading...</div>
            ) : (
              groups.map((_, i) => (
                <GroupCard
                  key={groups[i].groupId}
                  groupId={groups[i].groupId}
                  groupData={groups[i]}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <button className="fixed bottom-20 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-10">
        <PlusIcon
          className="size-6"
          onClick={() => setShowSheet(true)}
        />
      </button>
      <CreateGroupBottomSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        onSubmit={(groupData) => {
          handleSubmit(groupData);
          setShowSheet(false);
        }}
      />
    </main>
  );
}

export default GroupsDashboard;
