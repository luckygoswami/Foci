import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthProvider';

function Home() {
  const { logout } = useAuth();

  return (
    <>
      <h1>Welcome to Foci..</h1>
      <Button
        variant={'destructive'}
        onClick={logout}>
        Logout
      </Button>
    </>
  );
}

export default Home;
