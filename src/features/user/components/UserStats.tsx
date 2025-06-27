export function UserStats() {
  return (
    <div className="account-stats text-[0.75rem] bg-blue-200 rounded-2xl grid grid-cols-3 p-3">
      <div className="flex flex-col justify-center items-center border-r border-black">
        <span>
          <span className="text-2xl font-bold">17</span> days
        </span>
        <span>current streak</span>
      </div>
      <div className="flex flex-col justify-center items-center border-r border-black">
        <span>
          <span className="text-2xl font-bold">96</span> hrs
        </span>
        <span>total studied</span>
      </div>
      <div className="flex flex-col justify-center items-center">
        <span>
          <span className="text-2xl font-bold">157</span> xp
        </span>
        <span>total earned</span>
      </div>
    </div>
  );
}
