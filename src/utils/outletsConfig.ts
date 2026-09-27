export interface Outlet {
  id: string;
  name: string;
  bengaliName?: string;
  area: string;
  address: string;
  landmark?: string;
  phone: string;
  hours: string;
  tag?: string;
  features?: string[];
  image: string;
  mapUrl?: string;
  isActive: boolean;
  order: number;
}

export interface OutletsConfig {
  enabled: boolean;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  buttonText: string;
  buttonLink: string;
  pageBadge: string;
  pageTitle: string;
  pageDescription: string;
  outlets: Outlet[];
}

export const DEFAULT_OUTLETS_CONFIG: OutletsConfig = {
  enabled: true,
  sectionBadge: 'Retail Experience Centers',
  sectionTitle: 'Visit Blucheez Outlets in Dhaka & Chattogram',
  sectionDescription: 'Step inside our boutique flagships to feel our Egyptian mercerized cottons, Jamdani handloom drapes, receive bespoke size measurements, or claim instant in-store exchanges.',
  buttonText: 'View All Outlets on Map',
  buttonLink: '/outlets',
  pageBadge: 'Dhaka Experience Centers',
  pageTitle: 'Visit Blucheez Outlets in Dhaka',
  pageDescription: 'Experience the tactile craftsmanship of fine mercerized cotton, authentic Belwari silk sarees, and custom tailoring consultations in person.',
  outlets: [
    {
      id: 'banani-flagship',
      name: 'Blucheez Banani Flagship Atelier',
      bengaliName: 'বনানী ফ্ল্যাগশিপ শো-রুম',
      area: 'Road 11, Block D, Banani, Dhaka',
      address: 'House 42, Road 11, Block D, Banani, Dhaka-1213',
      landmark: 'Opposite to Star Cineplex Banani',
      phone: '+880 1711-234567',
      hours: '10:00 AM – 10:00 PM (Open 7 Days)',
      tag: 'Flagship & Alteration Studio',
      features: ['Exclusive Belwari Handloom Section', 'Bespoke Suiting & Master Tailor', 'Instant 7-Day Exchange Hub', 'VIP Fitting Lounge'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      order: 1
    },
    {
      id: 'dhanmondi-store',
      name: 'Blucheez Dhanmondi Store',
      bengaliName: 'ধানমন্ডি এক্সপেরিয়েন্স সেন্টার',
      area: 'Road 27 (Old), Dhanmondi, Dhaka',
      address: 'Plot 79, Satmasjid Road (Near Road 27), Dhanmondi, Dhaka-1209',
      landmark: 'Near Genetic Plaza & Star Kabab',
      phone: '+880 1711-234568',
      hours: '10:00 AM – 10:00 PM (Open 7 Days)',
      tag: 'Belwari Atelier & Men’s Lounge',
      features: ['Full Panjabi & Kabli Showcase', 'Summer Knitwear Bar', 'Online Order Pickup & Exchange'],
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      order: 2
    },
    {
      id: 'uttara-center',
      name: 'Blucheez Uttara Experience Center',
      bengaliName: 'উত্তরা ফ্ল্যাগশিপ আউটলেট',
      area: 'Rabindra Sarani, Sector 3, Uttara, Dhaka',
      address: 'Sector 3, Rabindra Sarani, Uttara, Dhaka-1230',
      landmark: 'Beside North Tower & Mascot Plaza',
      phone: '+880 1711-234569',
      hours: '10:00 AM – 10:00 PM (Open 7 Days)',
      tag: 'Full Catalog & Fitting Suites',
      features: ['Eid Festive Special Gallery', 'On-Spot Alteration Service', 'Cash on Delivery Collection Point'],
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      order: 3
    },
    {
      id: 'jamuna-future-park',
      name: 'Blucheez Jamuna Future Park',
      bengaliName: 'যমুনা ফিউচার পার্ক আউটলেট',
      area: 'Level 2, Block C, Kuril, Dhaka',
      address: 'Shop 1A-024, Ground Floor, Jamuna Future Park, Kuril, Dhaka-1229',
      landmark: 'Near Central Atrium East Court',
      phone: '+880 1711-234570',
      hours: '11:00 AM – 09:30 PM (Closed Wednesdays)',
      tag: 'Mall Experience Center',
      features: ['Blucheez | Black Society Zone', 'Express Gift Packaging', 'Card & bKash Acceptance'],
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      order: 4
    }
  ]
};

export const getActiveOutletsConfig = (settings?: Record<string, any>): OutletsConfig => {
  // 1. Check settings from backend database
  let dbConfig: Partial<OutletsConfig> | null = null;
  if (settings) {
    const rawSetting = settings['outlets_config'];
    const settingValue = typeof rawSetting === 'object' && rawSetting !== null ? rawSetting.value : rawSetting;
    if (settingValue && typeof settingValue === 'string') {
      try {
        dbConfig = JSON.parse(settingValue);
      } catch (e) {
        // ignore parse error
      }
    } else if (settingValue && typeof settingValue === 'object') {
      dbConfig = settingValue;
    }
  }

  // 2. Check localStorage fallback for instant client updates
  let localConfig: Partial<OutletsConfig> | null = null;
  try {
    const savedLocal = localStorage.getItem('aristo_outlets_config');
    if (savedLocal) {
      localConfig = JSON.parse(savedLocal);
    }
  } catch (e) {
    // ignore
  }

  const mergedOutlets = (dbConfig?.outlets && dbConfig.outlets.length > 0)
    ? dbConfig.outlets
    : (localConfig?.outlets && localConfig.outlets.length > 0)
      ? localConfig.outlets
      : DEFAULT_OUTLETS_CONFIG.outlets;

  return {
    enabled: dbConfig?.enabled !== undefined
      ? Boolean(dbConfig.enabled)
      : localConfig?.enabled !== undefined
        ? Boolean(localConfig.enabled)
        : DEFAULT_OUTLETS_CONFIG.enabled,
    sectionBadge: dbConfig?.sectionBadge || localConfig?.sectionBadge || DEFAULT_OUTLETS_CONFIG.sectionBadge,
    sectionTitle: dbConfig?.sectionTitle || localConfig?.sectionTitle || DEFAULT_OUTLETS_CONFIG.sectionTitle,
    sectionDescription: dbConfig?.sectionDescription || localConfig?.sectionDescription || DEFAULT_OUTLETS_CONFIG.sectionDescription,
    buttonText: dbConfig?.buttonText || localConfig?.buttonText || DEFAULT_OUTLETS_CONFIG.buttonText,
    buttonLink: dbConfig?.buttonLink || localConfig?.buttonLink || DEFAULT_OUTLETS_CONFIG.buttonLink,
    pageBadge: dbConfig?.pageBadge || localConfig?.pageBadge || DEFAULT_OUTLETS_CONFIG.pageBadge,
    pageTitle: dbConfig?.pageTitle || localConfig?.pageTitle || DEFAULT_OUTLETS_CONFIG.pageTitle,
    pageDescription: dbConfig?.pageDescription || localConfig?.pageDescription || DEFAULT_OUTLETS_CONFIG.pageDescription,
    outlets: mergedOutlets,
  };
};
