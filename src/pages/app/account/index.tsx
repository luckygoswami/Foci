import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthProvider';

function AccountDashboard() {
  const { user, logout } = useAuth();

  return (
    <main>
      <h1>Profile Dashboard</h1>
      <p>{user?.email}</p>
      <Button
        variant={'destructive'}
        onClick={logout}>
        Logout
      </Button>
    </main>
  );
}

export default AccountDashboard;
