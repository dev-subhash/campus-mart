import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cm_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cm_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('cm_user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('cm_token');
        localStorage.removeItem('cm_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem('cm_token', data.token);
    localStorage.setItem('cm_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const { data } = await registerUser({ name, email, password, phone });
    localStorage.setItem('cm_token', data.token);
    localStorage.setItem('cm_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('cm_token');
    localStorage.removeItem('cm_user');
    setUser(null);
  }, []);

  const updateStoredUser = useCallback((nextUser) => {
    setUser(nextUser);
    localStorage.setItem('cm_user', JSON.stringify(nextUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateStoredUser, isAdmin: user?.role === 'admin' }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
