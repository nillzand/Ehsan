// src/types/index.ts

// ================== AUTH & USER ==================
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

// User info decoded from JWT
export interface AuthUser {
  username: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE';
  // add any other JWT payload fields if needed
}

// Full user object from API
export interface User {
  id: number;
  username: string;
  name: string; // SerializerMethodField on backend
  first_name: string;
  last_name: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE';
  company: number; // company ID
  company_name: string;
  budget: string; // Decimal as string
}

// ================== COMPANY, CONTRACT, WALLET ==================
export interface Company {
  id: number;
  name: string;
  contact_person: string;
  contact_phone: string;
  address: string;
  created_at: string;
}

export interface Contract {
  id: number;
  company: number;
  company_name: string;
  start_date: string;
  end_date: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELED';
  notes?: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  transaction_type: 'DEPOSIT' | 'BUDGET_ALLOCATION' | 'ORDER_DEDUCTION' | 'REFUND';
  amount: string;
  timestamp: string;
  description: string;
  user_username: string;
}

export interface Wallet {
  id: number;
  company_name: string;
  balance: string;
  updated_at: string;
  transactions: Transaction[];
}

// ================== MENU & SCHEDULE ==================
export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string | null;
  is_available: boolean;
  category: number;
  category_name: string;
  created_at: string;
}

export interface FoodCategory {
  id: number;
  name: string;
  description?: string;
}

export interface SideDish {
  id: number;
  name: string;
  description: string;
  price: string;
  is_available: boolean;
}

export interface DailyMenu {
  id: number;
  date: string;
  available_foods: FoodItem[];
  available_sides: SideDish[];
}

export interface Schedule {
  id: number;
  name: string;
  company: number;
  company_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  daily_menus: DailyMenu[];
}

// ================== ORDERS ==================
export interface Order {
  id: number;
  date: string;
  food_item: FoodItem;
  side_dishes: SideDish[];
  status: 'ثبت شده' | 'تایید شده' | 'در حال آماده‌سازی' | 'تحویل داده شده' | 'لغو شده';
  company: string;
  created_at: string;
}

export interface CreateOrderPayload {
  daily_menu: number;
  food_item: number;
  side_dishes: number[];
}

// ================== ADMIN & REPORTING ==================
export interface DashboardStats {
  orders_today: number;
  pending_orders_total: number;
  top_5_foods: { name: string; count: number }[];
}

// [MODIFIED] This type now matches the nested structure from the Django backend
export interface AdminReportData {
  summary: {
    orders_today: number;
    pending_orders_total: number;
    total_sales_today: number;
  };
  top_items: {
    foodId: number;
    name: string;
    ordered: number;
  }[];
  sales_by_date: {
    date: string;
    orders: number;
    revenue: number;
  }[];
  company_stats: {
    companyId: number;
    name: string;
    active_users: number;
    orders: number;
  }[];
  user_stats: {
    total_users: number;
    active_last_30_days: number;
  };
}