import { createContext } from 'react';
import type { useAegisSystem } from '../hooks/useAegisSystem';

type AegisSystemContextValue = ReturnType<typeof useAegisSystem>;

export const AegisSystemContext = createContext<AegisSystemContextValue | null>(null);
