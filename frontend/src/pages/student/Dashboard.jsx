import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AuthModal from "../../components/auth/AuthModal.jsx";
import DashboardAISection from "../../components/dashboard/DashboardAISection.jsx";
import DashboardHeader from "../../components/dashboard/DashboardHeader.jsx";
import DashboardIcon from "../../components/dashboard/DashboardIcon.jsx";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar.jsx";
import FeaturedLessons from "../../components/dashboard/FeaturedLessons.jsx";
import ProgressOverview from "../../components/dashboard/ProgressOverview.jsx";
import QuickReview from "../../components/dashboard/QuickReview.jsx";
import RecentActivity from "../../components/dashboard/RecentActivity.jsx";
import SkillProgress from "../../components/dashboard/SkillProgress.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import WelcomeSection from "../../components/dashboard/WelcomeSection.jsx";
import {
  dashboardSkills,
  dashboardStats,
  featuredLessons,
  quickReviews,
  recentActivities,
} from "../../data/dashboardMock.js";
import useAuth from "../../hooks/useAuth.js";
import api from "../../services/api.js";

const STATUS = { CHECKING: "CHECKING", CONNECTED: "CONNECTED", DISCONNECTED: "DISCONNECTED" };

const sectionLabels = {
  home: "Tổng quan học tập",
  assessment: "Đánh giá năng lực",
  listening: "Luyện nghe",
  speaking: "Luyện nói",
  vocabulary: "Từ vựng & Ngữ pháp",
  reading: "Reading & Writing",
  ai: "AI hỗ trợ",
  tests: "Bài kiểm tra",
  history: "Lịch sử làm bài",
  results: "Kết quả của tôi",
  ranking: "Bảng xếp hạng",
  achievements: "Thành tích",
};

const Dashboard = ({ authMode = null }) => {
  const [apiStatus, setApiStatus] = useState(STATUS.CHECKING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const loginButtonRef = useRef(null);
  const menuButtonRef = useRef(null);
  const registerButtonRef = useRef(null);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedSection = searchParams.get("section");
  const selectedSection = Object.hasOwn(sectionLabels, requestedSection) ? requestedSection : "home";

  useEffect(() => {
    const controller = new AbortController();
    const checkApi = async () => {
      try {
        await api.get("/health", { signal: controller.signal });
        setApiStatus(STATUS.CONNECTED);
      } catch (error) {
        if (error.code !== "ERR_CANCELED") setApiStatus(STATUS.DISCONNECTED);
      }
    };
    checkApi();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (authMode || isAuthenticated) return;
    const returnFocus = window.sessionStorage.getItem("authReturnFocus");
    if (!returnFocus) return;
    window.sessionStorage.removeItem("authReturnFocus");
    requestAnimationFrame(() => {
      const target = returnFocus === "register"
        ? registerButtonRef.current ?? loginButtonRef.current
        : loginButtonRef.current;
      target?.focus();
    });
  }, [authMode, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const openAuth = (mode) => {
    setIsSidebarOpen(false);
    navigate(`/${mode}`);
  };

  const selectSection = (section) => {
    setIsSidebarOpen(false);
    navigate(section === "home" ? "/dashboard" : `/dashboard?section=${section}`);
  };

  const firstName = user?.fullName?.trim().split(/\s+/).at(-1) || "bạn";

  return (
    <>
    <div
      className="min-h-screen bg-slate-50 text-slate-900"
      inert={Boolean(authMode)}
      aria-hidden={authMode ? true : undefined}
    >
      <DashboardSidebar
        isAuthenticated={isAuthenticated}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogin={() => openAuth("login")}
        onLogout={handleLogout}
        onRegister={() => openAuth("register")}
        onSelect={selectSection}
        selectedSection={selectedSection}
        triggerRef={menuButtonRef}
        user={user}
      />
      <DashboardHeader
        apiStatus={apiStatus}
        isAuthenticated={isAuthenticated}
        loginButtonRef={loginButtonRef}
        menuButtonRef={menuButtonRef}
        onLogin={() => openAuth("login")}
        onLogout={handleLogout}
        onOpenMenu={() => setIsSidebarOpen(true)}
        onRegister={() => openAuth("register")}
        registerButtonRef={registerButtonRef}
        user={user}
      />

      <main className="lg:ml-64">
        <div className="dashboard-enter mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9 xl:px-12">
          {selectedSection !== "home" && (
            <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-violet-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Không gian học tập</p><h1 className="mt-1 text-xl font-black text-slate-950">{sectionLabels[selectedSection]}</h1></div>
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm sm:self-auto"><DashboardIcon name="sparkles" className="h-4 w-4 text-violet-600" /> Nội dung cá nhân hóa theo tiến độ</span>
            </div>
          )}
          <WelcomeSection firstName={firstName} />
          <div role="note" className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            <DashboardIcon name="sparkles" className="mt-0.5 h-5 w-5 shrink-0" />
            <p><strong>Dữ liệu minh họa:</strong> tiến độ, CEFR, XP, chuỗi học, bài học và gợi ý AI trên dashboard sẽ được thay bằng dữ liệu thật khi các API học tập được triển khai.</p>
          </div>
          <ProgressOverview />

          <section className="dashboard-stagger mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Thống kê học tập">
            {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </section>

          <QuickReview items={quickReviews} />

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Năng lực hiện tại</p><h2 className="mt-2 text-2xl font-black text-slate-950">Kỹ năng của tôi</h2></div>
              <span className="text-sm font-semibold text-slate-400">Dữ liệu minh họa · CEFR</span>
            </div>
            <div className="dashboard-stagger mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {dashboardSkills.map((skill) => <SkillProgress key={skill.label} {...skill} />)}
            </div>
          </section>

          <FeaturedLessons lessons={featuredLessons} />
          <DashboardAISection />

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <RecentActivity activities={recentActivities} />
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Mục tiêu tuần</p><h2 className="mt-2 text-xl font-black text-slate-950">4/5 ngày học</h2></div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><DashboardIcon name="target" /></span>
              </div>
              <div className="mt-6 grid grid-cols-7 gap-1 sm:gap-2" aria-label="Tiến độ học trong tuần">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
                  <div key={day} className="text-center">
                    <span className={`mx-auto grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold min-[360px]:h-8 min-[360px]:w-8 sm:h-9 sm:w-9 sm:text-xs ${index < 4 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>{index < 4 ? <DashboardIcon name="check" className="h-4 w-4" /> : day}</span>
                    <span className="mt-2 block text-[11px] font-semibold text-slate-400">{day}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">Hoàn thành thêm <strong className="text-slate-900">1 ngày</strong> để đạt mục tiêu tuần này.</div>
            </section>
          </div>
        </div>
      </main>
    </div>
    {authMode && <AuthModal mode={authMode} />}
    </>
  );
};

export default Dashboard;
