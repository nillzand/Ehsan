// src/services/menuService.ts
import api from '../lib/api';
import { Schedule, DailyMenu } from '../types';

// PAYLOAD TYPE for creating/updating a daily menu
export interface SetDailyMenuPayload {
  schedule_id: number;
  date: string;
  food_ids: number[];
  side_ids: number[];
}

/**
 * NEW: Fetches the specific menu for a single date to pre-fill the form.
 * Returns null if no menu is found (which is not an error).
 */
export const getDailyMenuForDate = async (scheduleId: number, date: string): Promise<DailyMenu | null> => {
  try {
    const response = await api.get<DailyMenu>(`/schedules/${scheduleId}/menu-for-date/?date=${date}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; // A 404 means no menu exists for this date yet.
    }
    throw error; // Re-throw any other type of error.
  }
};

/**
 * NEW: Sends the selected foods/sides to the backend to be saved for a specific date.
 */
export const setDailyMenu = async (payload: SetDailyMenuPayload): Promise<DailyMenu> => {
  const response = await api.post<DailyMenu>('/admin/daily-menus/set/', payload);
  return response.data;
};

/**
 * (Existing Function) Fetches the active schedule and daily menus for the logged-in user's company.
 */
export const getMyCompanyMenu = async (): Promise<Schedule[]> => {
  const response = await api.get<Schedule[]>('/schedules/my-menu/');
  return response.data;
};