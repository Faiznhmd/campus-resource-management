import api from './api';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────────

// ADMIN: Get all resources
export const getAdminResources = async (): Promise<Resource[]> => {
  const res = await api.get<Resource[]>('/resources/admin');
  return res.data;
};

// PUBLIC / ADMIN: Get one resource
export const getResource = async (id: number): Promise<Resource> => {
  const res = await api.get<Resource>(`/resources/${id}`);
  return res.data;
};

// ADMIN: Create resource
export const createResource = async (
  data: CreateResourceInput
): Promise<Resource> => {
  const res = await api.post<Resource>('/resources', data);
  return res.data;
};

// ADMIN: Update resource
export const updateResource = async (
  id: number,
  data: UpdateResourceInput
): Promise<Resource> => {
  const res = await api.patch<Resource>(`/resources/${id}`, data);
  return res.data;
};

// ADMIN: Delete resource
export const deleteResource = async (
  id: number
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/resources/${id}`);
  return res.data;
};
