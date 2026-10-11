import assert from "node:assert/strict";
import test from "node:test";

import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from "./authStorage.js";

const createStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
};

const createStorages = () => ({
  localStorage: createStorage(),
  sessionStorage: createStorage(),
});

const session = {
  token: "signed-token",
  user: {
    id: "user-id",
    fullName: "Nguyễn Minh Anh",
    email: "student@example.com",
    role: "STUDENT",
  },
};

test("writeAuthSession stores remembered sessions only in local storage", () => {
  const storages = createStorages();
  writeAuthSession(session, true, storages);

  assert.deepEqual(readAuthSession(storages), session);
  assert.equal(storages.sessionStorage.getItem("accessToken"), null);
  assert.equal(storages.localStorage.getItem("accessToken"), "signed-token");
});

test("writeAuthSession stores temporary sessions only in session storage", () => {
  const storages = createStorages();
  writeAuthSession(session, true, storages);
  writeAuthSession(session, false, storages);

  assert.deepEqual(readAuthSession(storages), session);
  assert.equal(storages.localStorage.getItem("accessToken"), null);
  assert.equal(storages.sessionStorage.getItem("accessToken"), "signed-token");
});

test("clearAuthSession removes authentication data from both storages", () => {
  const storages = createStorages();
  writeAuthSession(session, true, storages);
  clearAuthSession(storages);

  assert.equal(readAuthSession(storages), null);
});

test("readAuthSession removes malformed stored user data", () => {
  const storages = createStorages();
  storages.localStorage.setItem("accessToken", "signed-token");
  storages.localStorage.setItem("authUser", "not-json");

  assert.equal(readAuthSession(storages), null);
  assert.equal(storages.localStorage.getItem("accessToken"), null);
});

test("writeAuthSession rejects malformed sessions without replacing the current session", () => {
  const storages = createStorages();
  writeAuthSession(session, true, storages);

  assert.throws(
    () => writeAuthSession({ user: session.user }, false, storages),
    /Invalid auth session/,
  );
  assert.deepEqual(readAuthSession(storages), session);
});
