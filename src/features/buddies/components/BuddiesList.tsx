import type { Friend } from '@/types';
import BuddyCard from './BuddyCard';
import { EmptyData } from '@/components/EmptyData';

export function BuddiesList({ friends }: { friends: Friend[] | null }) {
  return (
    <div className="space-y-2 pb-20">
      {!friends ? (
        // TODO: add loading skeleton
        <div>loading...</div>
      ) : !friends.length ? (
        <EmptyData type="users" />
      ) : (
        friends.map((friend, i) => (
          <BuddyCard
            key={friend.userId + i}
            friend={friend}
          />
        ))
      )}
    </div>
  );
}
