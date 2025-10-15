// frontend/src/store/authStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { AuthUser } from '@/types'; // Import our new AuthUser type

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
}

// Custom decoder to extract user info from the JWT
const decodeToken = (token: string): AuthUser | null => {
  try {
    // The backend JWT now includes username and role
    const decoded: AuthUser = jwtDecode(token);
    return { username: decoded.username, role: decoded.role };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (access, refresh) => {
        const user = decodeToken(access);
        set({ accessToken: access, refreshToken: refresh, user });
      },
      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);