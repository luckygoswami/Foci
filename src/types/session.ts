export interface StudySession {
  id: string;
  userId: string;
  groupId: string;
  startedAt: number;
  endedAt?: number;
  durationSeconds?: number;
}
