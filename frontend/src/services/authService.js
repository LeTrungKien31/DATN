import api from "./api.js";
import { isValidAuthSession } from "../utils/authStorage.js";

const SAFE_AUTH_STATUSES = new Set([400, 401, 403, 409, 422]);
const SAFE_AUTH_MESSAGES = new Set([
  "Dữ liệu không hợp lệ",
  "Email đã được sử dụng",
  "Email hoặc mật khẩu không chính xác",
  "Tài khoản đã bị vô hiệu hóa",
  "Yêu cầu không hợp lệ",
]);
const SAFE_FIELD_NAMES = new Set([
  "fullName",
  "email",
  "password",
  "confirmPassword",
  "acceptTerms",
]);
const TECHNICAL_ERROR_PATTERN =
  /mongo(?:server)?error|validationerror|syntaxerror|typeerror|referenceerror|e11000|jwt(?:error)?|stack\s*trace|\bat\s+\S+\s*\(/i;

export const getAuthErrorMessage = (error) => {
  if (error?.code === "INVALID_AUTH_RESPONSE") {
    return "Phản hồi từ máy chủ không hợp lệ. Vui lòng thử lại.";
  }
  if (!error.response) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
  }

  const status = error.response.status;
  const message = error.response.data?.message;

  if (
    SAFE_AUTH_STATUSES.has(status) &&
    typeof message === "string" &&
    SAFE_AUTH_MESSAGES.has(message) &&
    !TECHNICAL_ERROR_PATTERN.test(message)
  ) {
    return message;
  }

  return "Hệ thống đang bận. Vui lòng thử lại sau.";
};

export const getAuthFieldErrors = (error) => {
  if (error?.response?.status !== 422 || !Array.isArray(error.response.data?.errors)) {
    return {};
  }

  return error.response.data.errors.reduce((fieldErrors, item) => {
    if (
      SAFE_FIELD_NAMES.has(item?.field) &&
      typeof item?.message === "string" &&
      item.message.length <= 200 &&
      !TECHNICAL_ERROR_PATTERN.test(item.message)
    ) {
      fieldErrors[item.field] = item.message;
    }
    return fieldErrors;
  }, {});
};

export const parseAuthSessionData = (data) => {
  if (!isValidAuthSession(data)) {
    const error = new Error("Invalid authentication response");
    error.code = "INVALID_AUTH_RESPONSE";
    throw error;
  }
  return data;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return parseAuthSessionData(response.data?.data);
};

const register = async (details) => {
  const response = await api.post("/auth/register", details);
  return parseAuthSessionData(response.data?.data);
};

export default { login, register };
