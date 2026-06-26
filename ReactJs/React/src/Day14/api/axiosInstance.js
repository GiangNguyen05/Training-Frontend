import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 8000,
});

// Request — tự đính token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response — xử lý lỗi tập trung
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      console.error("Lỗi mạng — không thể kết nối server");
    }
    return Promise.reject(err);
  },
);

export default api;
