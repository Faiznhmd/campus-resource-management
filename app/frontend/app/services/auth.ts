import api from './api';
import { RegisterPayload, LoginPayload, AuthResponse } from './types';

export const registerUser = async (
  data: RegisterPayload
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/register', data);
  return res.data;
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
};
