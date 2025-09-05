import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CurrentSession } from '@/types';
import { XCircle, HardDrive, Cloud } from 'lucide-react';
import { formatDuration, formatTimestamp } from '@/lib/utils';

type SessionChoice = 'local' | 'remote' | 'end';
interface Props {
  local: CurrentSession;
  remote: CurrentSession;
  open: boolean;
  onChoose: (choice: SessionChoice) => void;
}

export default function SessionConflictDialog({
  local,
  remote,
  open,
  onChoose,
}: Props) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="flex flex-col"
        showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Unsynced session detected</DialogTitle>
          <DialogDescription>
            We found <strong>two incomplete sessions</strong> for your account.
            Choose which one would you like to continue or end both.
          </DialogDescription>
          <DialogClose
            asChild
            onClick={() => onChoose('end')}
          />
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex flex-col gap-3">
            <SessionCard
              label="this-device"
              session={local}
              icon={<HardDrive className="size-5" />}
            />
            <SessionCard
              label="other-device"
              session={remote}
              icon={<Cloud className="size-5" />}
            />
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2">
          <Button
            className="col-span-2 md:col-span-1 bg-destructive hover:bg-destructive-hover"
            onClick={() => onChoose('remote')}>
            <Cloud className="size-5" />
            Continue {remote.subject} session
          </Button>
          <Button
            className="col-span-2 md:col-span-1 bg-primary hover:bg-primary-hover"
            onClick={() => onChoose('local')}>
            <HardDrive className="size-5" />
            Continue {local.subject} session
          </Button>
          <Button
            className="col-span-2 bg-card hover:bg-card-hover"
            variant="outline"
            onClick={() => onChoose('end')}>
            <XCircle className="size-5" />
            End both sessions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ----- tiny sub‑component ----- */
function SessionCard({
  label,
  session,
  icon,
}: {
  label: 'this-device' | 'other-device';
  session: CurrentSession;
  icon: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl p-3 flex items-center gap-3 bg-white">
      {icon}
      <div className="flex flex-col">
        <span className="font-medium">{`${session.subject} (${label})`}</span>
        <span className="text-xs text-muted-foreground">
          Duration &middot; {formatDuration(session.accumulatedDuration)}
          {!session.paused && <> &middot; running</>}
        </span>
        <span className="text-xs text-muted-foreground">
          Updated &middot; {formatTimestamp(session.lastUpdated)}
        </span>
      </div>
    </div>
  );
}
