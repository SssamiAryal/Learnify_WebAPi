"use server";

import { login, register } from "../api/auth.api";
import { setTokenCookie } from "../cookies";

export async function registerUser(data: any) {
  try {
    const result = await register(data);

    return result.success
      ? { success: true, data: result.data, message: result.message }
      : { success: false, message: result.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function loginUser(data: any) {
  try {
    const result = await login(data);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    await setTokenCookie(result.data.token);

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}