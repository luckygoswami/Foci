import { avatarList } from '@/constants/avatars';
import type { OnboardingState } from '../types';
import { shuffle } from '@/lib/utils';

export default function AvatarSelector({
  form,
  setForm,
}: {
  form: OnboardingState;
  setForm: React.Dispatch<React.SetStateAction<OnboardingState>>;
}) {
  const shuffledAvatarList = shuffle(avatarList);
  form.avatarId = shuffledAvatarList[0];

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
        {shuffledAvatarList.map((avatar, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChange(avatar)}
            className={`rounded-lg border-2 p-1 transition ${
              form.avatarId === avatar
                ? 'border-blue-500 ring-2 ring-blue-300'
                : 'border-gray-200 hover:border-gray-400'
            }`}>
            <img
              src={avatar}
              alt={`Avatar ${idx + 1}`}
              className="h-16 w-16 rounded object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
