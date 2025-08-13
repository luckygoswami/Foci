import SearchBox from '@/components/SearchBox';
import SnapSections from '@/components/SnapSections';
import { useAuth } from '@/features/auth';
import {
  BuddiesList,
  fetchRequestsByRecipient,
  RequestsList,
} from '@/features/buddies';
import { useUserData } from '@/features/user';
import type { FriendRequest, FirebaseUserId } from '@/types';
import { useEffect, useRef, useState } from 'react';

export default function BuddiesDashboard() {
  const userId = useAuth().user?.uid as FirebaseUserId;
  const { userData } = useUserData();
  const requestListRef = useRef<HTMLDivElement | null>(null);
  const [requests, setRequests] = useState<FriendRequest[] | null>(null);

  useEffect(() => {
    const section = requestListRef.current;
    let observer: IntersectionObserver;

    if (section && requests === null) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchRequestsByRecipient(userId).then(setRequests);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(section);
    }

    return () => observer && observer.disconnect();
  }, [requests]);

  const sections = [
    {
      title: 'buddies',
      component: BuddiesList,
      props: { friends: userData?.friends },
    },
    {
      title: 'requests',
      component: RequestsList,
      props: { requests, setRequests, requestListRef },
    },
  ];

  return (
    <main className="flex flex-col px-2 gap-3">
      <div className="mt-2">
        <SearchBox type="buddy" />
      </div>

      <SnapSections sections={sections} />
    </main>
  );
}
