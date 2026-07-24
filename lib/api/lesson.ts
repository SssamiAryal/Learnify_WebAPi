import axiosInstance from "./axios-instance";

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

export const getLessonById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/lessons/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch lesson"
    );
  }
};