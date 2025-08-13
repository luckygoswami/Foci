import type { Friend } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function BuddyCard({ friend }: { friend: Friend }) {
  const navigate = useNavigate();
  const { userId, avatarId, name } = friend;

  return (
    <div
      className="p-3 flex items-center gap-3 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      onClick={() => navigate(`${userId}`)}>
      <img
        src={`/assets/avatars/${avatarId}.svg`}
        alt={name}
        className="size-12 rounded-full object-cover border-2 border-blue-100"
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="font-medium truncate text-base">{name}</div>
        <span className="text-sm text-gray-400">00:00:00</span>
      </div>
    </div>
  );
}
