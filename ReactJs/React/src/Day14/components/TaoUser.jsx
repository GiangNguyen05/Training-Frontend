import { useState } from "react";
import userService from "../api/services/userService.js";

//POST
export default function TaoUser() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [ketQua, setKetQua] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setKetQua(null);

    try {
      const res = await userService.create(form);
      setKetQua(res.data);
      setForm({ name: "", email: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Tạo thất bại");
    } finally {
      setLoading(false); // Luôn tắt loading dù thành công hay thất bại
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        placeholder="Họ tên *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email *"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {error && <p className="status error">{error}</p>}
      {ketQua && (
        <p className="status success">
          ✅ Đã tạo: {ketQua.name} (ID: {ketQua.id})
        </p>
      )}
      <button type="submit" disabled={loading || !form.name || !form.email}>
        {loading ? "Đang tạo..." : "Tạo user"}
      </button>
    </form>
  );
}
