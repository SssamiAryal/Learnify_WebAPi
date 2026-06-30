export const API = {
  ADMIN: {
    USERS: {
      GET_ALL: "/api/v1/admin/users",
      CREATE: "/api/v1/admin/users",
      GET_BY_ID: (id: string) => `/api/v1/admin/users/${id}`,
      UPDATE: (id: string) => `/api/v1/admin/users/${id}`,
      DELETE: (id: string) => `/api/v1/admin/users/${id}`,
    },
  },

  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    WHOAMI: "/api/v1/auth/whoami",
    UPDATE: "/api/v1/auth/update",
    UPDATE_PASSWORD: "/api/v1/auth/update-password",
  },
};