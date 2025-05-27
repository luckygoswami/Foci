import Timer from '@/components/Timer';
import { UserCircle2 } from 'lucide-react';

function BuddyCard({ autostart }: { autostart?: boolean }) {
  return (
    <div className="border border-black rounded-md size-25 flex flex-col justify-evenly items-center">
      <UserCircle2 />
      John Doe
      <Timer
        size="small"
        autoStart={autostart}
      />
    </div>
  );
}

export default BuddyCard;
