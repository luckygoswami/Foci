import type { GroupMember } from '@/types';
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
  label: string;
}

export interface GroupAvatarPickerProps {
  value: string;
  onChange: (avatarId: string) => void;
  options: GroupAvatarOption[];
}
