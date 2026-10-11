import { Link } from "react-router-dom";

const highlights = [
  "Đánh giá năng lực theo chuẩn CEFR",
  "Phân tích chi tiết từng kỹ năng",
  "Lộ trình học tập được cá nhân hóa",
];

const AuthLayout = ({ children, title, description }) => (
  <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(360px,0.9fr)_minmax(520px,1.1fr)]">
    <aside className="relative hidden overflow-hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
      <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-blue-700/25 blur-3xl" />
      <div className="relative">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-700 text-sm font-black">
            EA
          </span>
          <span className="text-lg font-extrabold">
            English Assessment <span className="text-blue-400">AI</span>
          </span>
        </Link>
      </div>

      <div className="relative max-w-xl py-14">
        <p className="mb-5 flex items-center gap-3 text-sm font-bold text-blue-300">
          <span className="h-px w-8 bg-blue-400" />
          Học đúng trọng tâm, tiến bộ rõ ràng
        </p>
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
          {title}
        </h2>
        <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
          {description}
        </p>
        <ul className="mt-10 space-y-4">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-3 text-slate-200">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-500/20 text-blue-300">
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-slate-500">
        © 2026 English Assessment AI
      </p>
    </aside>

    <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 font-extrabold text-slate-950 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-700 text-xs text-white">EA</span>
          English Assessment <span className="text-blue-700">AI</span>
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </section>
  </main>
);

export default AuthLayout;
