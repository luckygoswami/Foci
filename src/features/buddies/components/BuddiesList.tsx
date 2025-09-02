import type { Friend } from '@/types';
import BuddyCard from './BuddyCard';
import { EmptyData } from '@/components/EmptyData';
import { BuddiesListSkeleton } from '@/components';

export function BuddiesList({ friends }: { friends: Friend[] | null }) {
  if (!friends) return <BuddiesListSkeleton />;

  return (
    <ol className="space-y-2 pb-20">
      {!friends.length ? (
        <EmptyData type="users" />
      ) : (
        friends.map((friend, i) => (
          <BuddyCard
            key={friend.userId + i}
            friend={friend}
          />
        ))
      )}
    </ol>
  );
}
