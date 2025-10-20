// frontend/src/services/menuService.ts
import api from '../lib/api';
import { Schedule, DailyMenu } from '../types';

// Payload for creating/updating a daily menu
export interface SaveDailyMenuPayload {
  date: string; // YYYY-MM-DD
  available_foods: number[]; // Array of food IDs
  available_sides: number[]; // Array of side dish IDs
}

/**
 * Fetches the active schedule and daily menus for the logged-in user's company.
 * For Super Admins, this will fetch all schedules.
 */
export const getMyCompanyMenu = async (): Promise<Schedule[]> => {
  const response = await api.get<Schedule[]>('/schedules/my-menu/');
  return response.data;
};

/**
 * [NEW] Fetches a specific daily menu for a given schedule and date.
 * Returns null if no menu exists for that date (404).
 */
export const getDailyMenuForDate = async (scheduleId: number, date: string): Promise<DailyMenu | null> => {
    try {
        // The backend viewset returns a list, so we expect an array.
        const response = await api.get<DailyMenu[]>(`/schedules/${scheduleId}/daily_menus/?date=${date}`);
        // If a menu exists for that date, the list will contain one item.
        return response.data.length > 0 ? response.data[0] : null;
    } catch (error: any) {
        // A 404 is a valid case meaning "no menu found", so we return null.
        if (error.response && error.response.status === 404) {
            return null;
        }
        // For other errors, we re-throw them.
        throw error;
    }
};

/**
 * [NEW] Creates or updates a daily menu for a specific schedule.
 * @param scheduleId The ID of the parent schedule.
 * @param dailyMenuId The ID of the daily menu to update (if it exists).
 * @param payload The menu data to save.
 */
export const saveOrUpdateDailyMenu = async (
    scheduleId: number,
    dailyMenuId: number | null,
    payload: SaveDailyMenuPayload
): Promise<DailyMenu> => {
    if (dailyMenuId) {
        // If an ID exists, we are UPDATING an existing menu.
        const response = await api.put<DailyMenu>(`/schedules/${scheduleId}/daily_menus/${dailyMenuId}/`, payload);
        return response.data;
    } else {
        // If there's no ID, we are CREATING a new menu.
        const response = await api.post<DailyMenu>(`/schedules/${scheduleId}/daily_menus/`, payload);
        return response.data;
    }
};