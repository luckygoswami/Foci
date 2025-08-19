import { motion } from 'framer-motion';
import type { IGroupResult } from '../types';
import { useNavigate } from 'react-router-dom';
import { defaultAvatar, GROUP_AVATAR_OPTIONS } from '@/features/groups';

export default function GroupResult({ group }: { group: IGroupResult }) {
  const navigate = useNavigate();
  const { icon: Avatar, color } =
    GROUP_AVATAR_OPTIONS.find((avatar) => avatar.id == group.avatarId) ||
    defaultAvatar;

  return (
    <motion.li
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="flex gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() =>
        navigate(`${group.id}`, {
          state: { groupData: group },
        })
      }>
      <div className="size-11 rounded-full bg-blue-100 flex items-center justify-center">
        <Avatar className={`size-7 ${color}`} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="font-medium truncate text-base">{group.name}</div>
        <span className="text-xs text-gray-400 leading-none">
          {group.memberIds.length} member{group.memberIds.length > 1 ? 's' : ''}
        </span>
      </div>
    </motion.li>
  );
}
