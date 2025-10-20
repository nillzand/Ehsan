// frontend/src/services/foodService.ts
import api from '@/lib/api';
import { FoodItem, FoodCategory, SideDish } from '../types';

type CreateFoodPayload = Omit<FoodItem, 'id' | 'created_at' | 'category_name'>;

/**
 * Fetches all food categories.
 */
export const getFoodCategories = async (): Promise<FoodCategory[]> => {
  const response = await api.get<FoodCategory[]>('/menu/categories/');
  return response.data;
};

/**
 * Fetches all food items.
 */
export const getFoodItems = async (): Promise<FoodItem[]> => {
  const response = await api.get<FoodItem[]>('/menu/items/');
  return response.data;
};

/**
 * [NEW] Fetches all available side dishes.
 */
export const getSideDishes = async (): Promise<SideDish[]> => {
    const response = await api.get<SideDish[]>('/menu/sides/');
    return response.data;
}

/**
 * Creates a new food item.
 */
export const createFoodItem = async (foodData: CreateFoodPayload): Promise<FoodItem> => {
    const response = await api.post<FoodItem>('/menu/items/', foodData);
    return response.data;
}