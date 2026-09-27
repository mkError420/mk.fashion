import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFrontendData, FrontendCategory } from '../context/FrontendDataContext';
import { useShop } from '../context/ShopContext';

interface StoryItem {
  id: string;
  name: string;
  bengali: string;
  image: string;
  badge?: string;
  categoryId: string;
  subcategory?: string;
}

// Curated high-resolution fallback photos for categories if no custom photo was uploaded or set
const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  panjabi: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
  kabli: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=300&q=80',
  saree: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
  jamdani: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
  polo: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=300&q=80',
  blazer: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80',
  suit: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80',
  shirt: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
  kurti: 'https://images.unsplash.com/photo-1583391733975-08149e91024b?auto=format&fit=crop&w=300&q=80',
  salwar: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
  kameez: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
  western: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
  tunic: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
  chino: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=300&q=80',
  pant: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=300&q=80',
  trouser: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=300&q=80',
  jeans: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=300&q=80',
  denim: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=300&q=80',
  't-shirt': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
  waistcoat: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
  fragrance: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=300&q=80',
  perfume: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=300&q=80',
  oud: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=300&q=80',
  belt: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80',
  men: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
  women: 'https://images.unsplash.com/photo-1583391733975-08149e91024b?auto=format&fit=crop&w=300&q=80',
  summer: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=300&q=80',
  belwari: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
  black: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
  default: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80'
};

function resolveCategoryImage(cat: FrontendCategory, products: any[]): string {
  // 1. Direct custom image uploaded or set by admin
  if (cat.image_url && cat.image_url.trim()) {
    return cat.image_url.trim();
  }

  // 2. Fallback image provided by backend SQL query from latest product in this category
  if (cat.product_fallback_image && cat.product_fallback_image.trim()) {
    return cat.product_fallback_image.trim();
  }

  // 3. Match from active storefront products list
  const matchedProduct = products.find(p => {
    if (p.subcategory && p.subcategory.toLowerCase() === cat.name.toLowerCase()) return true;
    if (p.category && p.category.toLowerCase() === cat.name.toLowerCase()) return true;
    if (cat.id && p.category_id === cat.id) return true;
    return false;
  });

  if (matchedProduct) {
    if (matchedProduct.images && matchedProduct.images.length > 0 && matchedProduct.images[0]) {
      return matchedProduct.images[0];
    }
    if (matchedProduct.image_url) {
      return matchedProduct.image_url;
    }
  }

  // 4. Match keyword to high-res curated photography
  const haystack = `${cat.name} ${cat.slug} ${cat.parent_name || ''}`.toLowerCase();
  for (const [key, url] of Object.entries(FALLBACK_CATEGORY_IMAGES)) {
    if (key !== 'default' && haystack.includes(key)) {
      return url;
    }
  }

  return FALLBACK_CATEGORY_IMAGES.default;
}

export const StoryCategoryBar: React.FC = () => {
  const navigate = useNavigate();
  const { categories: dynamicCategories, isLoading } = useFrontendData();
  const { products } = useShop();
  const [isPaused, setIsPaused] = useState(false);

  // Dynamically build ticker items from admin dashboard main categories only (no subcategories)
  const tickerItems = useMemo<StoryItem[]>(() => {
    if (!dynamicCategories || dynamicCategories.length === 0) {
      return [];
    }

    // Only main (parent) categories with ticker enabled
    const mainCategories = dynamicCategories.filter(
      c => (c.parent_id === null || c.parent_id === 0) &&
           c.show_in_ticker !== 0 && 
           c.show_in_ticker !== false
    );

    return mainCategories.map(c => {
      const itemImage = resolveCategoryImage(c, products);

      return {
        id: c.slug || `cat-${c.id}`,
        name: c.name,
        bengali: c.bengali_name || c.description || '',
        badge: c.badge || undefined,
        image: itemImage,
        categoryId: c.slug || c.id.toString(),
      };
    });
  }, [dynamicCategories, products]);

  const handleStoryClick = (item: StoryItem) => {
    navigate(`/shop/${item.categoryId}`);
  };

  // If loading and no categories yet, show modern animated circular skeleton
  if (isLoading && tickerItems.length === 0) {
    return (
      <section className="bg-white border-b border-neutral-200 w-full max-w-full overflow-hidden py-4 sm:py-5">
        <div className="flex space-x-4 sm:space-x-6 px-4 animate-pulse">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-shrink-0 w-20 sm:w-24">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-200" />
              <div className="w-14 h-3 bg-neutral-200 rounded mt-2.5" />
              <div className="w-10 h-2 bg-neutral-100 rounded mt-1" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If no items are configured for ticker
  if (tickerItems.length === 0) {
    return null;
  }

  // Duplicate for seamless continuous infinite marquee
  const duplicatedCategories = [...tickerItems, ...tickerItems];

  return (
    <section className="bg-white border-b border-neutral-200 w-full max-w-full overflow-hidden py-4 sm:py-5">
      {/* INFINITY MARQUEE ROW (Auto-gliding loop with smooth Pause on Hover) */}
      <div 
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Subtle Fade Gradients on edges for smooth infinite effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div 
          className="animate-marquee-infinite flex space-x-4 sm:space-x-6"
          style={{ 
            animationDuration: '40s',
            animationPlayState: isPaused ? 'paused' : 'running' 
          }}
        >
          {duplicatedCategories.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              type="button"
              onClick={() => handleStoryClick(item)}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer text-center focus:outline-none w-20 sm:w-24"
            >
              {/* Image Circle with Editorial Border */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 border-neutral-300 group-hover:border-black transition-all duration-300 transform group-hover:scale-105 overflow-hidden shadow-xs bg-neutral-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = FALLBACK_CATEGORY_IMAGES.default;
                  }}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-none uppercase tracking-wider border border-white">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Labels */}
              <span className="text-xs font-bold text-neutral-900 mt-2 tracking-tight group-hover:text-black transition-colors whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                {item.name}
              </span>
              {item.bengali && (
                <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full text-center font-bengali">
                  {item.bengali}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
