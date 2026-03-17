import { api } from "./api";

export const loginService = async (data: any): Promise<any> => {
  return await api.post("/auth/login", data);
};
