"use server";

import { login, register } from "../api/auth.api";
import { setTokenCookie } from "../cookies";

export async function registerUser(data: any) {
  try {
    const result = await register(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function loginUser(data: any) {
  try {
    const result = await login(data);

    if (result.success) {
      const token = result.data.token;

      await setTokenCookie(token);

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}