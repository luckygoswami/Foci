import type { Group } from '@/types';
import { GROUP_AVATAR_OPTIONS } from './GroupAvatarPicker';
import { Lock, UsersRound } from 'lucide-react';
import type { GroupAvatarOption } from '../types';
import { formatMediumDate } from '@/lib/utils';

const defaultAvatar: GroupAvatarOption = {
  id: 'group',
  icon: UsersRound,
  color: 'blue-500',
  label: 'Group',
};

export function GroupDetails({ group }: { group: Group }) {
  const { name, avatarId, description, isPublic, tags, createdAt, memberIds } =
    group;

  const { icon: Avatar, color } =
    GROUP_AVATAR_OPTIONS.find((avatar) => avatar.id == avatarId) ||
    defaultAvatar;
  const memberCount = memberIds.length;

  return (
    <div className="group-details overflow-scroll flex flex-col items-center py-2">
      <div
        className={`min-w-35 min-h-35 border-8 border-gray-200 rounded-full flex items-center justify-center text-${color}`}>
        <Avatar size={100} />
      </div>
      <div className="header flex items-center justify-center mt-4 mb-1 gap-1">
        <h1 className="text-3xl font-black">{name}</h1>
        {!isPublic && (
          <span className="w-7 h-7 bg-blue-50 rounded-full flex justify-center items-center">
            <Lock size={20} />
          </span>
        )}
      </div>

      {description && (
        <p className="text-lg text-gray-800 text-center">{description}</p>
      )}

      {tags?.length && (
        <div>
          <div className="flex justify-center flex-wrap gap-1 w-full overflow-scroll h-auto max-h-16">
            {tags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="bg-blue-100 text-gray-900 font-medium text-sm rounded-xl px-4 py-1 whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Meta data */}
      <div className="text-[15px] text-gray-500 mt-2">
        {`${memberCount} ${memberCount > 1 ? 'members' : 'member'}`} &ndash;
        Created on {formatMediumDate(createdAt)}
      </div>
    </div>
  );
}
