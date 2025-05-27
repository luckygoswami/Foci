import SubjectsChart from './SubjectsChart';
import DailyGoalChart from './DailyGoalChart';
import WeeklyGoalChart from './WeeklyGoalChart';
import Timer from '@/components/Timer';

function Home() {
  return (
    <main className="flex flex-col px-2 gap-5">
      <div className="flex-[1] flex justify-center items-center p-2 border-x border-b border-black rounded-br-4xl rounded-bl-4xl">
        <Timer
          initialTime={365}
          size="big"
        />
      </div>
      <div className="flex-[2.5] flex justify-evenly items-center p-1 flex-col border-x border-t border-black rounded-tr-4xl rounded-tl-4xl">
        <div className="flex-[1.5] min-w-full">
          <SubjectsChart />
        </div>
        <div className="flex-[1] flex min-w-full justify-between">
          <div className="size-40">
            <DailyGoalChart />
          </div>
          <div className="size-40">
            <WeeklyGoalChart />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
