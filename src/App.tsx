import { useLocation, useRoutes } from 'react-router-dom';
import { Suspense, useMemo } from 'react';
import routes from '~react-pages';
import { wrapWithAuthGuard } from '@/lib/withAuthGuard';
import LoadingScreen from '@/components/LoadingScreen';
import { ToastContainer } from 'react-toastify';

function App() {
  const location = useLocation();
  const guardedRoutes = useMemo(() => wrapWithAuthGuard(routes), [routes]);

  const fallback = location.pathname.startsWith('/app') ? null : (
    <LoadingScreen />
  );

  return (
    <Suspense fallback={fallback}>
      {useRoutes(guardedRoutes)}
      <ToastContainer />
    </Suspense>
  );
}

export default App;
