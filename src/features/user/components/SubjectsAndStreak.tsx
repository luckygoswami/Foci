import type { UserData } from '@/types';

export function SubjectsAndStreak({ userData }: { userData: UserData }) {
  const { subjects, streak } = userData;

  return (
    <div className="subjects-streak grid grid-cols-[2fr_1fr] gap-2 borde border-blue-500 ">
      <div className="subjects bg-white shadow rounded-2xl p-4 overflow-hidden">
        <h3 className="font-semibold mb-2">Subjects</h3>
        <div className="flex gap-2 overflow-scroll no-scrollbar">
          {subjects.map((subject) => (
            <span
              key={subject}
              className="bg-gray-100 text-sm px-3 py-1 rounded-full text-gray-700">
              {subject}
            </span>
          ))}
        </div>
      </div>
      <div className="streak bg-white shadow rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Streak</h3>
        <p className="text-2xl font-bold text-gray-800">{streak.current} 🔥</p>
      </div>
    </div>
  );
}
