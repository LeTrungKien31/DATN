const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PASSWORD_BYTES = 72;

const exceedsPasswordByteLimit = (password) =>
  Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES;

const sendValidationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: "Dữ liệu không hợp lệ",
    errors,
  });
};

export const validateRegister = (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const fullName =
    typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  const password =
    typeof body.password === "string" ? body.password : "";
  const errors = [];

  if (fullName.length < 2 || fullName.length > 100) {
    errors.push({
      field: "fullName",
      message: "Họ và tên phải có từ 2 đến 100 ký tự",
    });
  }
  if (!EMAIL_PATTERN.test(email)) {
    errors.push({ field: "email", message: "Email không hợp lệ" });
  }
  if (password.length < 8) {
    errors.push({
      field: "password",
      message: "Mật khẩu phải có ít nhất 8 ký tự",
    });
  } else if (exceedsPasswordByteLimit(password)) {
    errors.push({
      field: "password",
      message: "Mật khẩu không được vượt quá 72 byte",
    });
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  req.body = { fullName, email, password };
  return next();
};

export const validateLogin = (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  const password =
    typeof body.password === "string" ? body.password : "";
  const errors = [];

  if (!EMAIL_PATTERN.test(email)) {
    errors.push({ field: "email", message: "Email không hợp lệ" });
  }
  if (!password) {
    errors.push({ field: "password", message: "Vui lòng nhập mật khẩu" });
  } else if (exceedsPasswordByteLimit(password)) {
    errors.push({
      field: "password",
      message: "Mật khẩu không được vượt quá 72 byte",
    });
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  req.body = { email, password };
  return next();
};
