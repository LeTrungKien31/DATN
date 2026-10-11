import DashboardIcon from "../dashboard/DashboardIcon.jsx";

const features = [
  ["assessment", "clipboard", "Đánh giá chuẩn CEFR", "Xác định chính xác trình độ từ A1 đến C2 qua bài kiểm tra toàn diện."],
  ["listening", "headphones", "Luyện nghe thực tế", "Rèn phản xạ qua hội thoại và nội dung phù hợp với trình độ hiện tại."],
  ["speaking", "microphone", "Phản hồi phát âm", "Nhận nhận xét rõ ràng để cải thiện độ chính xác và sự tự tin khi nói."],
  ["ai", "sparkles", "Lộ trình từ AI", "Tập trung đúng kỹ năng còn yếu với đề xuất học tập riêng cho bạn."],
];

const MarketingSections = ({ onExplore }) => (
  <>
    <section id="gioi-thieu" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Một nền tảng, trọn hành trình</p><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Học đúng trọng tâm, thấy rõ tiến bộ</h2><p className="mt-4 leading-7 text-slate-600">Mỗi hoạt động đều kết nối với hồ sơ năng lực để bạn biết mình đang ở đâu và cần làm gì tiếp theo.</p></div>
        <div className="marketing-stagger mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([section,icon,title,description]) => <button key={title} type="button" onClick={() => onExplore(section)} className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:scale-110 group-hover:bg-blue-700 group-hover:text-white"><DashboardIcon name={icon} /></span><h3 className="mt-5 text-lg font-black text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Khám phá <DashboardIcon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span></button>)}
        </div>
      </div>
    </section>

    <section className="bg-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-10">
        <div className="max-w-2xl"><p className="text-sm font-bold text-blue-300">Bắt đầu từ năng lực thật của bạn</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Sẵn sàng kiểm tra trình độ tiếng Anh?</h2><p className="mt-4 leading-7 text-slate-300">Tạo tài khoản miễn phí và nhận lộ trình học tập cá nhân ngay sau bài đánh giá.</p></div>
        <button type="button" onClick={() => onExplore("assessment")} className="group inline-flex min-h-13 shrink-0 items-center gap-3 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-blue-50">Bắt đầu ngay <DashboardIcon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" /></button>
      </div>
    </section>

    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-700 text-xs font-black text-white">EA</span><strong className="text-slate-900">English Assessment AI</strong></div><p>© 2026 English Assessment AI. Nền tảng đánh giá và học tiếng Anh cá nhân hóa.</p></div>
    </footer>
  </>
);

export default MarketingSections;
