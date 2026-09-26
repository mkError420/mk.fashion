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

interface DeliveryFees {
  insideDhaka: number;
  outsideDhaka: number;
  freeShippingMinimum: number;
}

export interface FrontendCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  parent_name?: string | null;
  parent_slug?: string | null;
}

interface FrontendDataContextType {
  banners: Banner[];
  settings: FrontendSettings;
  deliveryFees: DeliveryFees;
  categories: FrontendCategory[];
  siteName: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  announcementText: string;
  isLoading: boolean;
  loadBanners: () => Promise<void>;
  loadSettings: () => Promise<void>;
  loadCategories: () => Promise<void>;
  validatePromocode: (code: string, orderTotal: number) => Promise<any>;
}

const FrontendDataContext = createContext<FrontendDataContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

export const FrontendDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<FrontendSettings>({});
  const [categories, setCategories] = useState<FrontendCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Computed values from settings
  const deliveryFees: DeliveryFees = {
    insideDhaka: parseInt(settings['cod_charge_inside_dhaka'] || '60', 10),
    outsideDhaka: parseInt(settings['cod_charge_outside_dhaka'] || '120', 10),
    freeShippingMinimum: parseInt(settings['free_shipping_minimum'] || '3000', 10),
  };
  const siteName = settings['site_name'] || 'Aristo Fashion';
  const contactPhone = settings['contact_phone'] || '09613-258248';
  const contactEmail = settings['contact_email'] || 'support@aristofashionbd.com';
  const whatsappNumber = settings['whatsapp_number'] || '01700000000';
  const announcementText = settings['announcement_text'] || `Cash on Delivery Available Nationwide • 100% Cotton`;

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

  const loadCategories = async () => {
    try {
      // First try frontend_categories.php
      const response = await fetch(`${API_BASE_URL}/frontend_categories.php`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          return;
        }
      }
      
      // Fallback to categories.php
      const fallbackRes = await fetch(`${API_BASE_URL}/categories.php`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (Array.isArray(fallbackData)) {
          setCategories(fallbackData);
        }
      }
    } catch (err) {
      console.warn('Failed to load categories:', err);
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
    loadCategories();
  }, []);

  return (
    <FrontendDataContext.Provider
      value={{
        banners,
        settings,
        deliveryFees,
        categories,
        siteName,
        contactPhone,
        contactEmail,
        whatsappNumber,
        announcementText,
        isLoading,
        loadBanners,
        loadSettings,
        loadCategories,
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