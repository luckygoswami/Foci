import { Check, X, Clock } from 'lucide-react';

interface BuddyRequestCardProps {
  name: string;
  avatar: string;
  mutualFriends: number;
  timestamp: string;
  onAccept(): void;
  onReject(): void;
}
const BuddyRequestCard: React.FC<BuddyRequestCardProps> = ({
  name,
  avatar,
  mutualFriends,
  timestamp,
  onAccept,
  onReject,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200 hover:shadow-md transition-shadow">
      {/* Profile Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
          />
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
            <Clock className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{name}</h3>
          <p className="text-sm text-gray-500 truncate">
            {mutualFriends} mutual friends
          </p>
          <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm transition-colors">
            <Check className="w-4 h-4" />
            Accept
          </button>
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm transition-colors">
            <X className="w-4 h-4" />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuddyRequestCard;
