import DashboardIcon from "./DashboardIcon.jsx";

const ProgressOverview = () => (
  <section className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-7 md:grid-cols-2 md:divide-x md:divide-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600"><DashboardIcon name="flame" /></span>
            <div><p className="text-sm font-semibold text-slate-500">Chuỗi học hiện tại</p><p className="text-2xl font-black text-slate-950">7 ngày</p></div>
          </div>
          <button type="button" disabled title="Điểm danh sẽ sớm được mở" className="mt-5 cursor-not-allowed rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white opacity-85">Điểm danh hôm nay · Sắp có</button>
        </div>
        <div className="md:pl-7">
          <div className="flex items-end justify-between"><div><p className="text-sm font-semibold text-slate-500">Cấp độ học tập</p><p className="mt-1 text-2xl font-black text-slate-950">Level 4</p></div><p className="text-sm font-bold text-violet-700">650 / 1000 XP</p></div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="progress-grow h-full w-[65%] rounded-full bg-gradient-to-r from-blue-600 to-violet-600" /></div>
          <p className="mt-2 text-xs font-medium text-slate-400">Còn 350 XP để lên Level 5</p>
        </div>
      </div>
    </article>

    <article className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-blue-700 shadow-sm"><DashboardIcon name="clipboard" /></span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700">CEFR · A1–C2</span>
      </div>
      <h2 className="mt-5 text-xl font-black text-slate-950">Đánh giá năng lực tiếng Anh</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Xác định trình độ CEFR hiện tại và nhận lộ trình phù hợp.</p>
      <div className="mt-5 flex items-center justify-between gap-4"><div><p className="text-xs text-slate-500">Trình độ hiện tại</p><p className="text-2xl font-black text-blue-700">B1</p></div><button type="button" disabled title="Bài đánh giá sắp ra mắt" className="cursor-not-allowed rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white opacity-85">Đánh giá · Sắp có</button></div>
    </article>
  </section>
);

export default ProgressOverview;
