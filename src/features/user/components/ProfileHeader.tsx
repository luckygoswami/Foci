import type { UserData } from '@/types';

export function ProfileHeader({ userData }: { userData: UserData }) {
  const { avatarId, username, name, bio } = userData;

  return (
    <div className="rounded-2xl bg-white shadow p-6 text-center">
      <img
        src={`/assets/avatars/${avatarId}.svg`}
        alt="User Avatar"
        width={100}
        className="mx-auto rounded-full border mb-4 bg-gray-50"
      />
      <h2 className="text-xl font-bold">{username}</h2>
      <p className="text-gray-700">{name}</p>
      <p className="text-gray-500 mt-2">{bio}</p>
    </div>
  );
}
