import type { PrivacySelectorProps } from '../types';

function PrivacySelector({ value, onChange }: PrivacySelectorProps) {
  const [isPublic, setIsPublic] = [value, onChange];

  return (
    <div className="flex items-center gap-2 mt-2">
      <label className="block text-base font-semibold mb-2">Privacy</label>
      <div className="bg-gray-100 rounded-xl flex w-fit overflow-hidden">
        <button
          type="button"
          className={`px-5 py-1 font-medium text-sm focus:outline-none transition ${
            isPublic ? 'bg-white shadow text-black' : 'text-gray-400'
          }`}
          onClick={() => setIsPublic(true)}>
          Public
        </button>
        <button
          type="button"
          className={`px-5 py-1 font-medium text-sm focus:outline-none transition ${
            !isPublic ? 'bg-white shadow text-black' : 'text-gray-400'
          }`}
          onClick={() => setIsPublic(false)}>
          Private
        </button>
      </div>
    </div>
  );
}

export default PrivacySelector;
