import { useAuth } from '@/features/auth';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { IUserResult } from '../types';

export default function UserResult({ user }: { user: IUserResult }) {
  const userId = useAuth().user?.uid;
  const navigate = useNavigate();

  return (
    <motion.li
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="flex gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={
        userId != user.id
          ? () =>
              navigate(`${user.userId}`, {
                state: { selectedUser: user },
              })
          : () => navigate('/app/account')
      }>
      <img
        src={`/assets/avatars/${user.avatarId}.svg`}
        alt={`${user.name}_avatar`}
        className="size-10 rounded-full object-cover border-2 border-blue-100"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="font-medium truncate text-base">{user.name}</div>
        <span className="text-xs text-gray-400 leading-none">
          @{user.username}
        </span>
      </div>
    </motion.li>
  );
}
