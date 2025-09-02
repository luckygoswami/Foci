import { timeAgo } from '@/lib/utils';
import type { FriendRequest } from '@/types';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RequestCard({
  friendRequest,
  onAccept,
  onReject,
}: {
  friendRequest: FriendRequest;
  onAccept: (req: FriendRequest) => void;
  onReject: (req: FriendRequest) => void;
}) {
  const { senderId, senderName, senderAvatarId, createdAt } = friendRequest;
  const navigate = useNavigate();

  return (
    <li
      className="flex items-center gap-4 rounded-xl px-5 py-3 bg-card border border-muted-foreground/10 shadow-xs hover:shadow-md transition-shadow"
      onClick={() => navigate(`${senderId}`)}>
      {/* Avatar */}
      <img
        src={`/assets/avatars/${senderAvatarId}.svg`}
        alt={senderName}
        className="size-20 rounded-full object-cover border-2 border-blue-100 p-1 pb-0"
      />

      {/* Meta */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-medium truncate">{senderName}</h3>
        <p className="text-xs text-muted-foreground/70">{timeAgo(createdAt)}</p>

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept(friendRequest);
            }}
            className="flex-1 flex items-center justify-center gap-1 bg-primary/90 hover:bg-[#2b6cb0] text-primary-foreground py-2 px-3 rounded-lg text-xs transition-colors">
            <Check className="size-4" />
            Accept
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject(friendRequest);
            }}
            className="flex-1 flex items-center justify-center gap-1 bg-muted text-muted-foreground hover:bg-gray-300 py-2 px-3 rounded-lg text-xs transition-colors">
            <X className="size-4" />
            Decline
          </button>
        </div>
      </div>
    </li>
  );
}
