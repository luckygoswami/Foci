import { useAuth } from '@/features/auth/AuthProvider';

function AccountDashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Profile Dashboard</h1>
      <p>{user?.email}</p>
    </>
  );
}

export default AccountDashboard;
