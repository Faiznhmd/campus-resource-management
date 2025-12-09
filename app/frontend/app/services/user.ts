import axios from '../services/api';
import type { UserType } from './types';

export const getUsers = async (): Promise<UserType[]> => {
  const res = await axios.get<UserType[]>('/users');
  return res.data;
};

export const updateMyProfile = async (
  data: Partial<UserType>
): Promise<UserType> => {
  const res = await axios.patch<UserType>('/users/me', data);
  return res.data;
};

export const updateUser = async (
  id: number,
  data: Partial<UserType>
): Promise<UserType> => {
  const res = await axios.patch<UserType>(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  return axios.delete(`/users/${id}`);
};
