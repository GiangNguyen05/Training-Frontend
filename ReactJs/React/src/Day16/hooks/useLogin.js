import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/login.schema";
import { login } from "../services/auth.service";
export function useLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const submit = handleSubmit(async (data) => {
    try {
      const result = await login(data);
      localStorage.setItem("token", result.token);
      alert("Login success");
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  });
  return {
    register,
    submit,
    errors,
    isSubmitting,
    isValid,
  };
}
