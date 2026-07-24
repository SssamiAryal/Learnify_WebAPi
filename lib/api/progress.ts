import axiosInstance from "./axios-instance";

export const completeLesson = async (lessonId: string) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/progress/complete",
      {
        lessonId,
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to complete lesson"
    );
  }
};

export const getMyProgress = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/v1/progress/my-progress"
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch progress"
    );
  }
};