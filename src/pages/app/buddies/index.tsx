import { SearchBar } from '@/features/search';
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
      <div className="mt-2 flex items-center">
        <SearchBar targetType="users" />
        <h2 className="fixed left-2/5 text-xl text-gray-600">Buddies</h2>
      </div>

      <SnapSections sections={sections} />
    </main>
  );
}
