import { api } from "./api";

export const getMyAppointments = async () => {
  return await api.get("/appointments/my");
};

export const bookAppointment = async (data: any) => {
  return await api.post("/appointments", data);
};
