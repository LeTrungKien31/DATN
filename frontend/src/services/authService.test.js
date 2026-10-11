import assert from "node:assert/strict";
import test from "node:test";

import {
  getAuthErrorMessage,
  getAuthFieldErrors,
  parseAuthSessionData,
} from "./authService.js";

test("getAuthErrorMessage preserves safe authentication messages", () => {
  const error = {
    response: {
      status: 401,
      data: { message: "Email hoặc mật khẩu không chính xác" },
    },
  };

  assert.equal(
    getAuthErrorMessage(error),
    "Email hoặc mật khẩu không chính xác",
  );
});

test("getAuthErrorMessage hides technical and network errors", () => {
  assert.equal(
    getAuthErrorMessage({
      response: {
        status: 500,
        data: { message: "MongoServerError: duplicate key" },
      },
    }),
    "Hệ thống đang bận. Vui lòng thử lại sau.",
  );
  assert.equal(
    getAuthErrorMessage({ request: {} }),
    "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
  );
});

test("getAuthErrorMessage hides technical details even for validation statuses", () => {
  assert.equal(
    getAuthErrorMessage({
      response: {
        status: 422,
        data: { message: "MongoServerError: E11000 duplicate key" },
      },
    }),
    "Hệ thống đang bận. Vui lòng thử lại sau.",
  );
});

test("getAuthErrorMessage rejects untrusted 4xx messages", () => {
  assert.equal(
    getAuthErrorMessage({
      response: {
        status: 400,
        data: { message: "Unexpected token SYNTHETIC_PASSWORD_MARKER in JSON" },
      },
    }),
    "Hệ thống đang bận. Vui lòng thử lại sau.",
  );
});

test("parseAuthSessionData rejects incomplete successful responses", () => {
  assert.throws(
    () => parseAuthSessionData({ user: { id: "1", fullName: "A", email: "a@example.com", role: "STUDENT" } }),
    (error) => error.code === "INVALID_AUTH_RESPONSE",
  );
});

test("getAuthFieldErrors accepts only trusted validation fields", () => {
  assert.deepEqual(
    getAuthFieldErrors({
      response: {
        status: 422,
        data: {
          errors: [
            { field: "fullName", message: "Họ và tên phải có từ 2 đến 100 ký tự" },
            { field: "role", message: "Do not show this" },
          ],
        },
      },
    }),
    { fullName: "Họ và tên phải có từ 2 đến 100 ký tự" },
  );
});
