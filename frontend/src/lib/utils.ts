import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if an order can be placed or modified for a given date.
 * @param date The date of the menu/order in 'YYYY-MM-DD' format.
 * @param leadDays The minimum number of full days required in advance.
 * @returns {boolean} True if the action is allowed, false otherwise.
 */
export function isModificationAllowed(date: string, leadDays: number = 2): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the beginning of the day

    const menuDate = new Date(date);
    menuDate.setHours(0, 0, 0, 0); // Normalize menu date

    // Calculate the difference in time
    const timeDiff = menuDate.getTime() - today.getTime();

    // Calculate the difference in full days
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    return daysDiff >= leadDays;
}