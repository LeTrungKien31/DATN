import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import DashboardIcon from "./DashboardIcon.jsx";

const navigationGroups = [
  { label: "Học tập", items: [
    { id: "home", label: "Trang chủ", icon: "dashboard" },
    { id: "assessment", label: "Đánh giá năng lực", icon: "clipboard" },
    { id: "listening", label: "Luyện nghe", icon: "headphones" },
    { id: "speaking", label: "Luyện nói", icon: "microphone" },
    { id: "vocabulary", label: "Từ vựng & Ngữ pháp", icon: "practice" },
    { id: "reading", label: "Reading & Writing", icon: "pen" },
    { id: "ai", label: "AI hỗ trợ", icon: "sparkles" },
  ] },
  { label: "Kiểm tra", items: [
    { id: "tests", label: "Bài kiểm tra", icon: "clipboard" },
    { id: "history", label: "Lịch sử làm bài", icon: "clock" },
    { id: "results", label: "Kết quả của tôi", icon: "award" },
  ] },
  { label: "Cộng đồng", items: [
    { id: "ranking", label: "Bảng xếp hạng", icon: "award" },
    { id: "achievements", label: "Thành tích", icon: "flame" },
  ] },
];

const getInitials = (fullName = "") => fullName.trim().split(/\s+/).filter(Boolean).slice(-2).map((word) => word[0]).join("").toUpperCase() || "HV";

const SidebarContent = ({ closeButtonRef, isAuthenticated, onClose, onLogin, onLogout, onRegister, onSelect, selectedSection, showClose, user }) => (
  <>
    <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
      <Link to="/" className="flex items-center gap-3" onClick={onClose}>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-sm font-black text-white shadow-lg shadow-blue-700/20">EA</span>
        <span className="whitespace-nowrap text-[13px] font-extrabold tracking-tight text-slate-950">English Assessment <span className="text-blue-700">AI</span></span>
      </Link>
      {showClose && <button ref={closeButtonRef} type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Đóng menu"><DashboardIcon name="close" /></button>}
    </div>

    <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5" aria-label="Điều hướng học viên">
      {navigationGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{group.label}</p>
          <div className="space-y-1">{group.items.map((item) => (
            <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition duration-200 ${selectedSection === item.id ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100" : "text-slate-500 hover:translate-x-0.5 hover:bg-slate-50 hover:text-slate-900"}`} aria-current={selectedSection === item.id ? "page" : undefined}>
              <DashboardIcon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {selectedSection === item.id && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />}
            </button>
          ))}</div>
        </div>
      ))}
    </nav>

    <div className="border-t border-slate-100 p-4">
      {isAuthenticated ? <><div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">{getInitials(user?.fullName)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{user?.fullName || "Học viên"}</p><p className="truncate text-xs text-slate-500">{user?.email}</p></div></div>
      <div className="space-y-1">
        <Link to="/" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"><DashboardIcon name="home" className="h-4 w-4" /> Trang chủ công khai</Link>
        <button type="button" disabled title="Cài đặt sắp ra mắt" className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400"><DashboardIcon name="settings" className="h-4 w-4" /> Cài đặt · Sắp có</button>
        <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"><DashboardIcon name="logout" className="h-4 w-4" /> Đăng xuất</button>
      </div></> : <div className="grid grid-cols-2 gap-2"><button type="button" onClick={onLogin} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700">Đăng nhập</button><button type="button" onClick={onRegister} className="rounded-xl bg-blue-700 px-3 py-2.5 text-sm font-bold text-white">Đăng ký</button></div>}
    </div>
  </>
);

const DashboardSidebar = ({ isAuthenticated, isOpen, onClose, onLogin, onLogout, onRegister, onSelect, selectedSection, triggerRef, user }) => {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
      if (event.key === "Tab") {
        const focusable = drawerRef.current?.querySelectorAll('a[href], button:not([disabled])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  const closeAndRestoreFocus = () => {
    onClose();
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent isAuthenticated={isAuthenticated} onClose={onClose} onLogin={onLogin} onLogout={onLogout} onRegister={onRegister} onSelect={onSelect} selectedSection={selectedSection} user={user} />
      </aside>
      {isOpen && (
        <>
          <button type="button" aria-label="Đóng menu" className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden" onClick={closeAndRestoreFocus} />
          <aside ref={drawerRef} role="dialog" aria-modal="true" aria-label="Menu học viên" className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-2xl lg:hidden">
            <SidebarContent closeButtonRef={closeButtonRef} isAuthenticated={isAuthenticated} onClose={closeAndRestoreFocus} onLogin={onLogin} onLogout={onLogout} onRegister={onRegister} onSelect={onSelect} selectedSection={selectedSection} showClose user={user} />
          </aside>
        </>
      )}
    </>
  );
};

export default DashboardSidebar;
