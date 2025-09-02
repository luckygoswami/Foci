import { EmptyData } from '@/components/EmptyData';
import GroupCard from './GroupCard';
import type { Group, GroupId } from '@/types';
import { GroupsListSkeleton } from '@/components';

export function GroupsList({
  groups,
}: {
  groups: (Group & { groupId: GroupId })[] | null;
}) {
  if (!groups) return <GroupsListSkeleton />;

  return (
    <ol className="space-y-2 pb-20">
      {!groups.length ? (
        <EmptyData type="groups" />
      ) : (
        groups.map((group) => (
          <GroupCard
            key={group.groupId}
            groupId={group.groupId}
            groupData={group}
          />
        ))
      )}
    </ol>
  );
}
