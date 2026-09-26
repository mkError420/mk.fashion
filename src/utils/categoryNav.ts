import { FrontendCategory } from '../context/FrontendDataContext';

export interface UnifiedCategory {
  id: string; // Slug (e.g. 'men', 'women', 'new-in', etc.)
  dbId?: number;
  name: string; // Uppercase display name (e.g. 'MEN', 'SUMMER')
  bengaliName?: string;
  badge?: string;
  hasDropdown: boolean;
  featuredImage?: string;
  featuredTitle?: string;
  subcategories: string[];
  // For mega-menu multi-column display
  groups?: Array<{
    title: string;
    items: string[];
  }>;
}

const CATEGORY_METADATA: Record<string, {
  bengaliName?: string;
  badge?: string;
  featuredImage?: string;
  featuredTitle?: string;
  defaultSubcategories?: string[];
}> = {
  'new-in': {
    bengaliName: 'নতুন আগমন',
    badge: 'NEW',
    featuredImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Eid & Festive Drop 2026',
    defaultSubcategories: [
      'Essential Panjabi', 'Exclusive Panjabi', 'Formal Shirts', 'Polo Shirts', 'Waistcoats',
      'Belwari Jamdani Sarees', 'Embroidered Kurti Sets', 'Two-Piece Kurti', 'Three-Piece Kurti', 'Anarkali',
      'Blucheez Black Label', 'Belwari Signature', 'Summer Polos', 'Fragrances'
    ]
  },
  'summer': {
    bengaliName: 'সামার কালেকশন',
    badge: 'SUMMER',
    featuredImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Summer Breeze Collection',
    defaultSubcategories: [
      'Sweater Polos', 'Boxy-Fit Drop Shoulder Polos', 'Classic Polos', 'Drop Shoulder T-Shirt', 'Oversized T-Shirt',
      'Lawn Cotton Panjabi', 'Short Sleeve Panjabi', 'Cotton Pajama', 'Breathable Kurtis',
      'Casual Shirts', 'Relaxed Wear', 'Shorts', 'Cotton Chinos'
    ]
  },
  'blucheez-black': {
    bengaliName: 'ব্ল্যাক সোসাইটি',
    badge: 'LUXURY',
    featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'The Monochrome Atelier',
    defaultSubcategories: [
      'Panjabi | Black', 'Executive Wool Blazers', 'Tailored Black Shirts', 'Slim Fit Black Trousers',
      'Black Zari Suits', 'Draped Sarees', 'Obsidian Cufflinks', 'Italian Leather Belts', 'Premium Noir Fragrance'
    ]
  },
  'belwari': {
    bengaliName: 'বেলওয়ারী ঐতিহ্য',
    badge: 'HERITAGE',
    featuredImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Handcrafted Heritage',
    defaultSubcategories: [
      'Belwari Jamdani Saree', 'Zari Embroidered Suit', 'Artisan Silk Kurtis', 'Heritage Zari Panjabi',
      'Two-Piece Salwar Kameez', 'Bridal & Reception Sets'
    ]
  },
  'men': {
    bengaliName: 'পুরুষদের পোশাক',
    badge: 'TRENDING',
    featuredImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'The Modern Gentleman',
    defaultSubcategories: [
      'Elegant Panjabi', 'Exclusive Panjabi', 'Kabli Set', 'Pajama', 'Formal Shirt', 'Premium Shirt',
      'Casual Shirt', 'Giza Cotton Shirt', 'Sweater Polos', 'Classic Polos', 'Formal Pant', 'Casual Pant', 'Jeans'
    ]
  },
  'women': {
    bengaliName: 'নারীদের পোশাক',
    badge: 'POPULAR',
    featuredImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Graceful Elegance',
    defaultSubcategories: [
      'Salwar Kameez', 'Dhakai Jamdani Saree', 'Embroidered Kurti Sets', 'Two Pieces Kurti', 'Three Pieces Kurti',
      'Anarkali', 'Western Tops', 'Tops & Tunics', 'Denim Jeans', 'Wide Leg Pants', 'Designer Party Kurtis'
    ]
  },
  'accessories': {
    bengaliName: 'এক্সেসরিজ',
    featuredImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Curated Essentials',
    defaultSubcategories: [
      'Caps', 'Eyewear', 'Fragrances (Men & Women)', 'Genuine Leather Belts', 'Wallets', 'Cufflinks'
    ]
  }
};

/**
 * Split an array of subcategory strings into 2 or 3 visually balanced groups for mega-menu display
 */
