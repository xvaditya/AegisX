import { useContext } from 'react';
import { AegisSystemContext } from './aegisSystemContextValue';

export function useAegisSystemContext() {
  const value = useContext(AegisSystemContext);
  if (!value) throw new Error('useAegisSystemContext must be used inside AegisSystemProvider');
  return value;
}
