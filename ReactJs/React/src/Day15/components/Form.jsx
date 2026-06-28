import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Field from "./Field.jsx";
import "../styles/form.css";

//Schema validation bằng Yup
const schema = yup.object({
  ten: yup
    .string()
    .required("Vui lòng nhập họ tên")
    .min(2, "Tối thiểu 2 ký tự"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  matKhau: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Tối thiểu 6 ký tự"),
  xacNhan: yup
    .string()
    .oneOf([yup.ref("matKhau")], "Mật khẩu không khớp")
    .required("Bắt buộc"),
  tuoi: yup
    .number()
    .typeError("Phải là số")
    .min(18, "Phải đủ 18 tuổi")
    .required("Bắt buộc"),
});

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(data) {
    // fake gọi API
    await new Promise((r) => setTimeout(r, 1500));
    alert(`Đăng ký thành công!\nTên: ${data.ten}\nEmail: ${data.email}`);
    reset();
  }

  return (
    <div className="wrap">
      <h2>Đăng ký tài khoản</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Họ tên" error={errors.ten?.message}>
          <input {...register("ten")} placeholder="G" />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="g@email.com"
          />
        </Field>

        <Field label="Mật khẩu" error={errors.matKhau?.message}>
          <input
            {...register("matKhau")}
            type="password"
            placeholder="Tối thiểu 6 ký tự"
          />
        </Field>

        <Field label="Xác nhận mật khẩu" error={errors.xacNhan?.message}>
          <input
            {...register("xacNhan")}
            type="password"
            placeholder="Nhập lại mật khẩu"
          />
        </Field>

        <Field label="Tuổi" error={errors.tuoi?.message}>
          <input {...register("tuoi")} type="number" placeholder="18" />
        </Field>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}
