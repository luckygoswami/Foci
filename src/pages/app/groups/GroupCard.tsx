import { BookOpenIcon } from 'lucide-react';

export default function GroupCard({ no }: { no: number }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <BookOpenIcon className="w-6 h-6 text-blue-600" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium">Advanced Math {no}</h3>
          <p className="text-sm text-gray-500">1.2k members • 12 online</p>
        </div>

        <button className="text-sm text-blue-600 hover:underline">Visit</button>
      </div>
    </div>
  );
}
