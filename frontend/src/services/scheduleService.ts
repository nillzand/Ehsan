// frontend/src/services/scheduleService.ts
import api from '@/lib/api';
import { Schedule } from '@/types';

// Define the data structure for creating a schedule
export type CreateSchedulePayload = Omit<Schedule, 'id' | 'company_name' | 'daily_menus' | 'created_at'>;
export type UpdateSchedulePayload = Partial<CreateSchedulePayload>;

/**
 * Fetches all schedules from the backend (for Super Admins).
 */
export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await api.get<Schedule[]>('/schedules/');
  return response.data;
};

/**
 * Fetches a single schedule by its ID.
 */
export const getScheduleById = async (id: number): Promise<Schedule> => {
  const response = await api.get<Schedule>(`/schedules/${id}/`);
  return response.data;
};

/**
 * Creates a new schedule.
 */
export const createSchedule = async (payload: CreateSchedulePayload): Promise<Schedule> => {
  const response = await api.post<Schedule>('/schedules/', payload);
  return response.data;
};

/**
 * Updates an existing schedule.
 */
export const updateSchedule = async (id: number, payload: UpdateSchedulePayload): Promise<Schedule> => {
  const response = await api.patch<Schedule>(`/schedules/${id}/`, payload);
  return response.data;
};

/**
 * Deletes a schedule.
 */
export const deleteSchedule = async (id: number): Promise<void> => {
  await api.delete(`/schedules/${id}/`);
};