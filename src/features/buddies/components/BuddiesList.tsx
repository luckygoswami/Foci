import type { Friend } from '@/types';
import BuddyCard from './BuddyCard';

export function BuddiesList({ friends }: { friends: Friend[] | null }) {
  return (
    <div className="flex-col">
      {!friends ? (
        // TODO: add loading skeleton
        <div>loading...</div>
      ) : !friends.length ? (
        <div>no buddies yet...</div>
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
