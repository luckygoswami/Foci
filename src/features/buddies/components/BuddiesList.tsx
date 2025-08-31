import type { Friend } from '@/types';
import BuddyCard from './BuddyCard';

export function BuddiesList({ friends }: { friends: Friend[] | null }) {
  return (
    <div className="space-y-2 pb-20">
      {!friends ? (
        // TODO: add loading skeleton
        <div>loading...</div>
      ) : !friends.length ? (
        <div>No buddies yet...</div>
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
