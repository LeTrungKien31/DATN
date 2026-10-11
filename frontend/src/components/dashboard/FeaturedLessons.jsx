import DashboardIcon from "./DashboardIcon.jsx";

const FeaturedLessons = ({ lessons }) => (
  <section className="mt-8">
    <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Đề xuất cho bạn</p><h2 className="mt-2 text-2xl font-black text-slate-950">Bài học nổi bật hôm nay</h2></div><span className="hidden text-sm font-semibold text-slate-400 sm:block">Dữ liệu minh họa</span></div>
    <div className="dashboard-stagger mt-5 flex snap-x gap-4 overflow-x-auto pb-3">
      {lessons.map((lesson) => (
        <article key={lesson.title} className="group min-w-[270px] snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:min-w-[300px]">
          <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${lesson.tone}`}><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/80 text-slate-700 shadow-sm"><DashboardIcon name={lesson.icon} className="h-7 w-7" /></span></div>
          <div className="p-5"><div className="flex items-center gap-2"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">{lesson.skill}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{lesson.level}</span></div><h3 className="mt-4 line-clamp-2 min-h-12 text-base font-black leading-6 text-slate-900">{lesson.title}</h3><div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-400"><span className="flex items-center gap-1.5"><DashboardIcon name="clock" className="h-4 w-4" />{lesson.duration}</span><span>Sắp có</span></div></div>
        </article>
      ))}
    </div>
  </section>
);

export default FeaturedLessons;
