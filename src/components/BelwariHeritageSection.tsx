import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const BelwariHeritageSection: React.FC = () => {
  const { products } = useShop();

  const belwariProducts = products
    .filter(p => p.category === 'belwari' || p.subcategory?.toLowerCase().includes('saree') || p.subcategory?.toLowerCase().includes('kurti') || p.subcategory?.toLowerCase().includes('suit'))
    .slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Belwari Header Banner */}
      <div className="bg-[#fcfaf7] border border-[#e8ded0] p-6 sm:p-10 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-[#8c6b3e] text-white">
                Belwari By Blucheez
              </span>
              <span className="text-xs text-[#8c6b3e] font-serif italic">
                বেলওয়ারী হেরিটেজ হ্যান্ডলুম
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2d241e] font-serif tracking-tight">
              Artisan Jamdani & Resham Silk Handlooms
            </h2>

            <p className="text-xs sm:text-sm text-[#66574a] leading-relaxed">
              Preserving centuries of Bengali weaving heritage. Authentic Sonargaon Jamdani sarees, zari-bordered three-piece salwar kameez, and hand-embroidered resham silk kurtis crafted with meticulous craftsmanship.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/shop/belwari"
                className="bg-[#2d241e] hover:bg-[#43362d] text-white text-xs font-bold px-6 py-3.5 rounded-none uppercase tracking-widest inline-flex items-center space-x-2 transition-all shadow-xs"
              >
                <span>Explore Belwari Heritage</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop/belwari?sub=Belwari+Jamdani+Saree"
                className="border border-[#8c6b3e] text-[#8c6b3e] hover:bg-[#8c6b3e] hover:text-white text-xs font-bold px-5 py-3.5 rounded-none uppercase tracking-wider transition-colors inline-flex items-center space-x-1.5"
              >
                <span>Jamdani Sarees</span>
              </Link>
            </div>
          </div>

          {/* Artisan Badge & Metric */}
          <div className="w-full md:w-auto p-6 bg-white border border-[#e8ded0] text-center space-y-2 flex-shrink-0">
            <Award className="w-8 h-8 text-[#8c6b3e] mx-auto" />
            <span className="block text-2xl font-serif font-black text-[#2d241e]">100% Handloom</span>
            <span className="block text-xs uppercase tracking-wider text-[#66574a]">Authentic Bengali Weavers</span>
            <span className="block text-[11px] text-[#8c6b3e] font-medium">Free Saree Fall & Pico Included</span>
          </div>

        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {belwariProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
};
