import { Header } from '@/components';
import { PersonalInformation, TargetGoals } from '@/features/settings';
import { useUserData } from '@/features/user';

export default function SettingsPage() {
  const { userData } = useUserData();
  const {
    name,
    username,
    email,
    bio,
    dailyTargetMinutes,
    weeklyTargetMinutes,
  } = userData!; // No chance of reaching here without userData

  return (
    <div
      role="region"
      aria-label="Settings">
      <Header title="Account" />

      <div className="p-5 space-y-5">
        <PersonalInformation
          name={name}
          username={username}
          email={email}
          bio={bio}
        />

        <TargetGoals
          dailyTargetMinutes={dailyTargetMinutes}
          weeklyTargetMinutes={weeklyTargetMinutes}
        />
      </div>
    </div>
  );
}
