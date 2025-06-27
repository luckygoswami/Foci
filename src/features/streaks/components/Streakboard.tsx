import { Flame } from 'lucide-react';

export function Streakboard() {
  return (
    <>
      <h1 className="font-bold text-4xl">Streakboard</h1>
      <div className="current-streak">
        <span className="text-6xl flex items-center">
          17
          <Flame
            size={45}
            fill="yellow"
          />
        </span>
      </div>
      <div className="streak-week flex justify-evenly text-center">
        <span>
          <Flame fill="yellow" />
          Su
        </span>
        <span>
          <Flame fill="yellow" />
          Mo
        </span>
        <span>
          <Flame fill="yellow" />
          Tu
        </span>
        <span>
          <Flame fill="yellow" />
          We
        </span>
        <span>
          <Flame
            fill="yellow"
            fillOpacity={0.3}
          />
          Th
        </span>
        <span>
          <Flame
            fill="yellow"
            fillOpacity={0.3}
          />
          Fr
        </span>
        <span>
          <Flame
            fill="yellow"
            fillOpacity={0.3}
          />
          Sa
        </span>
      </div>
    </>
  );
}
