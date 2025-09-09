import { useUserData } from '@/features/user';
import { SubjectsUpdateDialog } from './SubjectsUpdateDialog';
import { useState } from 'react';

export function Subjects() {
  const { userData, setUserData } = useUserData();
  const { userId, subjects } = userData!;
  const [dialogOpen, setdialogOpen] = useState(false);

  function handleSubjectsUpdate(newSubjects: string[]) {
    setUserData((prev) => {
      return {
        ...prev!,
        subjects: newSubjects,
      };
    });
  }

  return (
    <>
      <div className="bg-card rounded-md shadow-sm p-5">
        <div className="px-2 mb-4">
          <h1 className="font-semibold text-2xl">Subjects</h1>
          <p className="text-muted-foreground">Change your subjects</p>
        </div>

        <div
          className="flex justify-between"
          onClick={() => setdialogOpen(true)}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {subjects.map((sub, idx) => (
              <span
                key={`${sub}-${idx}`}
                className="bg-gray-100 text-sm px-3 py-1 rounded-full text-gray-700 text-nowrap">
                {sub}
              </span>
            ))}
          </div>
          <span className="text-2xl">&nbsp;&gt;</span>
        </div>
      </div>

      <SubjectsUpdateDialog
        isOpen={dialogOpen}
        onClose={() => setdialogOpen(false)}
        onSuccess={handleSubjectsUpdate}
        userId={userId}
        currentSubjects={subjects}
      />
    </>
  );
}
