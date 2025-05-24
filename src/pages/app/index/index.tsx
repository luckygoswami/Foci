import SubjectsChart from './SubjectsChart';
import DailyGoalChart from './DailyGoalChart';
import WeeklyGoalChart from './WeeklyGoalChart';
import Timer from '@/components/Timer';

function Home() {
  return (
    <main className="flex flex-col gap-4">
      <div className="flex-[1] flex justify-center items-center">
        <Timer initialTime={365} />
      </div>
      <div className="flex-[2] flex justify-evenly items-center flex-col  ">
        <div className="size-50 w-screen flex justify-center">
          <SubjectsChart />
        </div>
        <div className="flex w-screen justify-center">
          <div className="size-50">
            <DailyGoalChart />
          </div>
          <div className="size-50">
            <WeeklyGoalChart />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
