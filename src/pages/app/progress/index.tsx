import { Streakboard } from '@/features/streaks';
import { SubjectProgressChart } from '@/features/charts';
import { useUserData } from '@/features/user';
import type { FirebaseUserId } from '@/types';

export default function ProgressDashboard() {
  const { userData } = useUserData();
  const userId = userData?.userId as FirebaseUserId;
  const subjects = userData?.subjects;

  // TODO: add loading skeleton
  if (!userData) return <div>Loading...</div>;

  return (
    <div
      role="region"
      aria-label="Progress Dashboard"
      className="flex flex-col p-5 gap-5">
      <Streakboard userData={userData} />

      <div className="flex-[1.5] p-2 border-x border-t border-black rounded-tr-4xl rounded-tl-4xl">
        <div className="flex space-x-4 overflow-x-auto pb-2 snap-x snap-mandatory w-full h-full">
          {subjects?.map((sub, ind) => (
            <div
              key={`sub${ind}`}
              className="flex-shrink-0 w-full sm:w-[400px] h-full snap-center">
              <SubjectProgressChart
                userId={userId}
                subject={sub}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
