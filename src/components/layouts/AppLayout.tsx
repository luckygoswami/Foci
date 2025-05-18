import { type JSX } from 'react';
import BottomNav from '../BottomNav';

function AppLayout({ children }: { children: JSX.Element }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

export default AppLayout;
