import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: number;
  email: string;
  name: string;
}

interface AdminContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

const STORAGE_KEY = 'aristo_admin_session';

function loadPersistedAdmin(): { isAdmin: boolean; adminUser: AdminUser | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.isAdmin && parsed.adminUser) {
        return { isAdmin: true, adminUser: parsed.adminUser };
      }
    }
  } catch {
    // Ignore parse errors
  }
  return { isAdmin: false, adminUser: null };
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restore from localStorage immediately so page reload shows dashboard not login
  const persisted = loadPersistedAdmin();
  const [isAdmin, setIsAdmin] = useState<boolean>(persisted.isAdmin);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(persisted.adminUser);
  // Skip loading spinner if we already have persisted data
  const [isLoading, setIsLoading] = useState<boolean>(!persisted.isAdmin);

  // On mount, silently re-validate with the server in the background
  useEffect(() => {
    checkAuth();
  }, []);

  const persistSession = (isAdminVal: boolean, user: AdminUser | null) => {
    if (isAdminVal && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAdmin: true, adminUser: user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_login.php`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.authenticated && data.admin) {
          setIsAdmin(true);
          setAdminUser(data.admin);
          persistSession(true, data.admin);
        } else {
          setIsAdmin(false);
          setAdminUser(null);
          persistSession(false, null);
        }
      } else if (response.status === 401) {
        setIsAdmin(false);
        setAdminUser(null);
        persistSession(false, null);
      }
    } catch (error) {
      console.warn('Auth check network error, keeping persisted session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsAdmin(true);
        setAdminUser(data.admin);
        persistSession(true, data.admin);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/admin_login.php`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAdmin(false);
      setAdminUser(null);
      persistSession(false, null);
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminUser, isLoading, login, logout, checkAuth }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
