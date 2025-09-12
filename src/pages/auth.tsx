import { AuthForm, useAuth } from '@/features/auth';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AuthDashboard() {
  const { user, loading: authLoading } = useAuth();
  const redirectTo = useLocation().state?.from?.pathname || '/';
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || user) {
    return null;
  }

  return <AuthForm />;
}
