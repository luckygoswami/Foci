import { User2 } from 'lucide-react';
import { useAuth } from '@/features/auth';

export function UserDetails() {
  const { user } = useAuth();

  return (
    <>
      <div className="border border-black p-2 flex gap-5 rounded-3xl">
        <span className="border border-black rounded-full">
          <User2 size={70} />
        </span>
        <div className="flex flex-col">
          <span className="text-xl font-bold">{user?.displayName}</span>
          <span className="text-sm">{user?.email}</span>
          <span className="text-sm">kinda nightowl!</span>
        </div>
      </div>
    </>
  );
}
