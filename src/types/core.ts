export type FirebaseUserId = string;
export type GroupId = string;

export interface Streak {
  current: number;
  longest: number;
  lastActivityDate: number;
}

export interface Subject {
  name: string;
  subjectId: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}
