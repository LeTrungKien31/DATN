import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

import mongoose from "mongoose";

process.env.NODE_ENV = "test";
process.env.MONGODB_URI =
  "mongodb://127.0.0.1:27017/english_assessment_ai_test_service";
process.env.JWT_SECRET = "test_secret_that_is_long_enough_for_auth_tests";
process.env.JWT_EXPIRES_IN = "7d";

let User;
let loginUser;
let registerUser;
let verifyAccessToken;
let validateLogin;
let validateRegister;

const runValidation = (middleware, body) => {
  let responseStatus;
  let responseBody;
  let nextCalled = false;
  const req = { body };
  const res = {
    status(statusCode) {
      responseStatus = statusCode;
      return this;
    },
    json(payload) {
      responseBody = payload;
      return this;
    },
  };

  middleware(req, res, () => {
    nextCalled = true;
  });

  return { req, responseStatus, responseBody, nextCalled };
};

before(async () => {
  ({ default: User } = await import("../src/models/user.model.js"));
  ({ loginUser, registerUser } = await import(
    "../src/services/auth.service.js"
  ));
  ({ verifyAccessToken } = await import("../src/utils/jwt.js"));
  ({ validateLogin, validateRegister } = await import(
    "../src/validators/auth.validator.js"
  ));

  await mongoose.connect(process.env.MONGODB_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
});

after(async () => {
  if (User) {
    await User.deleteMany({});
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

test("auth service registers a STUDENT with normalized email and safe output", async () => {
  const result = await registerUser({
    fullName: "  Nguyễn Văn An  ",
    email: "  AN@example.com ",
    password: "StrongPass123",
    role: "ADMIN",
  });

  assert.equal(result.user.fullName, "Nguyễn Văn An");
  assert.equal(result.user.email, "an@example.com");
  assert.equal(result.user.role, "STUDENT");
  assert.equal("passwordHash" in result.user, false);
  assert.equal(typeof result.token, "string");

  const storedUser = await User.findOne({ email: "an@example.com" }).select(
    "+passwordHash",
  );
  assert.ok(storedUser.passwordHash.startsWith("$2"));
  assert.notEqual(storedUser.passwordHash, "StrongPass123");

  const payload = verifyAccessToken(result.token);
  assert.equal(payload.sub, storedUser.id);
  assert.equal(payload.role, "STUDENT");
  assert.ok(payload.exp > payload.iat);
});

test("auth service rejects duplicate normalized email with conflict", async () => {
  await registerUser({
    fullName: "First User",
    email: "student@example.com",
    password: "StrongPass123",
  });

  await assert.rejects(
    registerUser({
      fullName: "Second User",
      email: " STUDENT@example.com ",
      password: "StrongPass123",
    }),
    (error) =>
      error.statusCode === 409 && error.message === "Email đã được sử dụng",
  );
});

test("auth service allows only one of two concurrent registrations", async () => {
  const attempts = await Promise.allSettled([
    registerUser({
      fullName: "Concurrent One",
      email: "same@example.com",
      password: "StrongPass123",
    }),
    registerUser({
      fullName: "Concurrent Two",
      email: "same@example.com",
      password: "StrongPass123",
    }),
  ]);

  assert.equal(
    attempts.filter((attempt) => attempt.status === "fulfilled").length,
    1,
  );
  const rejected = attempts.find((attempt) => attempt.status === "rejected");
  assert.equal(rejected.reason.statusCode, 409);
  assert.equal(await User.countDocuments({ email: "same@example.com" }), 1);
});

test("auth service logs in with valid credentials", async () => {
  await registerUser({
    fullName: "Student User",
    email: "student@example.com",
    password: "StrongPass123",
  });

  const result = await loginUser({
    email: " STUDENT@example.com ",
    password: "StrongPass123",
  });

  assert.equal(result.user.email, "student@example.com");
  assert.equal("passwordHash" in result.user, false);
  assert.equal(typeof result.token, "string");
});

test("auth service uses the same error for unknown email and wrong password", async () => {
  await registerUser({
    fullName: "Student User",
    email: "student@example.com",
    password: "StrongPass123",
  });

  const attempts = [
    loginUser({ email: "missing@example.com", password: "StrongPass123" }),
    loginUser({ email: "student@example.com", password: "WrongPassword" }),
  ];

  for (const attempt of attempts) {
    await assert.rejects(
      attempt,
      (error) =>
        error.statusCode === 401 &&
        error.message === "Email hoặc mật khẩu không chính xác",
    );
  }
});

test("auth service rejects an inactive user", async () => {
  await registerUser({
    fullName: "Inactive User",
    email: "inactive@example.com",
    password: "StrongPass123",
  });
  await User.updateOne(
    { email: "inactive@example.com" },
    { $set: { isActive: false } },
  );

  await assert.rejects(
    loginUser({
      email: "inactive@example.com",
      password: "StrongPass123",
    }),
    (error) =>
      error.statusCode === 403 &&
      error.message === "Tài khoản đã bị vô hiệu hóa",
  );
});

test("register validation rejects short passwords and strips unknown fields", () => {
  const invalid = runValidation(validateRegister, {
    fullName: "Student User",
    email: "student@example.com",
    password: "short",
    role: "ADMIN",
  });

  assert.equal(invalid.responseStatus, 422);
  assert.equal(invalid.responseBody.success, false);
  assert.equal(invalid.responseBody.errors[0].field, "password");
  assert.equal(invalid.nextCalled, false);

  const valid = runValidation(validateRegister, {
    fullName: " Student User ",
    email: " STUDENT@example.com ",
    password: "StrongPass123",
    role: "ADMIN",
  });

  assert.equal(valid.nextCalled, true);
  assert.deepEqual(valid.req.body, {
    fullName: "Student User",
    email: "student@example.com",
    password: "StrongPass123",
  });
});

test("auth validation rejects passwords above bcrypt's 72-byte limit", () => {
  const oversizedAscii = "x".repeat(73);
  const oversizedUnicode = "🔐".repeat(19);

  for (const password of [oversizedAscii, oversizedUnicode]) {
    const registration = runValidation(validateRegister, {
      fullName: "Student User",
      email: "student@example.com",
      password,
    });
    const login = runValidation(validateLogin, {
      email: "student@example.com",
      password,
    });

    assert.equal(registration.responseStatus, 422);
    assert.equal(registration.responseBody.errors[0].field, "password");
    assert.equal(login.responseStatus, 422);
    assert.equal(login.responseBody.errors[0].field, "password");
  }

  const boundaryPassword = "🔐".repeat(18);
  assert.equal(
    runValidation(validateRegister, {
      fullName: "Student User",
      email: "student@example.com",
      password: boundaryPassword,
    }).nextCalled,
    true,
  );
  assert.equal(
    runValidation(validateLogin, {
      email: "student@example.com",
      password: boundaryPassword,
    }).nextCalled,
    true,
  );
});
