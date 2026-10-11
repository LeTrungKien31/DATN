const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PASSWORD_BYTES = 72;
const passwordBytes = (password) => new TextEncoder().encode(password).length;

export const validateLogin = ({ email, password }) => {
  const errors = {};
  const normalizedEmail = email.trim();

  if (!normalizedEmail) errors.email = "Vui lòng nhập email";
  else if (!EMAIL_PATTERN.test(normalizedEmail)) errors.email = "Email không hợp lệ";
  if (!password) errors.password = "Vui lòng nhập mật khẩu";
  else if (passwordBytes(password) > MAX_PASSWORD_BYTES) {
    errors.password = "Mật khẩu không được vượt quá 72 byte";
  }

  return errors;
};

export const validateRegister = ({ fullName, email, password, confirmPassword, acceptTerms }) => {
  const errors = {};
  const normalizedEmail = email.trim();

  const normalizedFullName = fullName.trim();
  if (!normalizedFullName) errors.fullName = "Vui lòng nhập họ và tên";
  else if (normalizedFullName.length < 2 || normalizedFullName.length > 100) {
    errors.fullName = "Họ và tên phải có từ 2 đến 100 ký tự";
  }
  if (!normalizedEmail) errors.email = "Vui lòng nhập email";
  else if (!EMAIL_PATTERN.test(normalizedEmail)) errors.email = "Email không hợp lệ";
  if (password.length < 8) errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
  else if (passwordBytes(password) > MAX_PASSWORD_BYTES) {
    errors.password = "Mật khẩu không được vượt quá 72 byte";
  }
  if (confirmPassword !== password) errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  if (!acceptTerms) errors.acceptTerms = "Bạn cần đồng ý với điều khoản sử dụng";

  return errors;
};
