import DashboardIcon from "./DashboardIcon.jsx";

const features = [
  ["Phân tích điểm yếu", "AI xác định kỹ năng bạn cần cải thiện.", "target"],
  ["Gợi ý bài học", "Nội dung phù hợp với trình độ hiện tại.", "route"],
  ["Hỏi AI", "Giải đáp ngữ pháp, từ vựng và bài tập.", "sparkles"],
];

const DashboardAISection = () => (
  <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 p-6 text-white sm:p-8">
    <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between"><div className="max-w-md"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">Trợ lý học tập</p><h2 className="mt-3 text-3xl font-black">AI hỗ trợ học tập</h2><p className="mt-3 leading-7 text-blue-100">Nhận phân tích và gợi ý cá nhân hóa xuyên suốt hành trình học tiếng Anh.</p><button type="button" disabled title="Hỏi AI sắp ra mắt" className="mt-6 cursor-not-allowed rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 opacity-90">Hỏi AI ngay · Sắp có</button></div><div className="grid flex-1 gap-3 md:grid-cols-3">{features.map(([title, description, icon]) => <article key={title} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><DashboardIcon name={icon} /></span><h3 className="mt-4 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-blue-100">{description}</p></article>)}</div></div>
  </section>
);

export default DashboardAISection;
