import DashboardIcon from "./DashboardIcon.jsx";

const WelcomeSection = ({ firstName }) => (
  <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-sm sm:px-8 lg:px-10">
    <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Dashboard học tập</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Chào mừng trở lại, {firstName}!</h1>
        <p className="mt-3 leading-7 text-slate-300">Tiếp tục hành trình nâng cao năng lực tiếng Anh của bạn hôm nay.</p>
      </div>
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/20 text-blue-200"><DashboardIcon name="sparkles" /></span>
          <div>
            <p className="text-sm font-bold">AI gợi ý hôm nay</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">Luyện Listening 15 phút để cải thiện kỹ năng còn yếu.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WelcomeSection;
