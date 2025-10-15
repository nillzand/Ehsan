// src/services/orderService.ts
import api from '@/lib/api';
import { Order, CreateOrderPayload } from '@/types';

/**
 * Fetches the order history for the currently authenticated user.
 */
export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders/');
  return response.data;
};

/**
 * Creates a new order for the authenticated user.
 */
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await api.post<Order>('/orders/', payload);
    return response.data;
}

/**
 * Deletes (cancels) an existing order.
 */
export const deleteOrder = async (orderId: number): Promise<void> => {
    await api.delete(`/orders/${orderId}/`);
}