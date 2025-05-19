export interface UserStatus {
  state: 'studying' | 'online' | 'offline';
  startedAt: number | null;
  lastChanged: number;
}
