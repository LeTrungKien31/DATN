import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth.js";
import {
  getAuthErrorMessage,
  getAuthFieldErrors,
} from "../../services/authService.js";
import {
  validateLogin,
  validateRegister,
} from "../../utils/authValidation.js";
import DashboardIcon from "../dashboard/DashboardIcon.jsx";
import AuthInput from "./AuthInput.jsx";
import PasswordInput from "./PasswordInput.jsx";

const loginInitial = { email: "", password: "" };
const registerInitial = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const AuthModal = ({ mode }) => {
  const isLogin = mode === "login";
  const [values, setValues] = useState(isLogin ? loginInitial : registerInitial);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef(null);
  const { login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const closeModal = useCallback(() => {
    window.sessionStorage.setItem("authReturnFocus", mode);
    navigate("/");
  }, [mode, navigate]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), a[href]',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeModal]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = isLogin
      ? validateLogin(values)
      : validateRegister(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setFormError("");
    try {
      if (isLogin) {
        await login(
          {
            email: values.email.trim().toLowerCase(),
            password: values.password,
          },
          remember,
        );
      } else {
        await register({
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });
      }
      const from = location.state?.from;
      const destination = from
        ? `${from.pathname || "/dashboard"}${from.search || ""}${from.hash || ""}`
        : "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      const fieldErrors = getAuthFieldErrors(error);
      setErrors((current) => ({ ...current, ...fieldErrors }));
      setFormError(
        Object.keys(fieldErrors).length > 0 ? "" : getAuthErrorMessage(error),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeMode = (nextMode) => {
    if (nextMode === mode) return;
    navigate(`/${nextMode}`, { state: location.state });
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4 sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Đóng cửa sổ xác thực"
        className="auth-backdrop absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={closeModal}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="auth-panel relative my-auto w-full max-w-lg rounded-3xl border border-white/60 bg-white p-5 shadow-2xl shadow-slate-950/25 sm:p-8"
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          aria-label="Đóng"
        >
          <DashboardIcon name="close" />
        </button>

        <div className="flex items-center gap-3 pr-12">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-700 text-sm font-black text-white">EA</span>
          <div>
            <p className="font-black text-slate-950">English Assessment AI</p>
            <p className="text-xs text-slate-500">Không gian học tập cá nhân</p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          {["login", "register"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => changeMode(item)}
              className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${mode === item ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              {item === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          ))}
        </div>

        <div className="mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            {isLogin ? "Chào mừng trở lại" : "Bắt đầu hành trình"}
          </p>
          <h1 id="auth-modal-title" className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {isLogin ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isLogin
              ? "Tiếp tục lộ trình học tiếng Anh của bạn."
              : "Đăng ký để lưu tiến độ và nhận lộ trình cá nhân hóa."}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          {formError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          {!isLogin && (
            <AuthInput
              id="fullName"
              label="Họ và tên"
              icon="user"
              type="text"
              value={values.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              autoComplete="name"
              error={errors.fullName}
              autoFocus
            />
          )}
          <AuthInput
            id="email"
            label="Email"
            icon="mail"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Nhập email của bạn"
            autoComplete="email"
            error={errors.email}
            autoFocus={isLogin}
          />
          <PasswordInput
            id="password"
            label="Mật khẩu"
            value={values.password}
            onChange={handleChange}
            placeholder={isLogin ? "Nhập mật khẩu" : "Tạo mật khẩu"}
            autoComplete={isLogin ? "current-password" : "new-password"}
            error={errors.password}
          />
          {!isLogin && (
            <PasswordInput
              id="confirmPassword"
              label="Xác nhận mật khẩu"
              value={values.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              error={errors.confirmPassword}
            />
          )}

          {isLogin ? (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600" />
              Ghi nhớ đăng nhập
            </label>
          ) : (
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
                <input name="acceptTerms" type="checkbox" checked={values.acceptTerms} onChange={handleChange} aria-invalid={Boolean(errors.acceptTerms)} aria-describedby={errors.acceptTerms ? "modal-terms-error" : undefined} className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-700 focus:ring-blue-600" />
                <span>Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật.</span>
              </label>
              {errors.acceptTerms && <p id="modal-terms-error" className="mt-1.5 text-sm text-red-600">{errors.acceptTerms}</p>}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-65">
            {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {isSubmitting
              ? isLogin ? "Đang đăng nhập..." : "Đang tạo tài khoản..."
              : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AuthModal;
