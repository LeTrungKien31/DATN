import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";
import { getPrivateRouteState } from "./privateRouteState.js";

export const AuthLoading = () => (
  <div className="grid min-h-screen place-items-center bg-slate-50" role="status">
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
      Đang kiểm tra phiên đăng nhập...
    </div>
  </div>
);

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = useAuth();
  const routeState = getPrivateRouteState({
    isInitializing,
    isAuthenticated,
  });

  if (routeState === "loading") return <AuthLoading />;
  if (routeState === "redirect") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

export default PrivateRoute;
