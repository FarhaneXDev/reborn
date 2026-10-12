'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, clearTokens, getTokens } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const tokens = getTokens();
    if (!tokens?.access) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await authApi.getMe();
      setUser(data);
    } catch {
      setUser(null);
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    await authApi.login(email, password);
    await fetchUser();
  };

  const register = async (params) => {
    await authApi.register(params);
    await fetchUser();
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const updateProfile = async (data) => {
    const updated = await authApi.updateProfile(data);
    setUser((prev) => (prev ? { ...prev, profile: updated } : prev));
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
