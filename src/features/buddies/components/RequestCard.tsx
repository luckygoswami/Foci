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
    <div
      className="bg-white flex gap-3 rounded-lg shadow-sm p-2 border border-gray-200 hover:shadow-md transition-shadow"
      onClick={() => navigate(`${senderId}`)}>
      {/* Avatar */}
      <img
        src={`/assets/avatars/${senderAvatarId}.svg`}
        alt={senderName}
        className="size-20 rounded-full object-cover border-2 border-blue-100"
      />

      {/* Details */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-medium truncate">{senderName}</h3>
        <p className="text-xs text-gray-400 mb-0.5">{timeAgo(createdAt)}</p>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept(friendRequest);
            }}
            className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm transition-colors">
            <Check className="size-4" />
            Accept
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject(friendRequest);
            }}
            className="flex-1 flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm transition-colors">
            <X className="size-4" />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
