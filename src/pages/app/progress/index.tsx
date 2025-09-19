import { Streakboard } from '@/features/streaks';
import { SubjectProgressChart } from '@/features/charts';
import { useUserData } from '@/features/user';
import { Header } from '@/components';

export default function ProgressDashboard() {
  const { userData } = useUserData();
  const { userId, subjects } = userData!;

  return (
    <div
      role="region"
      aria-label="Progress Dashboard"
      className="flex flex-col">
      <Header title="Progress" />
      <div className="flex-1 flex flex-col p-5 gap-3">
        <Streakboard
          userData={userData}
          className="flex-[1] overflow-hidden"
        />

        {/* Subject Progress */}
        <div className="flex-[1.75] flex flex-col overflow-hidden rounded-lg p-4 shadow-md">
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Monthly Study Progress
          </h1>
          <div className="flex-1 flex space-x-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
            {subjects
              .filter((s) => s.isActive)
              .map((sub, ind) => (
                <div
                  key={`${sub.subjectId}-${ind}`}
                  className="flex-shrink-0 w-full snap-center">
                  <h2 className="text-lg font-medium text-muted-foreground mb-2">
                    {sub.name}
                  </h2>
                  <div className="h-[90%] w-full">
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
