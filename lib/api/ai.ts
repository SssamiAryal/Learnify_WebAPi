import axiosInstance from "./axios-instance";

export const sendMessageToAI = async (message: string) => {
  const response = await axiosInstance.post("/api/v1/ai/chat", {
    message,
  });

  return response.data;
};