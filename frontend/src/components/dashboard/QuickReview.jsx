import DashboardIcon from "./DashboardIcon.jsx";

const tones = {
  amber: { card: "border-amber-100 bg-amber-50/70", icon: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
  indigo: { card: "border-indigo-100 bg-indigo-50/70", icon: "bg-indigo-100 text-indigo-700", bar: "bg-indigo-600" },
};

const QuickReview = ({ items }) => (
  <section className="mt-8">
    <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Tiếp tục học</p><h2 className="mt-2 text-2xl font-black text-slate-950">Ôn tập nhanh</h2><p className="mt-1 text-sm text-slate-500">Tiếp tục từ nơi bạn đã dừng lại</p></div>
    <div className="dashboard-stagger mt-5 grid gap-4 md:grid-cols-2">
      {items.map((item) => {
        const tone = tones[item.tone];
        return (
          <article key={item.title} className={`rounded-2xl border p-5 ${tone.card}`}>
            <div className="flex items-start gap-4"><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone.icon}`}><DashboardIcon name={item.icon} /></span><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.eyebrow}</p><h3 className="mt-1 text-lg font-black text-slate-900">{item.title}</h3><p className="mt-1 text-sm text-slate-600">{item.description}</p></div><span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase text-slate-400">Sắp có</span></div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white"><div className={`progress-grow h-full rounded-full ${tone.bar}`} style={{ width: `${item.progress}%` }} /></div>
          </article>
        );
      })}
    </div>
  </section>
);

export default QuickReview;
