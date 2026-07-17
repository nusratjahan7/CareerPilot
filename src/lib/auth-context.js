"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from './auth-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: session } = await authClient.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
    }
    return data;
  };

  const register = async (name, email, password) => {
    const { data, error } = await authClient.signUp.email({ name, email, password });
    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role || user.role?.includes(role);
  };

  const redirectToDashboard = () => {
    if (!user) return '/login';
    if (hasRole('admin')) return '/dashboard/admin';
    return '/dashboard/user';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasRole, redirectToDashboard }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
