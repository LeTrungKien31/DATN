import User from "../models/user.model.js";
import { signAccessToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";

const createServiceError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

const serializeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
});

const createAuthResult = (user) => ({
  user: serializeUser(user),
  token: signAccessToken({ userId: user.id, role: user.role }),
});

export const registerUser = async ({ fullName, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.exists({ email: normalizedEmail });

  if (existingUser) {
    throw createServiceError(409, "Email đã được sử dụng");
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "STUDENT",
    });

    return createAuthResult(user);
  } catch (error) {
    if (error?.code === 11000) {
      throw createServiceError(409, "Email đã được sử dụng");
    }
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+passwordHash",
  );

  if (!user) {
    throw createServiceError(401, "Email hoặc mật khẩu không chính xác");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw createServiceError(401, "Email hoặc mật khẩu không chính xác");
  }

  if (!user.isActive) {
    throw createServiceError(403, "Tài khoản đã bị vô hiệu hóa");
  }

  return createAuthResult(user);
};