export function groupSubcategories(subcategories: string[], parentName: string): Array<{ title: string; items: string[] }> {
  if (!subcategories || subcategories.length === 0) return [];
  
  if (subcategories.length <= 5) {
    return [{ title: `${parentName} Collection`, items: subcategories }];
  }

  const numGroups = subcategories.length > 8 ? 3 : 2;
  const chunkSize = Math.ceil(subcategories.length / numGroups);
  const groups: Array<{ title: string; items: string[] }> = [];

  const defaultTitles = [
    `Featured ${parentName}`,
    `Popular Collections`,
    `Wardrobe Essentials`
  ];

  for (let i = 0; i < subcategories.length; i += chunkSize) {
    const chunk = subcategories.slice(i, i + chunkSize);
    const grpIndex = Math.floor(i / chunkSize);
    groups.push({
      title: defaultTitles[grpIndex] || `More in ${parentName}`,
      items: chunk
    });
  }

  return groups;
}

/**
 * Default fallback categories matching the database seeds
 */
export const DEFAULT_UNIFIED_CATEGORIES: UnifiedCategory[] = [
  'new-in', 'summer', 'blucheez-black', 'belwari', 'men', 'women', 'accessories'
].map(slug => {
  const meta = CATEGORY_METADATA[slug] || {};
  const name = slug === 'blucheez-black' ? 'BLUCHEEZ | BLACK' : slug.replace(/-/g, ' ').toUpperCase();
  const subcategories = meta.defaultSubcategories || [];
  return {
    id: slug,
    name,
    bengaliName: meta.bengaliName,
    badge: meta.badge,
    hasDropdown: subcategories.length > 0,
    featuredImage: meta.featuredImage,
    featuredTitle: meta.featuredTitle,
    subcategories,
    groups: groupSubcategories(subcategories, name)
  };
});

/**
 * Converts dynamic categories loaded from backend into a unified structure
 * used simultaneously by both Navbar and Shop Sidebar.
 * Only returns parent categories with show_in_navbar !== 0 for the Navbar.
 * Pass navbarOnly=false to get all categories (e.g. for Shop sidebar).
 */
export function buildUnifiedCategories(dynamicCategories?: FrontendCategory[], navbarOnly = true): UnifiedCategory[] {
  if (!dynamicCategories || dynamicCategories.length === 0) {
    return DEFAULT_UNIFIED_CATEGORIES;
  }

  // Find parent categories (parent_id is null or 0)
  let parents = dynamicCategories.filter(c => c.parent_id === null || c.parent_id === 0);
  if (parents.length === 0) {
    return DEFAULT_UNIFIED_CATEGORIES;
  }

  // If building for navbar: filter out categories explicitly hidden (show_in_navbar === 0)
  if (navbarOnly) {
    parents = parents.filter(c => c.show_in_navbar !== 0 && c.show_in_navbar !== false);
  }

  if (parents.length === 0) {
    return DEFAULT_UNIFIED_CATEGORIES;
  }

  return parents.map(parent => {
    const rawSlug = (parent.slug || parent.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const meta = CATEGORY_METADATA[rawSlug] || CATEGORY_METADATA[parent.name.toLowerCase()] || {};

    // Find all subcategories belonging to this parent
    const childCategories = dynamicCategories.filter(c => 
      c.id !== parent.id && (
        c.parent_id === parent.id ||
        (c.parent_name && c.parent_name.toLowerCase() === parent.name.toLowerCase()) ||
        (c.parent_slug && c.parent_slug.toLowerCase() === rawSlug)
      )
    );

    const childNames = Array.from(
      new Set(
        childCategories
          .map(c => c.name.trim())
          .filter(Boolean)
      )
    );

    // If database has subcategories for this parent, use them; otherwise fallback to default subcategories if known
    const subcategories = childNames.length > 0 ? childNames : (meta.defaultSubcategories || []);

    const name = parent.name.toUpperCase();
    const badge = meta.badge || (parent.description && parent.description.toLowerCase().includes('new') ? 'NEW' : undefined);

    return {
      id: rawSlug,
      dbId: parent.id,
      name,
      bengaliName: meta.bengaliName || parent.description || parent.name,
      badge,
      hasDropdown: subcategories.length > 0,
      featuredImage: meta.featuredImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      featuredTitle: meta.featuredTitle || `${parent.name} Collection`,
      subcategories,
      groups: groupSubcategories(subcategories, parent.name)
    };
  });
}
