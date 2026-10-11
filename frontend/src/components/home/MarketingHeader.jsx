import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth.js";
import DashboardIcon from "../dashboard/DashboardIcon.jsx";

const learningLinks = [
  { label: "Đánh giá năng lực", section: "assessment" },
  { label: "Luyện nghe", section: "listening" },
  { label: "Luyện nói", section: "speaking" },
  { label: "Từ vựng", section: "vocabulary" },
  { label: "AI hỗ trợ", section: "ai" },
];

const getInitials = (fullName = "") =>
  fullName.trim().split(/\s+/).filter(Boolean).slice(-2).map((word) => word[0]).join("").toUpperCase() || "HV";

const MarketingHeader = ({ loginButtonRef, mobileMenuButtonRef, onOpenAuth, registerButtonRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const internalMenuButtonRef = useRef(null);
  const menuButtonRef = mobileMenuButtonRef ?? internalMenuButtonRef;
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen, menuButtonRef]);

  const openLearningArea = (section) => {
    setIsMenuOpen(false);
    navigate(`/dashboard?section=${section}`);
  };

  return (
    <header className="sticky top-0 z-50 border-t-4 border-slate-950 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="English Assessment AI - Trang chủ">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-sm font-black text-white shadow-lg shadow-blue-700/20">EA</span>
          <span className="hidden text-base font-black tracking-tight text-slate-950 min-[390px]:block">English Assessment <span className="text-blue-700">AI</span></span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Điều hướng chính">
          {learningLinks.map((item) => (
            <button key={item.section} type="button" onClick={() => openLearningArea(item.section)} className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100">
              {item.label}
            </button>
          ))}
          <a href="#gioi-thieu" className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">Giới thiệu</a>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <details className="group relative hidden sm:block">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-2 py-1.5 outline-none transition hover:bg-slate-100 focus-visible:ring-4 focus-visible:ring-blue-100">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">{getInitials(user?.fullName)}</span>
                <span className="max-w-28 truncate text-sm font-bold text-slate-800">{user?.fullName || "Học viên"}</span>
                <DashboardIcon name="chevronDown" className="h-4 w-4 text-slate-400" />
              </summary>
              <div className="absolute right-0 top-12 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-2"><p className="truncate text-sm font-bold text-slate-900">{user?.fullName}</p><p className="truncate text-xs text-slate-500">{user?.email}</p></div>
                <button type="button" onClick={() => openLearningArea("home")} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"><DashboardIcon name="dashboard" className="h-4 w-4" /> Vào khu vực học tập</button>
                <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700"><DashboardIcon name="logout" className="h-4 w-4" /> Đăng xuất</button>
              </div>
            </details>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <button ref={loginButtonRef} type="button" onClick={() => onOpenAuth("login")} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100">Đăng nhập</button>
              <button ref={registerButtonRef} type="button" onClick={() => onOpenAuth("register")} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-700/15 transition hover:-translate-y-0.5 hover:bg-blue-800">Đăng ký</button>
            </div>
          )}
          <button ref={menuButtonRef} type="button" onClick={() => setIsMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 xl:hidden" aria-expanded={isMenuOpen} aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}>
            <DashboardIcon name={isMenuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="marketing-menu border-t border-slate-100 bg-white px-5 py-4 shadow-xl xl:hidden">
          <nav className="mx-auto grid max-w-[1380px] gap-1" aria-label="Điều hướng di động">
            {learningLinks.map((item) => <button key={item.section} type="button" onClick={() => openLearningArea(item.section)} className="flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"><span>{item.label}</span><DashboardIcon name="arrow" className="h-4 w-4" /></button>)}
            <a href="#gioi-thieu" onClick={() => setIsMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700">Giới thiệu</a>
            {isAuthenticated ? <><div className="my-2 border-t border-slate-100" /><div className="flex items-center gap-3 px-4 py-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">{getInitials(user?.fullName)}</span><span className="truncate text-sm font-bold">{user?.fullName}</span></div><button type="button" onClick={() => { logout(); setIsMenuOpen(false); }} className="rounded-xl px-4 py-3 text-left text-sm font-bold text-rose-700 hover:bg-rose-50">Đăng xuất</button></> : <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => { setIsMenuOpen(false); onOpenAuth("login"); }} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">Đăng nhập</button><button type="button" onClick={() => { setIsMenuOpen(false); onOpenAuth("register"); }} className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white">Đăng ký</button></div>}
          </nav>
        </div>
      )}
    </header>
  );
};

export default MarketingHeader;
