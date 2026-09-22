import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryType } from '../types';

export const CategoryShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { updateFilter } = useShop();

  const categories: {
    type: CategoryType;
    subcategory?: string;
    title: string;
    bengaliTitle: string;
    subtitle: string;
    image: string;
    badge: string;
  }[] = [
    {
      type: 'men',
      subcategory: 'Exclusive Panjabi',
      title: 'Men | Panjabi',
      bengaliTitle: 'পাঞ্জাবি ও কাবলি সেট',
      subtitle: 'Essential, Elegant & Exclusive Cuts',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      badge: 'Festive & Eid Drop'
    },
    {
      type: 'blucheez-black',
      title: 'Blucheez | Black',
      bengaliTitle: 'ব্লুচিজ ব্ল্যাক সোসাইটি',
      subtitle: 'Monochrome Tailored Atelier',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80',
      badge: 'Black Label Edition'
    },
    {
      type: 'belwari',
      title: 'Belwari Heritage',
      bengaliTitle: 'বেলওয়ারী হেরিটেজ শাড়ি ও কুর্তি',
      subtitle: 'Handloom Jamdani & Zari Weaves',
      image: 'https://images.unsplash.com/photo-1610030469668-936ce4489b4f?auto=format&fit=crop&w=700&q=80',
      badge: 'Artisanal Royal Silk'
    },
    {
      type: 'summer',
      title: 'Summer Breeze Polos',
      bengaliTitle: 'সামার নিট ও ড্রপ শোল্ডার পোলো',
      subtitle: 'Sweater Polos & Drop-Shoulder Tees',
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=700&q=80',
      badge: 'Summer 2026 Collection'
    },
    {
      type: 'men',
      subcategory: 'Formal Shirt',
      title: 'Executive Shirting',
      bengaliTitle: 'ফরমাল ও ক্যাজুয়াল শার্ট',
      subtitle: '100% Giza Cotton & Oxford Tailoring',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80',
      badge: 'Non-Iron Precision'
    },
    {
      type: 'accessories',
      title: 'Accessories & Fragrances',
      bengaliTitle: 'সুগন্ধি ও লেদার এক্সেসরিজ',
      subtitle: 'French Fragrances & Vegetable-Tanned Belts',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80',
      badge: 'Curated Essentials'
    }
  ];

  const handleSelect = (category: CategoryType, subcategory?: string) => {
    updateFilter('category', category);
    updateFilter('subcategory', subcategory);
    if (category === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${category}${subcategory ? `?sub=${encodeURIComponent(subcategory)}` : ''}`);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest text-neutral-500 font-bold mb-1">
              <span>Blucheez Categories & Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900 tracking-tight">
              Curated Collections
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Explore signature departments crafted with contemporary fits and heritage artisan techniques.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              updateFilter('category', 'all');
              updateFilter('subcategory', undefined);
              navigate('/shop');
            }}
            className="mt-4 md:mt-0 text-xs font-bold text-neutral-900 hover:text-neutral-600 inline-flex items-center cursor-pointer tracking-wider uppercase"
          >
            <span>View All Departments</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Category Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(cat.type, cat.subcategory)}
              className="group relative h-80 rounded-none overflow-hidden cursor-pointer bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200 hover:border-black"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-top opacity-80 group-hover:scale-105 group-hover:opacity-70 transition-all duration-500 rounded-none"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Top Badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-none bg-white text-black shadow-xs">
                  {cat.badge}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform group-hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-300 block mb-0.5 font-medium">
                      {cat.bengaliTitle}
                    </span>
                    <h3 className="text-xl font-bold font-serif text-white tracking-wide group-hover:text-neutral-200">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 line-clamp-1">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-none bg-white text-black flex items-center justify-center transform group-hover:scale-110 group-hover:bg-neutral-100 transition-all duration-200 flex-shrink-0 ml-3">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
