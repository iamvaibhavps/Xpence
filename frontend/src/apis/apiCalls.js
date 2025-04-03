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

// ----------------------- NOTIFICATION APIS ------------------------- //

export const getAllNotifications = async () => {
  const response = await api.get("/notifications/all");
  return response;
};

export const readNotification = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response;
};

// ----------------------- TRANSACTION APIS ------------------------- //

export const createTransaction = async (transactionData) => {
  const response = await api.post("/transactions", transactionData);
  return response;
};

export const getAllTransactions = async () => {
  const response = await api.get("/transactions/all");
  return response;
};

export const getUserTransactions = async () => {
  const response = await api.get("/transactions/user");
  return response;
};

export const getTransactionById = async (transactionId) => {
  const response = await api.get(`/transactions/${transactionId}`);
  return response;
};

export const updateTransaction = async (transactionId, transactionData) => {
  const response = await api.put(`/transactions/${transactionId}`, transactionData);
  return response;
};

export const deleteTransaction = async (transactionId) => {
  const response = await api.delete(`/transactions/${transactionId}`);
  return response;
};
