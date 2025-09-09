import { Header } from '@/components';
import {
  PersonalInformation,
  Subjects,
  TargetGoals,
} from '@/features/settings';

export default function SettingsPage() {
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
      </div>
    </div>
  );
}
