// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Shared components
import { Layout } from './components/shared/Layout';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import DashboardPage from './pages/admin/DashboardPage';

// Company
import CompanyListPage from './pages/admin/company/CompanyListPage';
import AddEditCompanyPage from './pages/admin/company/AddEditCompanyPage';

// Food
import FoodManagementPage from './pages/admin/food/FoodManagementPage';
import AddEditFoodPage from './pages/admin/food/AddEditFoodPage';

// Menu Management (for Super Admin)
import MenuManagementPage from './pages/admin/menu/MenuManagementPage';

// 🆕 Menu Calendar (replacing Schedule)
import MenuCalendarPage from './components/features/admin/MenuCalendarPage';

// Users
import UserListPage from './pages/admin/user/UserListPage';
import AddEditUserPage from './pages/admin/user/AddEditUserPage';

// Contracts
import ContractListPage from '@/pages/admin/contract/ContractListPage';
import AddEditContractPage from '@/pages/admin/contract/AddEditContractPage';

// Wallet
import MyCompanyWalletPage from '@/pages/admin/wallet/MyCompanyWalletPage';

// Reports
import ReportsPage from './pages/admin/reports/ReportsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/menu" replace />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default Redirect */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Company Routes */}
          <Route path="companies" element={<CompanyListPage />} />
          <Route path="companies/new" element={<AddEditCompanyPage />} />
          <Route path="companies/edit/:companyId" element={<AddEditCompanyPage />} />

          {/* Food Routes */}
          <Route path="foods" element={<FoodManagementPage />} />
          <Route path="foods/new" element={<AddEditFoodPage />} />

          {/* 🗓️ Menu Calendar (replaces old schedules) */}
          <Route path="menu-calendar" element={<MenuCalendarPage />} />

          {/* Menu Management (Super Admin only) */}
          <Route path="menu-management" element={<MenuManagementPage />} />

          {/* User Routes */}
          <Route path="users" element={<UserListPage />} />
          <Route path="users/new" element={<AddEditUserPage />} />

          {/* Contract Routes */}
          <Route path="contracts" element={<ContractListPage />} />
          <Route path="contracts/new" element={<AddEditContractPage />} />
          <Route path="contracts/edit/:id" element={<AddEditContractPage />} />

          {/* Wallet */}
          <Route path="wallet/my-company" element={<MyCompanyWalletPage />} />

          {/* Reports */}
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
