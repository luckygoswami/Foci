import type { Group, GroupId } from '@/types';
import { useNavigate } from 'react-router-dom';
import { defaultAvatar, GROUP_AVATAR_OPTIONS } from '../groupAvatarOptions';

export default function GroupCard({
  groupId,
  groupData,
}: {
  groupId: GroupId;
  groupData: Group;
}) {
  const navigate = useNavigate();
  const { name, avatarId, isPublic, members } = groupData;
  const memberCount = members.length;

  const {
    icon: Avatar,
    color,
    background,
  } = GROUP_AVATAR_OPTIONS.find((avatar) => avatar.id == avatarId) ||
  defaultAvatar;

  return (
    <div
      className="flex items-center gap-4 rounded-xl px-5 py-4 bg-card border border-muted-foreground/10 shadow-xs hover:shadow-md transition-shadow"
      onClick={() => navigate(`${groupId}`, { state: { groupData } })}>
      {/* Avatar */}
      <div
        className={`group-avatar relative size-13 ${background} rounded-xl flex items-center justify-center`}>
        <Avatar className={`size-6 ${color}`} />
      </div>

      {/* Meta */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-semibold text-foreground truncate text-lg">
          {name}
        </span>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">
            {memberCount} member{memberCount > 1 ? 's' : ''}
          </span>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
              isPublic
                ? 'bg-[#d0fae4] text-[#067958]'
                : 'bg-[#fef3c6] text-[#b65309]'
            }`}>
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      <span className="text-2xl text-muted-foreground">&gt;</span>
    </div>
  );
}
