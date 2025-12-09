export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token: string; // ✔ CORRECT NAME
  user: User;
}
export interface User {
  id: number; // Prisma integer ID
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}
