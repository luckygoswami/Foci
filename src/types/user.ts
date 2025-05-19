export interface User {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  groups: string[];
  currentGroupId?: string;
  totalStudySeconds: number;
  weeklyStudySeconds: Record<string, number>;
  isStudying: boolean;
  currentSessionStartedAt?: number;
}
