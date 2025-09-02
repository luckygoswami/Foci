import type { GroupInvite } from '@/types';
import { useNavigate } from 'react-router-dom';
import { defaultAvatar, GROUP_AVATAR_OPTIONS } from '../groupAvatarOptions';
import { Check, X } from 'lucide-react';

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
  const { icon: Avatar, color, background } = avatar;
  const navigate = useNavigate();

  return (
    <li
      className="flex items-center gap-4 rounded-xl px-5 py-3 bg-card border border-muted-foreground/10 shadow-xs hover:shadow-md transition-shadow"
      onClick={() => navigate(`${invite.groupId}`)}>
      {/* Avatar */}
      <div
        className={`size-20 rounded-lg ${background} flex items-center justify-center`}>
        <Avatar className={`size-10 ${color}`} />
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-medium truncate">{name}</h3>
        <p className="text-xs font-medium text-muted-foreground">
          <span className="opacity-70 font-normal">from </span>
          {senderName}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept(invite);
            }}
            className="flex-1 flex items-center justify-center gap-1 bg-primary/90 hover:bg-[#2b6cb0] text-primary-foreground py-2 px-3 rounded-lg text-xs transition-colors">
            <Check className="size-4" />
            Accept
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject(invite);
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
