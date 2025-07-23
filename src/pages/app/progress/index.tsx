import { Streakboard } from '@/features/streaks';
import { SubjectProgressChart } from '@/features/charts';
import { useUserData } from '@/features/user';
import type { FirebaseUserId } from '@/types';

function ProgressDashboard() {
  const { userData } = useUserData();
  const userId = userData?.userId as FirebaseUserId;
  const subjects = userData?.subjects;

  // TODO: show loading skeleton here
  if (!userData) return <div>Loading...</div>;

  return (
    <main className="flex flex-col px-2 gap-5">
      <div className="flex-[1] flex flex-col justify-between p-2 border-x border-b border-black rounded-br-4xl rounded-bl-4xl">
        <Streakboard userData={userData} />
      </div>

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
    </main>
  );
}

export default ProgressDashboard;
