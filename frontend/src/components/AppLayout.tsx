import type { ReactNode } from 'react';
import { AegisAvatar } from './AegisAvatar';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import type { MascotState } from '../types';

interface AppLayoutProps {
  title: string;
  status: string;
  mascotState: MascotState;
  query: string;
  onQueryChange: (value: string) => void;
  children: ReactNode;
}

export function AppLayout({ title, status, mascotState, query, onQueryChange, children }: AppLayoutProps) {
  return (
    <div className="aegis-app">
      <div className="scanline-overlay" />
      <Sidebar />
      <div className="aegis-main">
        <Navbar title={title} status={status} mascotState={mascotState} query={query} onQueryChange={onQueryChange} />
        <main>{children}</main>
      </div>
      <AegisAvatar state={mascotState} />
    </div>
  );
}
