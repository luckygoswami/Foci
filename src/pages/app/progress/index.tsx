import { Streakboard } from '@/features/streaks';
import { SubjectProgressChart } from '@/features/charts';
import { useUserData } from '@/features/user';
import type { FirebaseUserId } from '@/types';
import { Header } from '@/components';

export default function ProgressDashboard() {
  const { userData } = useUserData();
  const userId = userData?.userId as FirebaseUserId;
  const subjects = userData?.subjects;

  return (
    <div
      role="region"
      aria-label="Progress Dashboard">
      <Header title="Progress" />
      <div className="flex flex-col p-5 gap-3">
        <Streakboard userData={userData} />

        <div className="rounded-lg px-4 pt-4 shadow-md">
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Monthly Study Progress
          </h1>
          <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory">
            {subjects?.map((sub, ind) => (
              <div
                key={`sub${ind}`}
                className="flex-shrink-0 w-full snap-center">
                <h2 className="text-lg font-medium text-muted-foreground mb-2">
                  {sub}
                </h2>
                <div className="h-80 w-full">
                  <SubjectProgressChart
                    userId={userId}
                    subject={sub}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
