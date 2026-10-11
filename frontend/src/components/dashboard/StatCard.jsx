import DashboardIcon from "./DashboardIcon.jsx";

const colorClasses = {
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
};

const StatCard = ({ icon, label, value, detail, color }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
      </div>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${colorClasses[color]}`}>
        <DashboardIcon name={icon} />
      </span>
    </div>
    <p className="mt-3 text-xs font-medium text-slate-400">{detail}</p>
  </article>
);

export default StatCard;
