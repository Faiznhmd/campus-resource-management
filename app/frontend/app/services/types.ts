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

export interface ProfileFormValues {
  name: string;
  email: string;
  password?: string;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  location?: string;
  description?: string;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
  maxDuration?: number;
  requiresApproval?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateResourceInput {
  name: string;
  type: string;
  location?: string;
  description?: string;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
  maxDuration?: number;
  requiresApproval?: boolean;
}

export interface UpdateResourceInput {
  name?: string;
  type?: string;
  location?: string;
  description?: string;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
  maxDuration?: number;
  requiresApproval?: boolean;
}
