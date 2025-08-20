import { type JSX } from 'react';
import BottomNav from '../BottomNav';

function AppLayout({ children }: { children: JSX.Element }) {
  return (
    <>
      <main>{children}</main>
      <BottomNav />
    </>
  );
}

export default AppLayout;
