import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

import mongoose from "mongoose";

process.env.NODE_ENV = "test";
process.env.MONGODB_URI =
  "mongodb://127.0.0.1:27017/english_assessment_ai_test_api";
process.env.JWT_SECRET = "test_secret_that_is_long_enough_for_api_tests";
process.env.JWT_EXPIRES_IN = "7d";

let app;
let baseUrl;
let server;
let User;

const postJson = async (path, body) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
};

const postRaw = async (path, body, contentType = "application/json") => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body,
  });

  return {
    status: response.status,
    body: await response.json(),
  };
};

const validRegistration = {
  fullName: "Nguyễn Minh Anh",
  email: "minhanh@example.com",
  password: "StrongPass123",
};

before(async () => {
  ({ default: app } = await import("../src/app.js"));
  ({ default: User } = await import("../src/models/user.model.js"));
  await mongoose.connect(process.env.MONGODB_URI);

  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

beforeEach(async () => {
  await User.deleteMany({});
});

after(async () => {
  if (User) {
    await User.deleteMany({});
  }
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

test("POST /api/auth/register creates a safe student account", async () => {
  const response = await postJson("/api/auth/register", {
    ...validRegistration,
    role: "ADMIN",
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.role, "STUDENT");
  assert.equal(response.body.data.user.email, "minhanh@example.com");
  assert.equal("passwordHash" in response.body.data.user, false);
  assert.equal(typeof response.body.data.token, "string");
});

test("POST /api/auth/register validates payload and rejects duplicate email", async () => {
  const invalid = await postJson("/api/auth/register", {
    fullName: "A",
    email: "not-an-email",
    password: "short",
  });
  assert.equal(invalid.status, 422);
  assert.equal(invalid.body.success, false);
  assert.equal(invalid.body.errors.length, 3);

  await postJson("/api/auth/register", validRegistration);
  const duplicate = await postJson("/api/auth/register", {
    ...validRegistration,
    email: " MINHANH@example.com ",
  });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.message, "Email đã được sử dụng");
});

test("POST /api/auth/login authenticates valid credentials", async () => {
  await postJson("/api/auth/register", validRegistration);
  const response = await postJson("/api/auth/login", {
    email: validRegistration.email,
    password: validRegistration.password,
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.email, validRegistration.email);
  assert.equal(typeof response.body.data.token, "string");
});

test("POST /api/auth/login returns safe errors for invalid and inactive users", async () => {
  await postJson("/api/auth/register", validRegistration);

  const invalid = await postJson("/api/auth/login", {
    email: validRegistration.email,
    password: "WrongPassword",
  });
  assert.equal(invalid.status, 401);
  assert.equal(invalid.body.message, "Email hoặc mật khẩu không chính xác");

  await User.updateOne(
    { email: validRegistration.email },
    { $set: { isActive: false } },
  );
  const inactive = await postJson("/api/auth/login", {
    email: validRegistration.email,
    password: validRegistration.password,
  });
  assert.equal(inactive.status, 403);
  assert.equal(inactive.body.message, "Tài khoản đã bị vô hiệu hóa");
});

test("auth endpoints return validation errors for missing request bodies", async () => {
  for (const path of ["/api/auth/register", "/api/auth/login"]) {
    const response = await fetch(`${baseUrl}${path}`, { method: "POST" });
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.success, false);
    assert.ok(body.errors.length >= 2);
  }
});

test("malformed JSON never echoes submitted secrets", async () => {
  const secret = "SYNTHETIC_PASSWORD_MARKER";
  const response = await postRaw(
    "/api/auth/login",
    `{"email":"student@example.com","password":${secret}}`,
  );

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Yêu cầu không hợp lệ");
  assert.equal(JSON.stringify(response.body).includes(secret), false);
  assert.equal("stack" in response.body, false);
});
