import { User2 } from 'lucide-react';

function ProfileDetails() {
  return (
    <>
      <div className="border border-black p-2 flex gap-5 rounded-3xl">
        <span className="border border-black rounded-full">
          <User2 size={70} />
        </span>
        <div className="flex flex-col">
          <span className="text-xl font-bold">John Doe</span>
          <span className="text-sm">@jodoe</span>
          <span className="text-sm">kinda nightowl!</span>
        </div>
      </div>
    </>
  );
}

export default ProfileDetails;
