// frontend/src/services/userService.ts
import api from '@/lib/api';
import { User } from '@/types';

type CreateUserPayload = Omit<User, 'id' | 'name' | 'company_name' | 'budget'> & { password?: string };
type UpdateUserPayload = Partial<CreateUserPayload>;

/**
 * Fetches the complete profile for the currently authenticated user.
 */
export const getCurrentUser = async (): Promise<User> => {
    // This assumes a '/api/users/me/' endpoint is configured on the backend
    const response = await api.get<User>('/users/me/'); 
    return response.data;
};

/**
 * Fetches users. The backend automatically filters based on role.
 * Super Admins get all users; Company Admins get users from their company.
 */
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users/');
  return response.data;
};

/**
 * Creates a new user.
 */
export const createUser = async (userData: CreateUserPayload): Promise<User> => {
    const response = await api.post<User>('/users/', userData);
    return response.data;
};

/**
 * Updates an existing user.
 */
export const updateUser = async (id: number, userData: UpdateUserPayload): Promise<User> => {
    const response = await api.put<User>(`/users/${id}/`, userData);
    return response.data;
};