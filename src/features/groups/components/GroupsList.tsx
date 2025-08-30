import GroupCard from './GroupCard';
import type { Group, GroupId } from '@/types';

export function GroupsList({
  groups,
}: {
  groups: (Group & { groupId: GroupId })[] | null;
}) {
  return (
    <div className="space-y-2 pb-20">
      {!groups ? (
        // TODO: add loading skeleton
        <div>Loading...</div>
      ) : !groups.length ? (
        <div>No groups joined yet...</div>
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
  );
}
