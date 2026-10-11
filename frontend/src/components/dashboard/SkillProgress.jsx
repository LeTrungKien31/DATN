const SkillProgress = ({ label, level, value, color }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <p className="font-bold text-slate-800">{label}</p>
        <p className="mt-0.5 text-xs text-slate-400">{level}</p>
      </div>
      <span className="text-sm font-black text-slate-700">{value}%</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
      <div
        className={`progress-grow h-full rounded-full ${color}`}
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-label={`${label}: ${value}%`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={value}
      />
    </div>
  </div>
);

export default SkillProgress;
