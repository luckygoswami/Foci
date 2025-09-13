import type { UserData } from '@/types';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfileHeader({
  userData,
  personal = false,
}: {
  userData: UserData;
  personal?: boolean;
}) {
  const { avatarId, username, name, bio } = userData;
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-card shadow p-6 text-center relative">
      {personal && (
        <button
          className="absolute top-0 right-0 m-4 text-muted-foreground"
          onClick={() => navigate('settings')}>
          <Settings size={26} />
        </button>
      )}
      <img
        src={`/avatars/${avatarId}.svg`}
        alt={`${name}-Avatar`}
        className="size-40 mx-auto rounded-full border mb-4 bg-gray-50 p-2 pb-0"
      />
      <h2 className="text-xl font-bold text-card-foreground">{username}</h2>
      <p className="text-secondary-foreground">{name}</p>
      <p className="text-muted-foreground/90 mt-2">{bio}</p>
    </div>
  );
}
