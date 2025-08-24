export function Progress({ step, max }: { step: number; max: number }) {
  const pct = (step / max) * 100;
  return (
    <div className="mb-6">
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Step {step} of {max}
      </p>
    </div>
  );
}
