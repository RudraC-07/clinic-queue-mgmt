import { api } from "./api";

export const getClinicInfo = async () => {
  return await api.get("/admin/clinic");
};

export const getUsers = async () => {
  return await api.get("/admin/users");
};

export const createUser = async (data: any) => {
  return await api.post("/admin/users", data);
};
