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
  const response = await api.post("/auth/forgot-password", userData);
  return response;
};
export const resetPassword = async (data) => {
  return await api.post("/auth/reset-password", data);
};

// ----------------------- USER APIS ------------------------- //

export const getDashboardInfo = async (userId, filterTimeRange) => {
  const response = await api.get(
    `/users/get-dashboard-info/${userId}?filterTimeRange=${filterTimeRange}`
  );
  return response;
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
  const response = await api.post("/transactions/create", transactionData);
  return response;
};

export const getAllTransaction = async () => {
  const response = await api.get("/transactions/all");
  return response;
};

export const getTransaction = async (transactionId) => {
  const response = await api.get(`/transactions/get-single/${transactionId}`);
  return response;
};

// ----------------------- GROUP APIS ------------------------- //

export const createGroup = async (groupData) => {
  const response = await api.post("/groups/create", groupData);
  return response;
};

export const updateGroup = async (groupId, groupData) => {
  const response = await api.put(`/groups/update/${groupId}`, groupData);
  return response;
};

export const getAllGroups = async () => {
  const response = await api.get("/groups/all");
  return response;
};

export const getGroupSplits = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/splits`);
  return response;
};

export const getGroupTransactions = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/transactions`);
  return response;
};

export const deleteGroup = async (groupId) => {
  const response = await api.delete(`/groups/${groupId}/delete`);
  return response;
};

// ----------------------- USER APIS ------------------------- //

export const getAllUsersPhoneNumbers = async () => {
  const response = await api.get("/users/get-all-users-phone");
  return response;
};

// ----------------------- SPLIT APIS ------------------------- //

export const createSplitTransaction = async (splitData) => {
  const response = await api.post("/splits/create", splitData);
  return response;
};

export const updateSplitPaymentStatus = async (paymentData) => {
  const response = await api.put("/splits/update-payment-status", paymentData);
  return response;
};

export const getAllSplits = async () => {
  const response = await api.get("/splits/all");
  return response;
};

export const getSplitById = async (splitId) => {
  const response = await api.get(`/splits/${splitId}`);
  return response;
};


// ----------------------- CHAT APIS ------------------------- //

export const createChat = async (chatData) => {
  const response = await api.post("/chats/create-chat", chatData);
  return response;
};

export const sendMessage = async (messageData) => {
  const response = await api.post("/chats/send-message", messageData);
  return response;
};

export const getAllMessages = async (chatId, currentUser) => {
  const response = await api.get(
    `/chats/get-all-messages/${chatId}?userId=${currentUser.id}`
  );
  return response;
};

export const deleteAllMessages = async (chatId) => {
  // console.log("chatId: ", chatId);
  const response = await api.post("/chats/delete-all-messages", { chatId });
  return response;
};