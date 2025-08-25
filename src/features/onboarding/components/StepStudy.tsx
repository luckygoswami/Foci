import React, { useState } from 'react';
import type { OnboardingState } from '../types';

export function StepStudy({
  form,
  setForm,
}: {
  form: OnboardingState;
  setForm: React.Dispatch<React.SetStateAction<OnboardingState>>;
}) {
  const { subjects, dailyTargetMinutes, weeklyTargetMinutes } = form;
  const [subjectInput, setSubjectInput] = useState('');
  function addSubject() {
    const s = subjectInput.trim();
    if (!s) return;
    if (!subjects.includes(s)) {
      setForm((f) => ({ ...f, subjects: [...f.subjects, s] }));
    }
    setSubjectInput('');
  }
  function removeSubject(s: string) {
    setForm((f) => ({ ...f, subjects: f.subjects.filter((x) => x !== s) }));
  }

  function handleDailyTarget(e: React.ChangeEvent<HTMLInputElement>) {
    let target = Number(e.target.value);

    setForm((f) => ({
      ...f,
      dailyTargetMinutes: target,
    }));
  }

  function handleWeeklyTarget(e: React.ChangeEvent<HTMLInputElement>) {
    let target = Number(e.target.value);

    setForm((f) => ({
      ...f,
      weeklyTargetMinutes: target,
    }));
  }

  const fmt = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const DAILY_MIN = 15;
  const DAILY_MAX = 1200;
  const DAILY_STEP = 5;

  const WEEKLY_MIN = 90;
  const WEEKLY_MAX = 8400;
  const WEEKLY_STEP = 30;

  return (
    <div className="space-y-4">
      {/* Subjects */}
      <div>
        <label
          htmlFor="subjects-input"
          className="text-sm font-medium">
          Subjects
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="subjects-input"
            className="w-full rounded border px-3 py-2"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            placeholder="Add a subject and press Add"
          />
          <button
            type="button"
            onClick={addSubject}
            className="px-3 py-2 rounded bg-slate-200">
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {subjects.map((s) => (
            <span
              key={s}
              className="px-2 py-1 rounded-full bg-slate-100 text-sm">
              {s}
              <button
                className="ml-2 text-slate-500"
                onClick={() => removeSubject(s)}>
                x
              </button>
            </span>
          ))}
          {subjects.length === 0 && (
            <span className="text-xs text-slate-500">No subjects yet.</span>
          )}
        </div>
      </div>

      {/* Daily Target */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="dailyTarget-input"
            className="text-sm font-medium">
            Daily Target
          </label>
          <span className="text-sm text-slate-600 tabular-nums">
            {fmt(form.dailyTargetMinutes)} ({form.dailyTargetMinutes} min)
          </span>
        </div>
        <input
          id="dailyTarget-input"
          type="range"
          min={DAILY_MIN}
          max={DAILY_MAX}
          step={DAILY_STEP}
          value={dailyTargetMinutes}
          onChange={handleDailyTarget}
          className="mt-2 w-full accent-blue-600"
          aria-valuemin={DAILY_MIN}
          aria-valuemax={DAILY_MAX}
          aria-valuenow={dailyTargetMinutes}
          aria-label="Daily study target in minutes"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{fmt(DAILY_MIN)}</span>
          <span>{fmt(DAILY_MAX)}</span>
        </div>
      </div>

      {/* Weekly Target */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="weeklyTarget-input"
            className="text-sm font-medium">
            Weekly Target
          </label>
          <span className="text-sm text-slate-600 tabular-nums">
            {fmt(weeklyTargetMinutes)} ({weeklyTargetMinutes} min)
          </span>
        </div>
        <input
          id="weeklyTarget-input"
          type="range"
          min={WEEKLY_MIN}
          max={WEEKLY_MAX}
          step={WEEKLY_STEP}
          value={weeklyTargetMinutes}
          onChange={handleWeeklyTarget}
          className="mt-2 w-full accent-blue-600"
          aria-valuemin={WEEKLY_MIN}
          aria-valuemax={WEEKLY_MAX}
          aria-valuenow={weeklyTargetMinutes}
          aria-label="Weekly study target in minutes"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{fmt(WEEKLY_MIN)}</span>
          <span>{fmt(WEEKLY_MAX)}</span>
        </div>
      </div>
    </div>
  );
}
