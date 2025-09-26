import { useLocation, useRoutes } from 'react-router-dom';
import { Suspense, useEffect, useMemo } from 'react';
// @ts-ignore
import routes from '~react-pages';
import { wrapWithAuthGuard } from '@/lib/withAuthGuard';
import { InstallPrompt, LoadingScreen } from '@/components';
import { Toaster } from 'react-hot-toast';
import { envConfig } from '@/constants/envConfig';

function App() {
  useEffect(() => {
    if (envConfig.disablePinchZoom) {
      const meta = document.querySelector<HTMLMetaElement>(
        'meta[name=viewport]'
      );
      const content = meta?.getAttribute('content') || '';
      if (!/user-scalable=no/.test(content)) {
        meta?.setAttribute(
          'content',
          content + ', maximum-scale=1.0, user-scalable=no'
        );
      }
    }

    if (envConfig.disablePullToRefresh) {
      document.documentElement.style.overscrollBehavior = 'none';
    }
  }, []);

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
