import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import LoginInput from "./LoginInput.jsx";
import "../styles/login.css";

export default function LoginForm() {
  const { register, submit, errors, isValid, isSubmitting } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <form className="form" onSubmit={submit}>
        <h2>Login</h2>

        <LoginInput
          name="email"
          label="Email"
          type="email"
          register={register}
          error={errors.email?.message}
        />

        <LoginInput
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          register={register}
          error={errors.password?.message}
        />

        <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? "Hide password" : "Show password"}
        </button>

        {errors.root && <p className="server-error">{errors.root.message}</p>}

        <button
          type="submit"
          className="submit"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
