import { useLocation, useRoutes } from 'react-router-dom';
import { Suspense, useMemo } from 'react';
// @ts-ignore
import routes from '~react-pages';
import { wrapWithAuthGuard } from '@/lib/withAuthGuard';
import { InstallPrompt, LoadingScreen } from '@/components';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const guardedRoutes = useMemo(() => wrapWithAuthGuard(routes), [routes]);

  const fallback = location.pathname.startsWith('/app') ? null : (
    <LoadingScreen />
  );

  return (
    <Suspense fallback={fallback}>
      {useRoutes(guardedRoutes)}
      <Toaster reverseOrder={true} />
      <InstallPrompt />
    </Suspense>
  );
}

export default App;
