import { UserDetailsPageSkeleton } from '@/components';
import { useAuth } from '@/features/auth';
import {
  FriendsAndJoined,
  ProfileHeader,
  StudyStats,
  SubjectsAndStreak,
  useUserData,
} from '@/features/user';
import { useConfirm } from '@/providers/ConfirmationContext';

export default function AccountDashboard() {
  const { userData } = useUserData();
  const { logout } = useAuth();
  const confirm = useConfirm();

  function handleLogout() {
    confirm(logout, {
      message: 'Do you really want to logout?',
      variant: 'destructive',
    });
  }

  return (
    <div
      role="region"
      aria-label="Account Dashboard"
      className="!bg-gray-100 grid grid-rows-[2fr_1fr_1.2fr_1fr_0.6fr] gap-2 px-4 py-2">
      {!userData ? (
        <UserDetailsPageSkeleton /> // No chance of reaching this point
      ) : (
        <>
          <ProfileHeader
            userData={userData}
            personal
          />
          <SubjectsAndStreak userData={userData} />
          <StudyStats userData={userData} />
          <FriendsAndJoined userData={userData} />

          <button
            className="flex-1 py-2 rounded-xl bg-red-200 text-red-700 font-semibold text-xl flex items-center justify-center gap-2 hover:bg-red-300 transition-colors"
            onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}
