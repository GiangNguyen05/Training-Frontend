import { useState, useEffect } from "react";
import "./styles/useEffect.css";

function UseEffectApp() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Gọi API + AbortController (race condition) + cleanup
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
          {
            signal: controller.signal,
          },
        );

        // Kiểm tra nếu có lỗi từ phía server
        if (!res.ok) {
          throw new Error("Không tìm thấy dữ liệu người dùng.");
        }

        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        // Chỉ xử lý lỗi nếu request không phải do AbortController hủy bỏ
        if (err.name !== "AbortError") {
          setError(err.message || "Không tải được dữ liệu.");
          setLoading(false);
        }
      }
    };
    fetchData();
    // Hủy request nếu userId đổi trước khi API kịp phản hồi
    return () => controller.abort();
  }, [userId]);

  // Đồng bộ document.title với dữ liệu
  useEffect(() => {
    document.title = user ? `👤 ${user.name}` : "Loading...";
  }, [user]);

  return (
    <div className="card">
      <h2>UseEffectApp</h2>

      <div className="btns">
        {[4, 5, 6].map((id) => (
          <button
            key={id}
            className={userId === id ? "active" : ""}
            onClick={() => setUserId(id)}
          >
            User {id}
          </button>
        ))}
      </div>

      {loading && <p className="muted">Đang tải...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && user && (
        <div className="info">
          <p>
            <strong>Tên:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Website:</strong> {user.website}
          </p>
        </div>
      )}
    </div>
  );
}

export default UseEffectApp;
