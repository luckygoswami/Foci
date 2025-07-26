import type { TagInputProps } from '../types';

function TagInput({ value, onChange }: TagInputProps) {
  const [tags, setTags] = [value, onChange];

  return (
    <label className="text-sm font-medium">
      Tags
      <input
        type="text"
        value={tags}
        maxLength={100}
        onChange={(e) => setTags(e.target.value)}
        className="block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-800 text-base focus:outline-primary"
        placeholder="e.g. dsa, morning"
      />
      <span className="text-xs text-gray-400">Comma separated</span>
    </label>
  );
}

export default TagInput;
