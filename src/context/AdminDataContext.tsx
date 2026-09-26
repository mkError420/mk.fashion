import React, { createContext, useContext, useState, useEffect } from 'react';



interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: number | null;
  product_count: number;
  parent_name: string;
}

interface Promocode {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_value: number;
  maximum_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  start_date: string;
  end_date: string;
  applicable_categories: string;
}

interface Setting {
  [key: string]: {
    value: string;
    type: string;
    category: string;
    description: string;
  };
}

interface AdminDataContextType {
  categories: Category[];
  promocodes: Promocode[];
  settings: Setting;
  isLoading: boolean;
  error: string | null;
  loadCategories: () => Promise<void>;
  loadPromocodes: () => Promise<void>;
  loadSettings: () => Promise<void>;
  createCategory: (category: Partial<Category>) => Promise<boolean>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  createPromocode: (promocode: Partial<Promocode>) => Promise<boolean>;
  updatePromocode: (id: number, promocode: Partial<Promocode>) => Promise<boolean>;
  deletePromocode: (id: number) => Promise<boolean>;
  updateSettings: (settings: Setting) => Promise<boolean>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [settings, setSettings] = useState<Setting>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=categories`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else if (response.status === 401) {
        setError('Please login to access admin features');
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      setError('Network error loading categories');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPromocodes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=promocodes`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setPromocodes(data);
      } else if (response.status === 401) {
        setError('Please login to access admin features');
      } else {
        setError('Failed to load promocodes');
      }
    } catch (err) {
      setError('Network error loading promocodes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=settings`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else if (response.status === 401) {
        setError('Please login to access admin features');
      } else {
        setError('Failed to load settings');
      }
    } catch (err) {
      setError('Network error loading settings');
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (category: Partial<Category>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=category`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (response.ok) {
        await loadCategories();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to create category');
      return false;
    }
  };

  const updateCategory = async (id: number, category: Partial<Category>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=category`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...category, id }),
      });
      if (response.ok) {
        await loadCategories();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update category');
      return false;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=category&id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        await loadCategories();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to delete category');
      return false;
    }
  };

  const createPromocode = async (promocode: Partial<Promocode>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=promocode`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promocode),
      });
      if (response.ok) {
        await loadPromocodes();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to create promocode');
      return false;
    }
  };

  const updatePromocode = async (id: number, promocode: Partial<Promocode>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=promocode`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...promocode, id }),
      });
      if (response.ok) {
        await loadPromocodes();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update promocode');
      return false;
    }
  };

  const deletePromocode = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin_dashboard.php?action=promocode&id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        await loadPromocodes();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to delete promocode');
      return false;
    }
  };

  const updateSettings = async (newSettings: Setting) => {
    try {
      const promises = Object.entries(newSettings).map(([key, value]) =>
        fetch(`${API_BASE_URL}/admin_dashboard.php?action=setting`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            setting_key: key,
            setting_value: value.value,
            setting_type: value.type,
            category: value.category,
            description: value.description,
          }),
        })
      );

      const results = await Promise.all(promises);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        await loadSettings();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update settings');
      return false;
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        categories,
        promocodes,
        settings,
        isLoading,
        error,
        loadCategories,
        loadPromocodes,
        loadSettings,
        createCategory,
        updateCategory,
        deleteCategory,
        createPromocode,
        updatePromocode,
        deletePromocode,
        updateSettings,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};