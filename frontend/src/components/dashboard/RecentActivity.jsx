import DashboardIcon from "./DashboardIcon.jsx";

const RecentActivity = ({ activities }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Nhật ký học tập</p><h2 className="mt-2 text-xl font-black text-slate-950">Hoạt động gần đây</h2></div><span className="hidden text-sm font-semibold text-slate-400 sm:block">7 ngày gần nhất</span></div>
    <div className="mt-5 divide-y divide-slate-100">{activities.map((activity) => <div key={activity.title} className="flex items-center gap-4 py-4 first:pt-1 last:pb-0"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${activity.tone}`}><DashboardIcon name={activity.icon} /></span><div className="min-w-0 flex-1"><p className="truncate font-bold text-slate-800">{activity.title}</p><p className="mt-1 truncate text-sm text-slate-500">{activity.meta}</p></div><time className="shrink-0 text-xs font-semibold text-slate-400">{activity.time}</time></div>)}</div>
  </section>
);

export default RecentActivity;
