import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
// Tài khoản demo cứng
const DEMO_ACCOUNTS = [{ username: "Giang", password: "000000" }];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Trả về { ok: true, user } nếu thành công,
  // hoặc { ok: false, message } nếu sai thông tin.

  const login = ({ username, password }) => {
    const matched = DEMO_ACCOUNTS.find(
      (acc) => acc.username === username && acc.password === password,
    );
    if (matched) {
      const userData = { username: matched.username };
      setUser(userData);
      return { ok: true, user: userData };
    }
    return { ok: false, message: "Tên đăng nhập hoặc mật khẩu không đúng." };
  };

  const logout = () => setUser(null);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong <AuthProvider>");
  return ctx;
}
