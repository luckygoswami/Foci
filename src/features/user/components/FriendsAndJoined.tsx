import { getMonthYear } from '@/lib/utils';
import type { UserData } from '@/types';

export function FriendsAndJoined({ userData }: { userData: UserData }) {
  const { friends, createdAt } = userData;

  return (
    <div className="friends-joined grid grid-cols-2 gap-2 borde border-blue-500">
      <div className="shadow bg-white rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Friends</h3>
        <div className="flex -space-x-2">
          {!friends.length ? (
            <div>no friends...</div>
          ) : (
            friends.map((friend, i) => (
              <img
                key={i}
                src={`/assets/avatars/${friend.avatarId}.svg`}
                alt="Friend Avatar"
                className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"
              />
            ))
          )}
        </div>
      </div>
      <div className="shadow bg-white rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Joined</h3>
        <p className="text-gray-700">{getMonthYear(createdAt)}</p>
      </div>
    </div>
  );
}
