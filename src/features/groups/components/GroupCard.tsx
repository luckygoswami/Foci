import type { Group, GroupId } from '@/types';
import { GROUP_AVATAR_OPTIONS } from './GroupAvatarPicker';
import { useNavigate } from 'react-router-dom';

export function GroupCard({
  groupId,
  groupData,
}: {
  groupId: GroupId;
  groupData: Group;
}) {
  const navigate = useNavigate();
  const { name, avatarId, isPublic, memberCount } = groupData;

  const { icon: Icon, color } = GROUP_AVATAR_OPTIONS.filter(
    (option) => option.id == avatarId
  )[0];

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
      onClick={() => navigate(`${groupId}`, { state: { groupData } })}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="font-medium truncate text-base">{name}</div>
          <div className="flex gap-2 items-center mt-1">
            <span className="text-xs text-gray-400">
              {memberCount} member{memberCount !== 1 ? 's' : ''}
            </span>
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs ${
                isPublic
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
              {isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>

        <button className="text-sm text-blue-600 hover:underline">Visit</button>
      </div>
    </div>
  );
}
