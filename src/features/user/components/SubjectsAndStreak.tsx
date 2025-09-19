import { StreakFire } from '@/assets/icons';
import { isStreakBroken } from '@/features/streaks';
import type { UserData } from '@/types';

export function SubjectsAndStreak({ userData }: { userData: UserData }) {
  const { subjects, streak } = userData;
  const isBroken = isStreakBroken(streak);

  return (
    <div className="subjects-streak grid grid-cols-[2fr_1fr] gap-2">
      <div className="subjects bg-white shadow rounded-2xl p-4 overflow-hidden">
        <h3 className="font-semibold mb-2">Subjects</h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {subjects
            .filter((s) => s.isActive)
            .map((sub, idx) => (
              <span
                key={`${sub.subjectId}-${idx}`}
                className="bg-gray-100 text-sm px-3 py-1 rounded-full text-gray-700 text-nowrap">
                {sub.name}
              </span>
            ))}
        </div>
      </div>
      <div className="streak bg-white shadow rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Streak</h3>
        <p
          className={`text-3xl font-bold ${
            !isBroken ? 'text-gray-800' : 'text-gray-400'
          } flex items-baseline`}>
          {streak.current}
          <StreakFire
            variant={`${isBroken ? 'muted' : 'color'}`}
            className="ml-1 size-6.5"
          />
        </p>
      </div>
    </div>
  );
}
