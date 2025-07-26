import { BuddyRequestCard } from './BuddyRequestCard';

const requests = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: '/avatars/alex.jpg',
    mutualFriends: 5,
    timestamp: '2 days ago',
  },
  {
    id: 2,
    name: 'Alex Johnson',
    avatar: '/avatars/alex.jpg',
    mutualFriends: 5,
    timestamp: '2 days ago',
  },
];

export function RequestsList() {
  return (
    <div className="grid grid-cols-1 gap-2 p-3">
      {requests.map((request) => (
        <BuddyRequestCard
          key={request.id}
          {...request}
          onAccept={() => console.log('[request accepted]')}
          onReject={() => console.log('[request rejected]')}
        />
      ))}
    </div>
  );
}
