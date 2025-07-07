import type { CurrentSession } from '@/types';
import { createContext } from 'react';

type Ctx = {
  session: CurrentSession | null;
  setSession: (s: CurrentSession | null) => void;
  loading: boolean;
};

export const CurrentSessionContext = createContext<Ctx | undefined>(undefined);
