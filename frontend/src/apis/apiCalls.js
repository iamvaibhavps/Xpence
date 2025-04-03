import { api } from "./apiConfig";
// ----------------------- AUTH APIS ------------------------- //

export const registerUser = async (userData) => {
  const response = await api.post("/auth/sign-up", userData);
  return response;
};
export const loginUser = async (userData) => {
  const response = await api.post("/auth/sign-in", userData);
  return response;
};
export const forgotPassword = async (userData) => {
  // Updated to match the backend route
  const response = await api.post("/auth/forgot-password", userData);
  return response;
};
export const resetPassword = async (data) => {
  return await api.post("/auth/reset-password", data);
};
