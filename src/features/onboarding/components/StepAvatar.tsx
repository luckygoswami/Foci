import { avatarList } from '@/constants/avatars';
import type { OnboardingState } from '../types';
import { shuffle } from '@/lib/utils';
import { useEffect } from 'react';
const shuffledAvatars = shuffle([...avatarList]);

export function StepAvatar({
  form,
  setForm,
}: {
  form: OnboardingState;
  setForm: React.Dispatch<React.SetStateAction<OnboardingState>>;
}) {
  useEffect(() => {
    const avatarId = form.avatarId || shuffledAvatars[0];
    setForm((f) => ({ ...f, avatarId }));
  }, [avatarList]);

  function handleChange(avatarId: string) {
    setForm((f) => ({
      ...f,
      avatarId,
    }));
  }

  return (
    <div>
      <label
        htmlFor="subjects-input"
        className="font-medium">
        Select your avatar
      </label>
      <div className="grid grid-cols-4 gap-4 p-2 h-[400px] overflow-scroll border border-gray-200">
        {shuffledAvatars.map((avatarId, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChange(avatarId)}
            className={`rounded-lg border-2 p-1 transition ${
              form.avatarId === avatarId
                ? 'border-blue-500 ring-2 ring-blue-300'
                : 'border-gray-200 hover:border-gray-400'
            }`}>
            <img
              src={`/assets/avatars/${avatarId}.svg`}
              alt={`Avatar ${idx + 1}`}
              className="h-16 w-16 rounded object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
