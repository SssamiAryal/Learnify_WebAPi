import axios from "axios";

const API_URL = "http://localhost:8088/api/v1/auth";

export const register = async (data: any) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      data
    );

    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      "Registration Failed"
    );
  }
};

export const login = async (data: any) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      data
    );

    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      "Login Failed"
    );
  }
};