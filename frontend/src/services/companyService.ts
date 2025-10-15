// frontend/src/services/companyService.ts
import api from '@/lib/api';
import { Company } from '@/types';

type CreateCompanyPayload = Omit<Company, 'id' | 'created_at'>;
type UpdateCompanyPayload = Partial<CreateCompanyPayload>;

/**
 * Fetches all companies from the backend.
 */
export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get<Company[]>('/companies/');
  return response.data;
};

/**
 * Fetches a single company by its ID.
 */
export const getCompanyById = async (id: number): Promise<Company> => {
  const response = await api.get<Company>(`/companies/${id}/`);
  return response.data;
};

/**
 * Creates a new company.
 */
export const createCompany = async (companyData: CreateCompanyPayload): Promise<Company> => {
  const response = await api.post<Company>('/companies/', companyData);
  return response.data;
};

/**
 * Updates an existing company.
 */
export const updateCompany = async (id: number, companyData: UpdateCompanyPayload): Promise<Company> => {
  const response = await api.put<Company>(`/companies/${id}/`, companyData);
  return response.data;
};