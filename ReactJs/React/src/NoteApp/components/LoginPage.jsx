import { useState } from "react";
import { useForm } from "react-hook-form";
import { StickyNote, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    // Giả lập network delay 500ms
    await new Promise((r) => setTimeout(r, 500));
    const result = login(data);
    if (!result.ok) {
      setServerError(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-brand">
          <StickyNote size={30} />
          <span>Notes</span>
        </div>
        <p className="login-sub">Đăng nhập để xem ghi chú của bạn</p>

        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Username */}
          <div className="field">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              className={errors.username ? "has-error" : ""}
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
              {...register("username", {
                required: "Vui lòng nhập tên đăng nhập",
                minLength: { value: 3, message: "Tối thiểu 3 ký tự" },
              })}
            />
            {errors.username && (
              <span className="error-text">{errors.username.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={errors.password ? "has-error" : ""}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
                })}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>

          {/* Server / credential error */}
          {serverError && <div className="server-error">{serverError}</div>}

          <button
            type="submit"
            className="btn primary login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="spinner" /> : <>Đăng nhập</>}
          </button>
        </form>
      </div>
    </div>
  );
}
