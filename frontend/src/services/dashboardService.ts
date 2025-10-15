// frontend/src/services/dashboardService.ts
import api from '@/lib/api';
import { DashboardStats, AdminReportData } from '../types';

/**
 * Fetches key metrics for the admin dashboard.
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/admin/dashboard-stats/');
  return response.data;
};

export const getAdminReport = async (params?: { from?: string; to?: string }): Promise<AdminReportData> => {
    const response = await api.get<AdminReportData>('/admin/reports/', { params });
    return response.data;
};