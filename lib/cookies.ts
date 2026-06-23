"use server";

import { cookies } from "next/headers";

export const setTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    path: "/",
  });
};

export const getTokenCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
};