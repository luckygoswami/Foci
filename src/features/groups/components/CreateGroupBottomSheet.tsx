import React, { useEffect, useState, type FormEvent } from 'react';
import GroupAvatarPicker from './GroupAvatarPicker';
import { generateRandomCode } from '@/lib/utils';
import type { Group } from '@/types';
import { X } from 'lucide-react';
import { useUserData } from '@/features/user';
import type { CreateGroupBottomSheetProps } from '../types';
import { createGroup } from '../services/groups';
import PrivacySelector from './PrivacySelector';
import TagInput from './TagInput';

export const CreateGroupBottomSheet: React.FC<CreateGroupBottomSheetProps> = ({
  open,
  onClose,
  onCreation,
}) => {
  const { userData } = useUserData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState<string | undefined>(undefined);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open || !userData) return null;
  const { userId, avatarId: userAvatar, name: userName } = userData;

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

    const now = Date.now();
    const newGroupData: Group = {
      name: name.trim(),
      // @ts-ignore
      avatarId,
      ...(description.trim() && { description: description.trim() }),
      isPublic,
      ...(tags &&
        tags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean).length > 0 && {
          tags: tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      creatorId: userId,
      members: [
        {
          userId,
          avatarId: userAvatar!,
          name: userName,
          role: 'creator',
          joinedAt: now,
        },
      ],
      memberIds: [userId],
      joinCode: generateRandomCode(),
      createdAt: now,
      updatedAt: now,
    };

    createGroup(newGroupData)
      .then((groupId) => {
        if (groupId) {
          onCreation({ ...newGroupData, groupId });
        }
        // TODO: show a success notification here
      })
      .catch((err) => console.error('Create Group: ', err));

    setName('');
    setDescription('');
    setTags('');
    setError(null);
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
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3">
          <GroupAvatarPicker
            value={avatarId}
            onChange={setAvatarId}
          />

          <label className="text-sm font-medium">
            Group Name<span className="text-primary">*</span>
            <input
              type="text"
              value={name}
              required
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              className="block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 bg-white dark:bg-gray-800 text-base focus:outline-primary"
              placeholder="Enter group name"
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
              maxLength={85}
            />
          </label>

          <TagInput
            value={tags}
            onChange={setTags}
          />

          <PrivacySelector
            value={isPublic}
            onChange={setIsPublic}
          />
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
