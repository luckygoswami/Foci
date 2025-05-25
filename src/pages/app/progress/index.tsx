import Streakboard from './Streakboard';
import SubjectProgress from './SubjectProgress';

function ProgressDashboard() {
  return (
    <main className="flex flex-col px-2 gap-5">
      <div className="flex-[1] flex flex-col justify-between p-2 border-x border-b border-black rounded-br-4xl rounded-bl-4xl">
        <Streakboard />
      </div>

      <div className="flex-[1.5] p-2 border-x border-t border-black rounded-tr-4xl rounded-tl-4xl">
        <div className="flex space-x-4 overflow-x-auto pb-2 snap-x snap-mandatory w-full h-full">
          <div className="flex-shrink-0 w-full sm:w-[400px] h-full snap-center">
            <SubjectProgress />
          </div>
          <div className="flex-shrink-0 w-full sm:w-[400px] h-full snap-center">
            <SubjectProgress />
          </div>
          <div className="flex-shrink-0 w-full sm:w-[400px] h-full snap-center">
            <SubjectProgress />
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProgressDashboard;
