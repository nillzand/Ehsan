// src/pages/LoginPage.tsx
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/features/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  // If the user is already authenticated, redirect them away from the login page.
  if (isAuthenticated) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">ورود به سامانه کترینگ</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;