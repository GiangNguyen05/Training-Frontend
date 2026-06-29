import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().min(1, "Email bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(6, "Password tối thiểu 6 ký tự"),
});
