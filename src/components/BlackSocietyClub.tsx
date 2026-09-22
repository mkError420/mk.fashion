import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Scissors, Truck, Tag, ArrowRight, Award } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const BlackSocietyClub: React.FC = () => {
  const { products } = useShop();

  const blackProducts = products
    .filter(p => p.category === 'blucheez-black' || p.name.toLowerCase().includes('black'))
    .slice(0, 4);

  const clubPerks = [
    {
      icon: Scissors,
      title: 'Complimentary Alterations',
      desc: 'Free bespoke tailoring adjustments at all flagship stores in Dhaka.'
    },
    {
      icon: Truck,
      title: 'VIP Free Express Delivery',
      desc: 'Zero shipping charge on all domestic deliveries with priority dispatch.'
    },
    {
      icon: Tag,
      title: 'Exclusive Member Discounts',
      desc: 'Enjoy special private sales and up to 15% reward credits.'
    },
    {
      icon: Sparkles,
      title: 'Early Access to Limited Drops',
      desc: 'Reserve limited-edition Panjabi and artisan silk kurtis before public release.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Editorial Luxury Black Container */}
      <div className="bg-neutral-950 text-white border border-neutral-800 rounded-none p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        
        {/* Background Subtle Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-900/40 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand Story & Society Intro */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1 bg-white text-black rounded-none">
                Black Society
              </span>
              <span className="text-xs text-neutral-400 font-serif italic">
                The Monochrome Luxury Atelier
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-white leading-tight">
              Bespoke Obsidian Tailoring & Exclusive Member Privileges
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              Blucheez Black is an ode to timeless noir. Each garment combines jet-black hues, structured wool and fine Egyptian cotton blends, and crest metal details. Join the <strong>Black Society Club</strong> to unlock bespoke craftsmanship services.
            </p>

            {/* Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {clubPerks.map((perk, idx) => {
                const Icon = perk.icon;
                return (
                  <div key={idx} className="flex items-start space-x-2.5 p-3 bg-neutral-900/80 border border-neutral-800 rounded-none">
                    <Icon className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {perk.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        {perk.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-3">
              <Link
                to="/shop/blucheez-black"
                className="bg-white hover:bg-neutral-200 text-black text-xs font-extrabold px-6 py-3.5 rounded-none uppercase tracking-widest inline-flex items-center space-x-2 transition-all shadow-md"
              >
                <span>Shop Blucheez Black Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/account"
                className="border border-neutral-700 hover:border-white text-neutral-300 hover:text-white text-xs font-bold px-5 py-3.5 rounded-none uppercase tracking-wider transition-colors inline-flex items-center space-x-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Join Black Society Free</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Editorial Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative border-2 border-neutral-800 overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Blucheez Black Atelier"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-neutral-900/90 border border-neutral-800 backdrop-blur-xs">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
                  Signature Cut
                </span>
                <h4 className="text-sm font-bold text-white font-serif">
                  Matte Noir Executive Wool Blazer & Trousers
                </h4>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800">
                  <span className="text-xs font-bold text-neutral-200">৳7,950 BDT</span>
                  <Link
                    to="/shop/blucheez-black"
                    className="text-[11px] font-bold text-white underline uppercase"
                  >
                    View Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Black Collection Product Row */}
        <div className="mt-10 pt-8 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300">
              Featured Noir Apparel
            </h3>
            <Link
              to="/shop/blucheez-black"
              className="text-xs text-neutral-400 hover:text-white underline uppercase tracking-wider font-bold"
            >
              Browse All Noir ({products.filter(p => p.category === 'blucheez-black').length})
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {blackProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
