import type { GroupInvite } from '@/types';
import { useNavigate } from 'react-router-dom';
import { defaultAvatar, GROUP_AVATAR_OPTIONS } from '../groupAvatarOptions';

export default function InviteCard({
  invite,
  onAccept,
  onReject,
}: {
  invite: GroupInvite;
  onAccept: (invite: GroupInvite) => void;
  onReject: (invite: GroupInvite) => void;
}) {
  const { groupName: name, senderName, groupAvatarId } = invite;
  const avatar =
    GROUP_AVATAR_OPTIONS.find((avatar) => avatar.id == groupAvatarId) ||
    defaultAvatar;
  const { icon: Avatar, color } = avatar;
  const navigate = useNavigate();

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
      onClick={() => navigate(`${invite.groupId}`)}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <Avatar className={`size-6 ${color}`} />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="font-medium truncate text-base">{name}</div>
          <div className="flex gap-2 items-center mt-1">
            <span className="text-xs text-gray-400">from {senderName}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 focus:outline-none transition"
            onClick={() => onAccept(invite)}>
            Accept
          </button>
          <button
            className="px-3 py-1 rounded bg-red-100 text-red-500 text-sm hover:bg-red-200 focus:outline-none transition"
            onClick={(e) => {
              e.stopPropagation();
              onReject(invite);
            }}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
