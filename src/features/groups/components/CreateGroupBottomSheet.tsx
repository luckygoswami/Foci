import React, { useEffect, useState, type FormEvent, useMemo } from 'react';
import GroupAvatarPicker, { GROUP_AVATAR_OPTIONS } from './GroupAvatarPicker';
import { shuffle } from '@/lib/utils';

interface CreateGroupBottomSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (group: {
    name: string;
    description: string;
    isPublic: boolean;
    tags?: string[];
  }) => void;
}

export const CreateGroupBottomSheet: React.FC<CreateGroupBottomSheetProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const randomizedAvatarOptions = useMemo(
    () => shuffle(GROUP_AVATAR_OPTIONS),
    []
  );
  const [avatarOptions] = useState(randomizedAvatarOptions);
  const [avatarId, setAvatarId] = useState(randomizedAvatarOptions[0].id);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSheetClick = (e: React.MouseEvent) => {
    // Prevent bubbling so clicks inside don't close
    e.stopPropagation();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Group name is required.');
      return;
    }
    setError(null);
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      isPublic,
      tags: tags
        ? tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    });
    // Optionally reset fields here, or handle in parent
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex justify-center items-end"
      onClick={onClose}
      aria-modal="true"
      role="dialog">
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl p-5 pb-7 shadow-xl animate-[slideup_200ms_ease]"
        onClick={handleSheetClick}>
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Title and Close */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Create Group</h2>
          <button
            aria-label="Close"
            className="text-2xl p-1 text-gray-400 hover:text-gray-600"
            onClick={onClose}
            type="button">
            x
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3">
          <GroupAvatarPicker
            value={avatarId}
            onChange={setAvatarId}
            options={avatarOptions}
          />
          <label className="text-sm font-medium">
            Group Name<span className="text-primary">*</span>
            <input
              type="text"
              value={name}
              required
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              className="block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-800 text-base focus:outline-primary"
              placeholder="Enter group name"
              autoFocus
            />
          </label>
          <label className="text-sm font-medium">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-800 text-base resize-none focus:outline-primary"
              placeholder="Description (optional)"
              rows={2}
              maxLength={120}
            />
          </label>
          <label className="text-sm font-medium">
            Tags
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-800 text-base focus:outline-primary"
              placeholder="e.g. dsa, morning"
            />
            <span className="text-xs text-gray-400">Comma separated</span>
          </label>
          <div className="flex items-center gap-2 mt-2">
            <label className="block text-base font-semibold mb-2">
              Privacy
            </label>
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
          {
            // TODO: show toast message for this error
            error && <div className="text-sm text-red-600">{error}</div>
          }
          <button
            type="submit"
            className="mt-5 bg-primary rounded-md py-2 text-white font-bold text-base active:scale-95 transition">
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupBottomSheet;
