// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/shared/Layout';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import DashboardPage from './pages/admin/DashboardPage';
import CompanyListPage from './pages/admin/company/CompanyListPage';
import AddEditCompanyPage from './pages/admin/company/AddEditCompanyPage';
import FoodManagementPage from './pages/admin/food/FoodManagementPage';
import AddEditFoodPage from './pages/admin/food/AddEditFoodPage';
// [MODIFIED] Corrected the import path for the calendar page
import MenuCalendarPage from '@/components/features/admin/menu_calendar/MenuCalendarPage';
import UserListPage from './pages/admin/user/UserListPage';
import AddEditUserPage from './pages/admin/user/AddEditUserPage';
import ContractListPage from '@/pages/admin/contract/ContractListPage';
import AddEditContractPage from '@/pages/admin/contract/AddEditContractPage';
import MyCompanyWalletPage from '@/pages/admin/wallet/MyCompanyWalletPage';
import ReportsPage from './pages/admin/reports/ReportsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/menu" replace />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="companies" element={<CompanyListPage />} />
          <Route path="companies/new" element={<AddEditCompanyPage />} />
          <Route path="companies/edit/:companyId" element={<AddEditCompanyPage />} />
          <Route path="foods" element={<FoodManagementPage />} />
          <Route path="foods/new" element={<AddEditFoodPage />} />
          <Route path="menu-calendar" element={<MenuCalendarPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="users/new" element={<AddEditUserPage />} />
          <Route path="contracts" element={<ContractListPage />} />
          <Route path="contracts/new" element={<AddEditContractPage />} />
          <Route path="contracts/edit/:id" element={<AddEditContractPage />} />
          <Route path="wallet/my-company" element={<MyCompanyWalletPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;