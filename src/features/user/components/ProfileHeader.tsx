import type { UserData } from '@/types';

export function ProfileHeader({ userData }: { userData: UserData }) {
  const { avatarId, username, name, bio } = userData;

  return (
    <div className="rounded-2xl bg-card shadow p-6 text-center">
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
