import type { Group, GroupId, GroupMember } from '@/types';
import type { LucideIcon } from 'lucide-react';

export interface GroupMemberRoles {
  creator: GroupMember;
  admins: GroupMember[];
  members: GroupMember[];
}

export interface GroupAvatarOption {
  id: string;
  icon: LucideIcon;
  color: string;
  background: string;
  label: string;
}

export interface GroupAvatarPickerProps {
  value: string | undefined;
  onChange: (avatarId: string) => void;
}

export interface CreateGroupBottomSheetProps {
  open: boolean;
  onClose: () => void;
  onCreation: (group: Group & { groupId: GroupId }) => void;
}

export interface PrivacySelectorProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

export interface TagInputProps {
  value: string;
  onChange: (v: string) => void;
}
