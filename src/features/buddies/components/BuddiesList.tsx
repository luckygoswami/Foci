import type { Friend } from '@/types';
import BuddyCard from './BuddyCard';

export function BuddiesList({ friends }: { friends: Friend[] }) {
  return (
    <div className="flex-col">
      {!friends.length ? (
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
