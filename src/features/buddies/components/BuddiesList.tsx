import { BuddySessionCard } from './BuddySessionCard';

export function BuddiesList() {
  return (
    <div className="grid grid-cols-3 gap-3 p-2">
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="flex justify-center items-center">
          <BuddySessionCard />
        </div>
      ))}
    </div>
  );
}
