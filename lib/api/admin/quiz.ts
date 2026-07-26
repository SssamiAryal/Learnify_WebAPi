import axiosInstance from "../axios-instance";


export const createQuiz = async (quizData:any)=>{
  const response = await axiosInstance.post(
    "/api/v1/quizzes",
    quizData
  );

  return response.data;
};


export const getQuizByLesson = async(lessonId:string)=>{
  const response = await axiosInstance.get(
    `/api/v1/quizzes/${lessonId}`
  );

  return response.data;
};


export const deleteQuiz = async(id:string)=>{
  const response = await axiosInstance.delete(
    `/api/v1/quizzes/${id}`
  );

  return response.data;
};


export const updateQuiz = async(
 id:string,
 quizData:any
)=>{
  const response = await axiosInstance.put(
    `/api/v1/quizzes/${id}`,
    quizData
  );

  return response.data;
};


export const submitQuiz = async(data:any)=>{
  const response = await axiosInstance.post(
    "/api/v1/quizzes/submit",
    data
  );

  return response.data;
};
export const getMyQuizResults = async () => {
  const response = await axiosInstance.get("/api/v1/quizzes/my/results");
  return response.data;
};