import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.success) {
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}! 🎉`);
    }
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.success) {
      setUser(data.user);
      toast.success('Account created! Welcome aboard! 🚀');
    }
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue logout even if API fails
    }
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAuthor: user?.role === 'author' || user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
