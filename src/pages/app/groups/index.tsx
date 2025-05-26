import SearchBox from '@/components/SearchBox';
import GroupCard from './GroupCard';
import { PlusIcon } from 'lucide-react';

function GroupsDashboard() {
  return (
    <main className="flex flex-col px-2 gap-3">
      <div className="mt-2">
        <SearchBox type="group" />
      </div>

      <div className="h-full border-x border-t rounded-tr-2xl rounded-tl-2xl px-2 border-black">
        <h1 className="font-bold text-3xl m-2">Joined Groups</h1>
        <div className="h-full overflow-y-auto">
          <div className="space-y-4 pb-50">
            {[...Array(13)].map((_, i) => (
              <GroupCard
                key={i}
                no={i}
              />
            ))}
          </div>
        </div>
      </div>

      <button className="fixed bottom-20 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-10">
        <PlusIcon className="size-6" />
      </button>
    </main>
  );
}

export default GroupsDashboard;
