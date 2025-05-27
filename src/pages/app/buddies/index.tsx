import { useRef, useState } from 'react';
import SearchBox from '@/components/SearchBox';
import BuddyCard from './BuddyCard';
import ProfileCard from './ProfileCard';

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

export default function BuddiesDashboard() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0); // 0 for Buddies, 1 for Requests

  const scrollToSection = (sectionIndex: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sectionWidth = container.offsetWidth;
    container.scrollTo({
      left: sectionWidth * sectionIndex,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollPosition = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const newActiveTab = Math.round(scrollPosition / containerWidth);

    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);
    }
  };

  return (
    <main className="flex flex-col px-2 gap-3">
      <div className="mt-2">
        <SearchBox type="buddy" />
      </div>

      <div className="flex-[1] flex flex-col border-x border-t rounded-tr-2xl rounded-tl-2xl px-2 border-black overflow-hidden">
        {/* Navigation Tabs with Active State */}
        <div className="flex border-b">
          <button
            onClick={() => scrollToSection(0)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 0
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}>
            Buddies
          </button>
          <button
            onClick={() => scrollToSection(1)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 1
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}>
            Requests
          </button>
        </div>

        {/* Scrollable Sections */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto snap-x snap-mandatory overflow-y-hidden scroll-smooth scrollbar-hide flex-[1]">
          {/* Buddies Section */}
          <div className="flex-shrink-0 w-full snap-center overflow-y-auto">
            <div className="grid grid-cols-3 gap-3 p-2">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-center items-center">
                  <BuddyCard />
                </div>
              ))}
            </div>
          </div>

          {/* Requests Section */}
          <div className="flex-shrink-0 w-full snap-center overflow-y-auto">
            <div className="grid grid-cols-1 gap-2 p-3">
              {requests.map((request) => (
                <ProfileCard
                  key={request.id}
                  {...request}
                  onAccept={() => console.log('[request accepted]')}
                  onReject={() => console.log('[request rejected]')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
