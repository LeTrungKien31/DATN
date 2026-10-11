import { useState } from "react";

import AuthInput from "./AuthInput.jsx";

const EyeIcon = ({ hidden }) => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
    {hidden && <path d="m4 4 16 16" />}
  </svg>
);

const PasswordInput = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AuthInput
      {...props}
      icon="lock"
      type={isVisible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <EyeIcon hidden={isVisible} />
        </button>
      }
    />
  );
};

export default PasswordInput;
