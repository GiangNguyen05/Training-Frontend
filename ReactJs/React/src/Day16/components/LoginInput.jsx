export default function LoginInput({
  name,
  label,
  type = "text",
  register,
  error,
}) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} {...register(name)} />
      {error && <p>{error}</p>}
    </div>
  );
}
