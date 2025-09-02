import { Header, SnapSections } from '@/components';
import { useAuth } from '@/features/auth';
import {
  BuddiesList,
  fetchRequestsByRecipient,
  RequestsList,
} from '@/features/buddies';
import { useUserData } from '@/features/user';
import type { FriendRequest, FirebaseUserId } from '@/types';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function BuddiesDashboard() {
  const userId = useAuth().user?.uid as FirebaseUserId;
  const { userData } = useUserData();
  const requestListRef = useRef<HTMLOListElement | null>(null);
  const [requests, setRequests] = useState<FriendRequest[] | null>(null);

  useEffect(() => {
    const section = requestListRef.current;
    let observer: IntersectionObserver;

    if (section && requests === null) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchRequestsByRecipient(userId)
              .then(setRequests)
              .catch((err) => toast.error(err.message));
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
    <div
      role="region"
      aria-label="Buddies Dashboard"
      className="flex flex-col">
      <Header title="Buddies" />
      <SnapSections
        sections={sections}
        includeSearch="users"
      />
    </div>
  );
}
