// frontend/src/services/walletService.ts
import api from '@/lib/api';
import { Wallet } from '@/types';

/**
 * For Super Admins: Deposits funds into a company's wallet.
 * @param companyId The ID of the company to deposit into.
 * @param amount The amount to deposit.
 */
export const depositToWallet = async (companyId: number, amount: number | string): Promise<{ new_balance: string }> => {
    const response = await api.post(`/admin/wallets/${companyId}/deposit/`, { amount });
    return response.data;
};

/**
 * For Company Admins: Fetches their own company's wallet details.
 */
export const getMyCompanyWallet = async (): Promise<Wallet> => {
    const response = await api.get('/admin/wallets/my-company/');
    return response.data;
};

/**
 * For Company Admins: Allocates budget from the company wallet to an employee.
 * @param userId The ID of the user to allocate budget to.
 * @param amount The amount to allocate.
 */
export const allocateBudget = async (userId: number, amount: number | string): Promise<any> => {
    const response = await api.post(`/admin/employees/${userId}/allocate_budget/`, { amount });
    return response.data;
};