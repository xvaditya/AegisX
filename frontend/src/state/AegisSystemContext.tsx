import type { ReactNode } from 'react';
import { useAegisSystem } from '../hooks/useAegisSystem';
import { AegisSystemContext } from './aegisSystemContextValue';

export function AegisSystemProvider({ children }: { children: ReactNode }) {
  const value = useAegisSystem();
  return <AegisSystemContext.Provider value={value}>{children}</AegisSystemContext.Provider>;
}
