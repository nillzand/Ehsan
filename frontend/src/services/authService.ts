// src/services/authService.ts
import api from '../lib/api';
import { AuthResponse, LoginCredentials } from '../types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/token/', credentials);
  return response.data;
};