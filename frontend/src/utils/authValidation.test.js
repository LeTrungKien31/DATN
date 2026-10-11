import assert from "node:assert/strict";
import test from "node:test";

import {
  validateLogin,
  validateRegister,
} from "./authValidation.js";

test("validateLogin requires a correctly formatted email and password", () => {
  assert.deepEqual(validateLogin({ email: "", password: "" }), {
    email: "Vui lòng nhập email",
    password: "Vui lòng nhập mật khẩu",
  });
  assert.deepEqual(
    validateLogin({ email: "invalid-email", password: "secret" }),
    { email: "Email không hợp lệ" },
  );
  assert.deepEqual(
    validateLogin({ email: "student@example.com", password: "secret" }),
    {},
  );
});

test("validateRegister enforces all registration requirements", () => {
  assert.deepEqual(
    validateRegister({
      fullName: " ",
      email: "invalid",
      password: "short",
      confirmPassword: "different",
      acceptTerms: false,
    }),
    {
      fullName: "Vui lòng nhập họ và tên",
      email: "Email không hợp lệ",
      password: "Mật khẩu phải có ít nhất 8 ký tự",
      confirmPassword: "Mật khẩu xác nhận không khớp",
      acceptTerms: "Bạn cần đồng ý với điều khoản sử dụng",
    },
  );

  assert.deepEqual(
    validateRegister({
      fullName: "Nguyễn Minh Anh",
      email: "student@example.com",
      password: "StrongPass123",
      confirmPassword: "StrongPass123",
      acceptTerms: true,
    }),
    {},
  );
});

test("validation enforces the name range and bcrypt byte limit", () => {
  const tooLong = "🔐".repeat(19);
  const registration = validateRegister({
    fullName: "A",
    email: "student@example.com",
    password: tooLong,
    confirmPassword: tooLong,
    acceptTerms: true,
  });
  const login = validateLogin({
    email: "student@example.com",
    password: tooLong,
  });

  assert.ok(registration.fullName);
  assert.ok(registration.password);
  assert.ok(login.password);

  const boundaryPassword = "🔐".repeat(18);
  assert.deepEqual(
    validateLogin({
      email: "student@example.com",
      password: boundaryPassword,
    }),
    {},
  );
});
