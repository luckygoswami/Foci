import SearchBox from '@/components/SearchBox';
import SnapSections from '@/components/SnapSections';
import { BuddiesList, RequestsList } from '@/features/buddies';

export default function BuddiesDashboard() {
  const sections = [
    {
      title: 'buddies',
      component: BuddiesList,
    },
    {
      title: 'requests',
      component: RequestsList,
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
