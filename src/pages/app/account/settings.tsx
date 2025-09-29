import { Header } from '@/components';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import {
  PersonalInformation,
  Subjects,
  TargetGoals,
} from '@/features/settings';
import { useConfirm } from '@/providers/ConfirmationContext';

export default function SettingsPage() {
  const { logout } = useAuth();
  const confirm = useConfirm();

  function handleLogout() {
    confirm(logout, {
      message: 'Do you really want to logout?',
      variant: 'destructive',
    });
  }

  return (
    <div
      role="region"
      aria-label="Settings"
      className="flex flex-col">
      <Header title="Account" />

      <div className="p-5 space-y-5 overflow-scroll">
        <PersonalInformation />
        <TargetGoals />
        <Subjects />
        <Button
          variant="destructive"
          className="w-full h-10"
          onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
