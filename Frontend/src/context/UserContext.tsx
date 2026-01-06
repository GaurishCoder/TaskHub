import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../utils/api";
import type { User, AuthResponse, VerifyResponse } from "../types/User.ts";

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

function UserContextProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in (token in cookie)
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await api.get<VerifyResponse>("/auth/verify");
      
      if (response.data.authenticated && response.data.userData) {
        setUser(response.data.userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      setUser(response.data.userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", {
        username,
        email,
        password,
      });
      setUser(response.data.userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear the cookie
      await api.post("/auth/logout");
      // Clear user state
      setUser(null);
    } catch (error: any) {
      // Even if the request fails, clear local state
      setUser(null);
      console.error("Logout error:", error);
    }
  };

  const value: UserContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    checkAuth,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;