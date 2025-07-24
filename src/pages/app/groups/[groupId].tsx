import {
  fetchGroupById,
  GroupDetails,
  GroupMembersList,
} from '@/features/groups';
import type { Group, GroupId } from '@/types';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export default function GroupDetailsPage() {
  const location = useLocation();
  const { groupId } = useParams<{ groupId: GroupId }>();
  const { groupData } = location.state || {};
  const [group, setGroup] = useState<Group | null>(groupData || null);

  useEffect(() => {
    if (group || !groupId) return;

    fetchGroupById(groupId)
      .then(setGroup)
      .catch((err) => console.error(err));
  }, [groupId]);

  return (
    <main className="bg-white flex flex-col justify-between px-4 py-2">
      {!group ? (
        // TODO: add loading skeleton
        <div>Loading...</div>
      ) : (
        <>
          <GroupDetails group={group} />
          <GroupMembersList members={group.members} />
        </>
      )}

      {/* Actions */}
      <div className="actions-menu h-1/12 borde border-yellow-500 flex gap-4 mt-2">
        <button className="flex-1 py-2 rounded-xl bg-blue-200 text-blue-700 font-semibold text-xl flex items-center justify-center gap-2 hover:bg-blue-300 transition-colors">
          <span className="text-2xl">&#8594;</span>
          Invite
        </button>
        <button className="flex-1 py-2 rounded-xl bg-red-100 text-red-400 font-semibold text-lg flex items-center justify-center gap-2 hover:bg-red-200 transition-colors">
          <span className="text-2xl">&#8592;</span>
          Leave
        </button>
      </div>
    </main>
  );
}
