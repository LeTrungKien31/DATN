import DashboardIcon from "../dashboard/DashboardIcon.jsx";

const MarketingHero = ({ onStart }) => (
  <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_35%,rgba(139,92,246,0.10),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8faff_100%)]">
    <div className="pointer-events-none absolute left-[5%] top-[72%] h-16 w-16 rounded-full border-[7px] border-slate-200/70" />
    <div className="pointer-events-none absolute right-[7%] top-[70%] text-7xl font-thin text-violet-200/60">+</div>
    <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-[1380px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:px-10 lg:py-20">
      <div className="hero-copy relative z-10 max-w-2xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
          <DashboardIcon name="sparkles" className="h-4 w-4" /> Đánh giá tiếng Anh theo chuẩn CEFR
        </div>
        <h1 className="text-[clamp(2.65rem,6vw,5.1rem)] font-black leading-[0.98] tracking-[-0.055em] text-slate-950">
          Học tiếng Anh<br />thông minh hơn<br />cùng <span className="text-blue-700">AI</span>
        </h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          Kiểm tra trình độ, luyện nghe, luyện nói và phát triển từ vựng với phản hồi tức thì. Lộ trình học được cá nhân hóa theo năng lực của bạn.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onStart} className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-1 hover:bg-blue-700">
            Bắt đầu miễn phí <DashboardIcon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
          <a href="#gioi-thieu" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-black text-slate-700 transition hover:-translate-y-1 hover:border-blue-200 hover:text-blue-700">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-blue-700">▶</span> Tìm hiểu thêm
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">
          {["Kết quả tức thì", "6 kỹ năng", "Lộ trình cá nhân"].map((label) => <span key={label} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700"><DashboardIcon name="check" className="h-3 w-3" /></span>{label}</span>)}
        </div>
      </div>

      <div className="hero-visual relative mx-auto w-full max-w-[620px] lg:mx-0 lg:ml-auto">
        <div className="absolute -left-8 top-16 h-32 w-32 rounded-[2.2rem] bg-blue-100 blur-2xl" />
        <div className="absolute -right-8 bottom-12 h-40 w-40 rounded-full bg-violet-100 blur-2xl" />
        <div className="relative rotate-1 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_rgba(30,64,175,0.13)] sm:p-6">
          <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5"><div className="flex gap-2"><span className="h-3 w-3 rounded-full bg-rose-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" /></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Learning analytics</span></div>
            <div className="mt-6 flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">Trình độ hiện tại</p><h2 className="mt-1 text-2xl font-black text-slate-950">Tiến bộ của bạn</h2></div><span className="grid h-16 w-16 place-items-center rounded-full bg-blue-700 text-lg font-black text-white shadow-lg shadow-blue-700/25">B2</span></div>
            <div className="mt-7 space-y-5">
              {[["Grammar",86,"bg-blue-600"],["Reading",78,"bg-violet-500"],["Speaking",72,"bg-cyan-500"]].map(([label,value,color]) => <div key={label}><div className="mb-2 flex justify-between text-sm font-bold text-slate-700"><span>{label}</span><span>{value}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-200"><div className={`progress-grow h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div></div>)}
            </div>
            <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">{[["24","Bài đã làm"],["+18%","Tiến bộ"],["12h","Luyện tập"]].map(([value,label]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 text-center"><strong className="block text-base text-slate-950">{value}</strong><span className="mt-1 block text-[10px] font-semibold text-slate-500 sm:text-xs">{label}</span></div>)}</div>
          </div>
        </div>
        <div className="floating-card absolute -bottom-8 -left-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:-left-10"><span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700"><DashboardIcon name="sparkles" /></span><div><p className="text-sm font-black text-slate-900">AI Recommendation</p><p className="text-xs text-slate-500">Đã tạo lộ trình mới</p></div></div>
      </div>
    </div>
  </section>
);

export default MarketingHero;
