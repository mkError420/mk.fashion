import React, { createContext, useContext, useState, useEffect } from 'react';

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  position: number;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

interface FrontendSettings {
  [key: string]: string;
}

interface FrontendDataContextType {
  banners: Banner[];
  settings: FrontendSettings;
  isLoading: boolean;
  loadBanners: () => Promise<void>;
  loadSettings: () => Promise<void>;
  validatePromocode: (code: string, orderTotal: number) => Promise<any>;
}

const FrontendDataContext = createContext<FrontendDataContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

export const FrontendDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<FrontendSettings>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/banners.php`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (err) {
      console.error('Failed to load banners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/frontend_settings.php`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePromocode = async (code: string, orderTotal: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/validate_promocode.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, order_total: orderTotal }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        return { valid: false, message: error.message };
      }
    } catch (err) {
      return { valid: false, message: 'Network error validating promocode' };
    }
  };

  useEffect(() => {
    loadBanners();
    loadSettings();
  }, []);

  return (
    <FrontendDataContext.Provider
      value={{
        banners,
        settings,
        isLoading,
        loadBanners,
        loadSettings,
        validatePromocode,
      }}
    >
      {children}
    </FrontendDataContext.Provider>
  );
};

export const useFrontendData = () => {
  const context = useContext(FrontendDataContext);
  if (!context) {
    throw new Error('useFrontendData must be used within a FrontendDataProvider');
  }
  return context;
};