import api from "../axiosInstance.js";

const userService = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default userService;
