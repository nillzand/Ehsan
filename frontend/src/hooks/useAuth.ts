// frontend/src/hooks/useAuth.ts
import { useAuthStore } from '../store/authStore';
import { login as loginService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { AuthUser, LoginCredentials } from '../types';

export const useAuth = () => {
  const { user, accessToken, setTokens, logout: logoutFromStore } = useAuthStore();

  /**
   * [MODIFIED] This function now returns the authenticated user object upon success.
   */
  const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
    const data = await loginService(credentials);
    
    // Decode the token here to get user info immediately
    const user = jwtDecode<AuthUser>(data.access);
    
    // Update the global store as before
    setTokens(data.access, data.refresh);
    
    // Return the user object directly to the caller
    return user;
  };

  const logout = () => {
    logoutFromStore();
  };

  return {
    isAuthenticated: !!accessToken,
    user,
    // [MODIFIED] New, more specific role checks
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    isCompanyAdmin: user?.role === 'COMPANY_ADMIN',
    isEmployee: user?.role === 'EMPLOYEE',
    // A general check for any admin role
    isAdmin: user?.role === 'SUPER_ADMIN' || user?.role === 'COMPANY_ADMIN',
    login,
    logout,
  };
};