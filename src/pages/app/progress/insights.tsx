import { Header, InsightsSkeleton } from '@/components';
import { useEffect, useState } from 'react';
import { useUserData } from '@/features/user';
import type { Session } from '@/types';
import toast from 'react-hot-toast';
import { formatDurationHM, getShortDate, getShortTime } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { getSessionsByUser, SessionUpdateDialog } from '@/features/sessions';

export default function Insights() {
  const { userData } = useUserData();
  const { userId } = userData!;
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [editSession, setEditSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSessionsByUser(userId);
        setSessions(data);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    fetch();
  }, [userId]);

  return (
    <div
      role="region"
      aria-label="Insights"
      className="flex flex-col">
      <Header title="Insights" />

      <div className="flex-1 p-5 overflow-hidden">
        <div className="max-h-full rounded-lg overflow-auto border">
          <table className="w-full">
            <thead className="w-full">
              <tr className="px-3 py-2 bg-[#f9f9fa]">
                <th
                  align="left"
                  className="px-3 py-2 text-[#565d6d]">
                  Subject
                </th>
                <th
                  align="left"
                  className="px3 py-2 text-[#565d6d]">
                  Duration
                </th>
                <th
                  colSpan={2}
                  className="px-3 py-2 text-[#565d6d]">
                  Time
                </th>
              </tr>
            </thead>
            {!sessions ? (
              <InsightsSkeleton />
            ) : (
              <tbody>
                {sessions.map((session, idx) => (
                  <tr key={idx}>
                    <td className="px-3 border-y">{session.subject}</td>
                    <td className="border-y">
                      <div className="flex items-center gap-1">
                        {formatDurationHM(
                          session.updatedDuration || session.duration
                        )}
                        <Pencil
                          onClick={() => setEditSession(session)}
                          size={14}
                          className="cursor-pointer"
                        />
                      </div>
                    </td>
                    <td
                      className="px-1 py-2 border-y"
                      align="right">
                      {getShortTime(session.startTime)}
                    </td>
                    <td className="px-1 py-2 border-y">
                      {getShortDate(session.startTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      <SessionUpdateDialog
        session={editSession}
        setSessions={setSessions}
        onClose={() => setEditSession(null)}
      />
    </div>
  );
}
