import { getMonthYear } from '@/lib/utils';
import type { UserData } from '@/types';

export function FriendsAndJoined({ userData }: { userData: UserData }) {
  const { friends, createdAt } = userData;

  return (
    <div className="friends-joined grid grid-cols-2 gap-2">
      <div className="shadow bg-card rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Buddies</h3>
        <div className="flex -space-x-2">
          {!friends.length ? (
            <p>Yet to connect.</p>
          ) : (
            friends.map((friend, i) => (
              <img
                key={i}
                src={`/avatars/${friend.avatarId}.svg`}
                alt="Friend Avatar"
                className="size-8 rounded-full border-2 border-card bg-gray-300 p-0.25 pb-0"
              />
            ))
          )}
        </div>
      </div>
      <div className="shadow bg-card rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Joined</h3>
        <p className="text-gray-700">{getMonthYear(createdAt)}</p>
      </div>
    </div>
  );
}
