import { api } from "./api";

export const getDoctorQueue = async () => {
  return await api.get("/doctor/queue");
};
