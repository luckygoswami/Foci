import type { Group, UserData } from '@/types';

export interface IUserResult extends UserData {
  id: string;
}

export interface IGroupResult extends Group {
  id: string;
}

export type SearchTypes = 'users' | 'groups';

export type ResultsForType<T extends SearchTypes> = T extends 'users'
  ? IUserResult[] | null
  : IGroupResult[] | null;
