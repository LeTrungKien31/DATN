import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AuthModal from "../components/auth/AuthModal.jsx";
import MarketingHeader from "../components/home/MarketingHeader.jsx";
import MarketingHero from "../components/home/MarketingHero.jsx";
import MarketingSections from "../components/home/MarketingSections.jsx";
import useAuth from "../hooks/useAuth.js";

const Home = ({ authMode = null }) => {
  const pageRef = useRef(null);
  const loginButtonRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const registerButtonRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (authMode || isAuthenticated) return;
    const returnFocus = window.sessionStorage.getItem("authReturnFocus");
    if (!returnFocus) return;
    window.sessionStorage.removeItem("authReturnFocus");
    requestAnimationFrame(() => {
      const preferredTargets = returnFocus === "register"
        ? [registerButtonRef.current, loginButtonRef.current, mobileMenuButtonRef.current]
        : [loginButtonRef.current, registerButtonRef.current, mobileMenuButtonRef.current];
      const target = preferredTargets.find((element) => element && element.offsetParent !== null)
        ?? mobileMenuButtonRef.current;
      target?.focus();
    });
  }, [authMode, isAuthenticated]);

  const openAuth = (mode) => navigate(`/${mode}`);
  const startLearning = (section = "assessment") => {
    const destination = { pathname: "/dashboard", search: `?section=${section}` };
    if (isAuthenticated) navigate(`${destination.pathname}${destination.search}`);
    else navigate("/register", { state: { from: destination } });
  };

  return (
    <>
      <div ref={pageRef} inert={Boolean(authMode)} aria-hidden={authMode ? true : undefined} className="min-h-screen bg-white text-slate-900">
        <MarketingHeader loginButtonRef={loginButtonRef} mobileMenuButtonRef={mobileMenuButtonRef} onOpenAuth={openAuth} registerButtonRef={registerButtonRef} />
        <main>
          <MarketingHero onStart={startLearning} />
          <MarketingSections onExplore={startLearning} />
        </main>
      </div>
      {authMode && <AuthModal mode={authMode} />}
    </>
  );
};

export default Home;
