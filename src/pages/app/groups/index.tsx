import SearchBox from '@/components/SearchBox';
import { useAuth } from '@/features/auth';
import {
  CreateGroupBottomSheet,
  getGroupsJoinedByUser,
  GroupCard,
} from '@/features/groups';
import { useUserData } from '@/features/user';
import type { FirebaseUserId, Group, GroupId } from '@/types';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

function GroupsDashboard() {
  const userId = useAuth().user?.uid as FirebaseUserId;
  const [showSheet, setShowSheet] = useState(false);
  const { userData } = useUserData();
  const [groups, setGroups] = useState<(Group & { groupId: GroupId })[]>([]);

  useEffect(() => {
    if (!userData) return;

    getGroupsJoinedByUser(userId).then(setGroups);
  }, [userData]);

  const handleCreation = (newGroup: Group & { groupId: GroupId }) => {
    setGroups((prev) => [...prev, { ...newGroup }]);
    setShowSheet(false);
  };

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
              groups.map((group) => (
                <GroupCard
                  key={group.groupId}
                  groupId={group.groupId}
                  groupData={group}
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
        onCreation={handleCreation}
      />
    </main>
  );
}

export default GroupsDashboard;
