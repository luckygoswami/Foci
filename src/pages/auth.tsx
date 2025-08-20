import { AuthForm } from '@/features/auth';
import { useAuth } from '@/features/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/app', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || user) {
    return null;
  }

  return <AuthForm />;
}
