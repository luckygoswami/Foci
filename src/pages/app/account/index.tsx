import { useAuth } from '@/features/auth';
import {
  FriendsAndJoined,
  ProfileHeader,
  StudyStats,
  SubjectsAndStreak,
  useUserData,
} from '@/features/user';

function AccountDashboard() {
  const { userData } = useUserData();
  const { logout } = useAuth();

  return (
    <main className="bg-gray-100 grid  grid-rows-[2fr_1fr_1.2fr_1fr_0.6fr] gap-2 px-4 py-2">
      {!userData ? (
        // TODO: add loading skeleton
        <div>Loading...</div>
      ) : (
        <>
          <ProfileHeader userData={userData} />
          <SubjectsAndStreak userData={userData} />
          <StudyStats userData={userData} />
          <FriendsAndJoined userData={userData} />

          <button
            className="flex-1 py-2 rounded-xl bg-red-200 text-red-700 font-semibold text-xl flex items-center justify-center gap-2 hover:bg-red-300 transition-colors"
            // TODO: add confirmation dialog
            onClick={logout}>
            Logout
          </button>
        </>
      )}
    </main>
  );
}

export default AccountDashboard;
