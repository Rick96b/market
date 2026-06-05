import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authService.js';
import {
  getJsonStorageItem,
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '../services/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getJsonStorageItem('user', null));
  const [loading, setLoading] = useState(Boolean(getStorageItem('token')));

  useEffect(() => {
    const token = getStorageItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((data) => {
        setUser(data.user);
        setStorageItem('user', JSON.stringify(data.user));
      })
      .catch(() => {
        removeStorageItem('token');
        removeStorageItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function register(values) {
    const data = await registerUser(values);
    setStorageItem('token', data.token);
    setStorageItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function login(values) {
    const data = await loginUser(values);
    setStorageItem('token', data.token);
    setStorageItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    removeStorageItem('token');
    removeStorageItem('user');
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
