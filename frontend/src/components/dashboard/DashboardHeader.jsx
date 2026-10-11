import DashboardIcon from "./DashboardIcon.jsx";

const getInitials = (fullName = "") => {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  return words.slice(-2).map((word) => word[0]).join("").toUpperCase() || "HV";
};

const DashboardHeader = ({ apiStatus, isAuthenticated, loginButtonRef, menuButtonRef, onLogin, onLogout, onOpenMenu, onRegister, registerButtonRef, user }) => {
  const statusLabel = {
    CHECKING: "Đang kết nối",
    CONNECTED: "Hệ thống ổn định",
    DISCONNECTED: "Mất kết nối",
  }[apiStatus];

  const statusColor = {
    CHECKING: "bg-amber-400",
    CONNECTED: "bg-emerald-500",
    DISCONNECTED: "bg-rose-500",
  }[apiStatus];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl lg:ml-64">
      <div className="flex h-[72px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="flex min-w-0 items-center gap-3">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={onOpenMenu}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
            aria-label="Mở menu"
          >
            <DashboardIcon name="menu" />
          </button>
          <label className="hidden h-11 w-[min(34vw,430px)] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-400 md:flex" title="Tìm kiếm sắp ra mắt">
            <DashboardIcon name="search" className="h-5 w-5 shrink-0" />
            <input type="search" disabled aria-label="Tìm kiếm sắp ra mắt" placeholder="Tìm kiếm sắp ra mắt..." className="min-w-0 flex-1 cursor-not-allowed bg-transparent text-sm text-slate-500 outline-none placeholder:text-slate-400" />
          </label>
          <div className="min-w-0 md:hidden">
            <p className="truncate text-sm text-slate-500">Chào mừng trở lại</p>
            <p className="truncate font-bold text-slate-950">{user?.fullName || "Học viên"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button type="button" disabled title="AI Assistant sắp ra mắt" className="hidden h-10 cursor-not-allowed items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white xl:flex">
            <DashboardIcon name="sparkles" className="h-4 w-4" /> Hỏi AI
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 md:flex">
            <span className={`h-2 w-2 rounded-full ${statusColor}`} />
            {statusLabel}
          </div>
          <button
            type="button"
            disabled
            title="Thông báo sắp ra mắt"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 disabled:cursor-not-allowed"
            aria-label="Thông báo"
          >
            <DashboardIcon name="bell" />
          </button>
          {isAuthenticated ? <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">{getInitials(user?.fullName)}</div>
              <div className="hidden max-w-32 text-left lg:block"><p className="truncate text-sm font-bold text-slate-900">{user?.fullName || "Học viên"}</p><p className="text-xs text-slate-400">Học viên</p></div>
            </summary>
            <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-2"><p className="truncate text-sm font-bold text-slate-900">{user?.fullName}</p><p className="truncate text-xs text-slate-500">{user?.email}</p></div>
              <button type="button" disabled className="mt-1 flex w-full cursor-not-allowed items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400"><DashboardIcon name="settings" className="h-4 w-4" /> Cài đặt · Sắp có</button>
              <button type="button" onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700"><DashboardIcon name="logout" className="h-4 w-4" /> Đăng xuất</button>
            </div>
          </details> : (
            <div className="flex items-center gap-2">
              <button ref={loginButtonRef} type="button" onClick={onLogin} className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100">Đăng nhập</button>
              <button ref={registerButtonRef} type="button" onClick={onRegister} className="hidden rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 sm:block">Đăng ký</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
