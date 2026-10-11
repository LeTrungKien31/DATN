export const AUTH_TOKEN_KEY = "accessToken";
export const AUTH_USER_KEY = "authUser";

const SAFE_ROLES = new Set(["STUDENT", "TEACHER", "ADMIN"]);

export const isSafeUser = (user) => Boolean(
  user &&
  typeof user.id === "string" && user.id.trim() &&
  typeof user.fullName === "string" && user.fullName.trim() &&
  typeof user.email === "string" && user.email.trim() &&
  SAFE_ROLES.has(user.role),
);

export const isValidAuthSession = (session) => Boolean(
  session &&
  typeof session.token === "string" &&
  session.token.trim() &&
  session.token !== "undefined" &&
  session.token !== "null" &&
  isSafeUser(session.user),
);

const clearStorage = (storage) => {
  storage.removeItem(AUTH_TOKEN_KEY);
  storage.removeItem(AUTH_USER_KEY);
};

export const clearAuthSession = ({ localStorage, sessionStorage }) => {
  clearStorage(localStorage);
  clearStorage(sessionStorage);
};

export const readAuthSession = ({ localStorage, sessionStorage }) => {
  for (const storage of [localStorage, sessionStorage]) {
    const token = storage.getItem(AUTH_TOKEN_KEY);
    const storedUser = storage.getItem(AUTH_USER_KEY);

    if (!token && !storedUser) continue;

    try {
      const user = JSON.parse(storedUser);
      const session = { token, user };
      if (!isValidAuthSession(session)) throw new Error("Invalid auth session");
      return session;
    } catch {
      clearStorage(storage);
    }
  }

  return null;
};

export const writeAuthSession = (session, remember, { localStorage, sessionStorage }) => {
  if (!isValidAuthSession(session)) {
    throw new Error("Invalid auth session");
  }
  clearAuthSession({ localStorage, sessionStorage });
  const targetStorage = remember ? localStorage : sessionStorage;
  targetStorage.setItem(AUTH_TOKEN_KEY, session.token);
  targetStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
};
