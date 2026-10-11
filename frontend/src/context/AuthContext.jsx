import { useMemo, useState } from "react";

import authService from "../services/authService.js";
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from "../utils/authStorage.js";
import AuthContext from "./auth-context.js";

const getBrowserStorages = () => ({
  localStorage: window.localStorage,
  sessionStorage: window.sessionStorage,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => readAuthSession(getBrowserStorages())?.user ?? null,
  );
  const isInitializing = false;

  const login = async (credentials, remember) => {
    const session = await authService.login(credentials);
    writeAuthSession(session, remember, getBrowserStorages());
    setUser(session.user);
    return session.user;
  };

  const register = async (details) => {
    const session = await authService.register(details);
    writeAuthSession(session, true, getBrowserStorages());
    setUser(session.user);
    return session.user;
  };

  const logout = () => {
    clearAuthSession(getBrowserStorages());
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      register,
      logout,
    }),
    [user, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
