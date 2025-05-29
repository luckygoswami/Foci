import ProfileStats from './ProfileStats';
import ProfileDetails from './ProfileDetails';

function AccountDashboard() {
  return (
    <main className="flex flex-col gap-4 p-2">
      <div className="flex-[2] flex flex-col gap-4 p-3 rounded-lg">
        <h1 className="font-bold text-3xl">Profile</h1>
        <ProfileDetails />
        <ProfileStats />
      </div>
      <div className="flex-[3] flex flex-col gap-1 overflow-auto p-3 rounded-lg">
        <h1 className="font-bold text-3xl">Settings</h1>
        <div className="border border-black rounded-md px-1 py-2">Subjects</div>
        <div className="border border-black rounded-md px-1 py-2">
          Daily Target
        </div>
        <div className="border border-black rounded-md px-1 py-2">
          Theme mode
        </div>
        <div className="border border-black rounded-md px-1 py-2">
          Study time privacy
        </div>
        <div className="border border-black rounded-md px-1 py-2">
          Change account password
        </div>
        <div className="border border-black rounded-md px-1 py-2">Logout</div>
      </div>
    </main>
  );
}

export default AccountDashboard;
