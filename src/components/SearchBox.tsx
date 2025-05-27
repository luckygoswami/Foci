import { Search } from 'lucide-react';

function SearchBox({ type }: { type: string }) {
  return (
    <div className="border border-black rounded-md p-1 flex items-center justify-between">
      <input
        className="mx-2 my-1 w-full px-1 focus:outline-0"
        type="text"
        placeholder={`Search ${type}`}
      />
      <Search />
    </div>
  );
}

export default SearchBox;
