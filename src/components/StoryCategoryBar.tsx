import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface StoryItem {
  id: string;
  name: string;
  bengali: string;
  image: string;
  badge?: string;
  categoryId: string;
  subcategory?: string;
}

const ALL_CATEGORIES: StoryItem[] = [
  {
    id: 'panjabi',
    name: 'Eid Panjabi',
    bengali: 'পাঞ্জাবি',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
    categoryId: 'men',
    subcategory: 'Exclusive Panjabi'
  },
  {
    id: 'belwari-saree',
    name: 'Belwari Saree',
    bengali: 'বেলওয়ারী শাড়ি',
    badge: 'Handloom',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
    categoryId: 'belwari',
    subcategory: 'Belwari Jamdani Saree'
  },
  {
    id: 'black-society',
    name: 'Blucheez Black',
    bengali: 'ব্ল্যাক কালেকশন',
    badge: 'Luxury',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    categoryId: 'blucheez-black'
  },
  {
    id: 'sweater-polos',
    name: 'Sweater Polos',
    bengali: 'পোলো শার্ট',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=300&q=80',
    categoryId: 'summer',
    subcategory: 'Sweater Polos'
  },
  {
    id: 'kabli',
    name: 'Kabli Sets',
    bengali: 'কাবলি সেট',
    badge: 'Festive',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=300&q=80',
    categoryId: 'men',
    subcategory: 'Kabli Set'
  },
  {
    id: 'blazers',
    name: 'Blazers & Suits',
    bengali: 'ব্লেজার ও স্যুট',
    badge: 'Bespoke',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80',
    categoryId: 'men',
    subcategory: 'Blazer'
  },
  {
    id: 'formal-shirts',
    name: 'Formal Shirts',
    bengali: 'ফর্মাল শার্ট',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
    categoryId: 'men',
    subcategory: 'Formal Shirt'
  },
  {
    id: 'casual-shirts',
    name: 'Casual & Linen',
    bengali: 'ক্যাজুয়াল শার্ট',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=80',
    categoryId: 'men',
    subcategory: 'Casual Shirt'
  },
  {
    id: 'women-kurti',
    name: 'Women’s Kurti',
    bengali: 'কুর্তি সেট',
    badge: 'Ethnic',
    image: 'https://images.unsplash.com/photo-1583391733975-08149e91024b?auto=format&fit=crop&w=300&q=80',
    categoryId: 'women',
    subcategory: 'Embroidered Kurti Sets'
  },
  {
    id: 'belwari-salwar',
    name: 'Salwar Suits',
    bengali: 'সালোয়ার কামিজ',
    badge: 'Belwari',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
    categoryId: 'belwari',
    subcategory: 'Belwari Three-Piece'
  },
  {
    id: 'women-western',
    name: 'Western Tops',
    bengali: 'ওয়েস্টার্ন টপস',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
    categoryId: 'women',
    subcategory: 'Western Tops & Tunics'
  },
  {
    id: 'pants-chinos',
    name: 'Pants & Chinos',
    bengali: 'চীনোস ট্রাউজার',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=300&q=80',
    categoryId: 'men',
    subcategory: 'Chino Pants'
  },
  {
    id: 'denim-jeans',
    name: 'Denim & Jeans',
    bengali: 'ডেনিম জিন্স',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=300&q=80',
    categoryId: 'men',
    subcategory: 'Denim Jeans'
  },
  {
    id: 't-shirts',
    name: 'Drop Shoulder Tees',
    bengali: 'টি-শার্ট',
    badge: 'Heavyweight',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
    categoryId: 'men',
    subcategory: 'T-Shirts & Polos'
  },
  {
    id: 'waistcoats',
    name: 'Waistcoats',
    bengali: 'ওয়েস্টকোট',
    badge: 'Festive',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    categoryId: 'men',
    subcategory: 'Waistcoat'
  },
  {
    id: 'footwear',
    name: 'Leather Loafers',
    bengali: 'লেদার লোফার',
    badge: 'Leather',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80',
    categoryId: 'footwear'
  },
  {
    id: 'fragrances',
    name: 'Fragrances & Oud',
    bengali: 'পারফিউম ও আতর',
    badge: 'Oud',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=300&q=80',
    categoryId: 'accessories',
    subcategory: 'Fragrances (Men & Women)'
  },
  {
    id: 'accessories',
    name: 'Belts & Wallets',
    bengali: 'বেল্ট ও ওয়ালেট',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80',
    categoryId: 'accessories',
    subcategory: 'Leather Wallets & Belts'
  }
];

export const StoryCategoryBar: React.FC = () => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);

  const handleStoryClick = (item: StoryItem) => {
    if (item.subcategory) {
      navigate(`/shop/${item.categoryId}?sub=${encodeURIComponent(item.subcategory)}`);
    } else {
      navigate(`/shop/${item.categoryId}`);
    }
  };

  // Duplicate for seamless continuous looping
  const duplicatedCategories = [...ALL_CATEGORIES, ...ALL_CATEGORIES];

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
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {duplicatedCategories.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              type="button"
              onClick={() => handleStoryClick(item)}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer text-center focus:outline-none w-20 sm:w-24"
            >
              {/* Image Circle with Editorial Border */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 border-neutral-300 group-hover:border-black transition-all duration-300 transform group-hover:scale-105 overflow-hidden shadow-xs">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
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
              <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                {item.bengali}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
