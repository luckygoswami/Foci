import { SnapSections } from '@/components';
import { useAuth } from '@/features/auth';
import {
  CreateGroupBottomSheet,
  fetchGroupInvitesByRecipient,
  fetchGroupsJoinedByUser,
  GroupsList,
  InvitesList,
} from '@/features/groups';
import { SearchBar } from '@/features/search';
import { useUserData } from '@/features/user';
import type { FirebaseUserId, Group, GroupId, GroupInvite } from '@/types';
import { PlusIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function GroupsDashboard() {
  const userId = useAuth().user?.uid as FirebaseUserId;
  const [showSheet, setShowSheet] = useState(false);
  const { userData } = useUserData();
  const [groups, setGroups] = useState<(Group & { groupId: GroupId })[] | null>(
    null
  );
  const [invites, setInvites] = useState<GroupInvite[] | null>(null);
  const inviteListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userData) return;
    fetchGroupsJoinedByUser(userId).then(setGroups);
  }, [userData]);

  useEffect(() => {
    const section = inviteListRef.current;
    let observer: IntersectionObserver;

    if (section && invites === null) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchGroupInvitesByRecipient(userId).then(setInvites);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(section);
    }

    return () => observer && observer.disconnect();
  }, [invites]);

  const handleCreation = (newGroup: Group & { groupId: GroupId }) => {
    setGroups((prev) => {
      if (!prev) return null;
      return [...prev, { ...newGroup }];
    });
    setShowSheet(false);
  };

  const sections = [
    {
      title: 'joined',
      component: GroupsList,
      props: { groups },
    },
    {
      title: 'invites',
      component: InvitesList,
      props: { invites, setInvites, inviteListRef },
    },
  ];

  return (
    <div
      role="region"
      aria-label="Groups Dashboard"
      className="flex flex-col px-2 gap-3">
      <div className="mt-2 flex items-center">
        <SearchBar targetType="groups" />
        <h2 className="fixed left-2/5 text-xl text-gray-600">Groups</h2>
      </div>

      <SnapSections sections={sections} />

      <button className="fixed bottom-20 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-3">
        <PlusIcon
          className="size-6"
          onClick={() => setShowSheet(true)}
        />
      </button>
      <CreateGroupBottomSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        onCreation={handleCreation}
      />
    </div>
  );
}
