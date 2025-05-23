import SubjectsChart from './SubjectsChart';
import DailyGoalChart from './DailyGoalChart';
import WeeklyGoalChart from './WeeklyGoalChart';

function Home() {
  return (
    <div>
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
  );
}

export default Home;
