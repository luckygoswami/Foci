import { AuthForm } from '@/features/auth/components';
import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
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
