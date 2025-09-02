import type { Friend } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function BuddyCard({ friend }: { friend: Friend }) {
  const navigate = useNavigate();
  const { userId, avatarId, name } = friend;

  return (
    <li
      className="flex items-center gap-4 rounded-xl px-5 py-4 bg-card border border-muted-foreground/10 shadow-xs hover:shadow-md transition-shadow"
      onClick={() => navigate(`${userId}`)}>
      {/* Avatar */}
      <img
        src={`/assets/avatars/${avatarId}.svg`}
        alt={name}
        className="size-13 rounded-full object-cover border-2 border-primary/20 p-0.5 pb-0"
      />

      {/* Meta */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-semibold text-foreground truncate text-lg">
          {name}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          00:00:00
        </span>
      </div>
    </li>
  );
}
