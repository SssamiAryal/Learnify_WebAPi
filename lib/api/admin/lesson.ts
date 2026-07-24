import axiosInstance from "../axios-instance";

export const getAllLessons = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/lessons");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch lessons"
    );
  }
};

export const createLesson = async (data: any) => {
  try {
    const response = await axiosInstance.post("/api/v1/lessons", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to create lesson"
    );
  }
};

export const updateLesson = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/api/v1/lessons/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update lesson"
    );
  }
};

export const deleteLesson = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/lessons/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete lesson"
    );
  }
};