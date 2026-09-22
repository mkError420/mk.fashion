export interface SubcategoryItem {
  name: string;
  count?: number;
  featured?: boolean;
}

export interface SubcategoryGroup {
  title: string;
  items: string[];
}

export interface MegaCategory {
  id: string;
  name: string;
  badge?: string;
  hasDropdown: boolean;
  featuredImage?: string;
  featuredTitle?: string;
  featuredLink?: string;
  groups?: SubcategoryGroup[];
}

const currentYear = new Date().getFullYear();

export const BLUCHEEZ_NAVBAR_ITEMS: MegaCategory[] = [
  {
    id: 'new-in',
    name: 'NEW IN',
    badge: 'NEW',
    hasDropdown: true,
    featuredImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    featuredTitle: `Eid & Festive Drop ${currentYear}`,
    groups: [
      {
        title: "Men's New Arrivals",
        items: ['Essential Panjabi', 'Exclusive Panjabi', 'Formal Shirts', 'Polo Shirts', 'Waistcoats']
      },
      {
        title: "Women's New Arrivals",
        items: ['Belwari Jamdani Sarees', 'Embroidered Kurti Sets', 'Two-Piece Kurti', 'Three-Piece Kurti', 'Anarkali']
      },
      {
        title: 'Trending Drops',
        items: ['Blucheez Black Label', 'Belwari Signature', 'Summer Polos', 'Fragrances']
      }
    ]
  },
  {
    id: 'summer',
    name: 'SUMMER',
    hasDropdown: true,
    featuredImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Summer Breeze Collection',
    groups: [
      {
        title: 'Summer Polos & Tees',
        items: ['Sweater Polos', 'Boxy-Fit Drop Shoulder Polos', 'Classic Polos', 'Drop Shoulder T-Shirt', 'Oversized T-Shirt']
      },
      {
        title: 'Lightweight Ethnic',
        items: ['Lawn Cotton Panjabi', 'Short Sleeve Panjabi', 'Cotton Pajama', 'Breathable Kurtis']
      },
      {
        title: 'Casuals & Bottoms',
        items: ['Casual Shirts', 'Relaxed Wear', 'Shorts', 'Cotton Chinos']
      }
    ]
  },
  {
    id: 'blucheez-black',
    name: 'BLUCHEEZ | BLACK',
    badge: 'LUXURY',
    hasDropdown: true,
    featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'The Monochrome Atelier',
    groups: [
      {
        title: "Men's Black",
        items: ['Panjabi | Black', 'Executive Wool Blazers', 'Tailored Black Shirts', 'Slim Fit Black Trousers']
      },
      {
        title: "Women's Black",
        items: ['Anarkali', 'Two Pieces Kurti', 'Three Pieces Kurti', 'Black Zari Suits', 'Draped Sarees']
      },
      {
        title: 'Black Society Accents',
        items: ['Obsidian Cufflinks', 'Italian Leather Belts', 'Premium Noir Fragrance']
      }
    ]
  },
  {
    id: 'belwari',
    name: 'BELWARI',
    badge: 'HERITAGE',
    hasDropdown: true,
    featuredImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Handcrafted Heritage',
    groups: [
      {
        title: 'Royal Ethnic',
        items: ['Belwari Jamdani Saree', 'Zari Embroidered Suit', 'Artisan Silk Kurtis', 'Heritage Zari Panjabi']
      },
      {
        title: 'Traditional Sets',
        items: ['Two-Piece Salwar Kameez', 'Three-Piece Kurti', 'Bridal & Reception Sets']
      }
    ]
  },
  {
    id: 'men',
    name: 'MEN',
    hasDropdown: true,
    featuredImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    featuredTitle: "The Modern Gentleman",
    groups: [
      {
        title: 'Panjabi & Ethnic',
        items: ['Essential Panjabi', 'Elegant Panjabi', 'Exclusive Panjabi', 'Panjabi | Black', 'Kabli Set', 'Waistcoat', 'Pajama']
      },
      {
        title: 'Shirts',
        items: ['Formal Shirt', 'Premium Shirt', 'Casual Shirt', 'Giza Cotton Shirt']
      },
      {
        title: 'Polo & T-Shirts',
        items: ['Sweater Polos', 'Boxy-Fit Drop Shoulder Polos', 'Classic Polos', 'Drop Shoulder T-Shirt', 'Oversized T-Shirt']
      },
      {
        title: 'Pants & Tailoring',
        items: ['Executive Wool Blazers', 'Formal Pant', 'Casual Pant', 'Jeans', 'Slim-Fit Pajama', 'Wide-Leg Pajama']
      }
    ]
  },
  {
    id: 'women',
    name: 'WOMEN',
    hasDropdown: true,
    featuredImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Graceful Elegance',
    groups: [
      {
        title: 'Ethnic & Festive',
        items: ['Salwar Kameez', 'Dhakai Jamdani Saree', 'Embroidered Kurti Sets', 'Two Pieces Kurti', 'Three Pieces Kurti', 'Anarkali']
      },
      {
        title: 'Modern & Western',
        items: ['Western Tops', 'Tops & Tunics', 'Denim Jeans', 'Wide Leg Pants', 'Seasonal Apparel']
      },
      {
        title: 'Occasion Wear',
        items: ['Belwari Heritage Sarees', 'Zari Suits', 'Designer Party Kurtis']
      }
    ]
  },
  {
    id: 'accessories',
    name: 'ACCESSORIES',
    hasDropdown: true,
    featuredImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Curated Essentials',
    groups: [
      {
        title: 'Essentials & Accents',
        items: ['Caps', 'Eyewear', 'Fragrances (Men & Women)', 'Genuine Leather Belts', 'Wallets', 'Cufflinks']
      }
    ]
  }
];
