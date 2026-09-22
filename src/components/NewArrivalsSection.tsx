import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const NewArrivalsSection: React.FC = () => {
  const { products } = useShop();

  // Dynamic year calculations for automatic year updates
  const currentYear = new Date().getFullYear();
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const bengaliYear = currentYear
    .toString()
    .split('')
    .map((d) => bengaliDigits[parseInt(d, 10)] || d)
    .join('');

  // Get the last 12 items (or newest 12 items in catalog - 3 rows of 4 columns)
  const newArrivalProducts = [...products].reverse().slice(0, 12);

  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 bg-black text-white flex items-center space-x-1">
              <span>JUST DROPPED</span>
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              নতুন কালেকশন {bengaliYear} • {currentYear} Edition
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
            New Arrivals {currentYear}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Fresh artisan silhouettes, bespoke festive weaves, and contemporary seasonal staples.
          </p>
        </div>

        <Link
          to="/shop?sort=newest"
          className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors group flex-shrink-0"
        >
          <span>View All Products ({products.length})</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 3 Items per row on MD, 4 on LG, 2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
        {newArrivalProducts.map((product) => (
          <ProductCard key={product.id} product={product} tall={true} />
        ))}
      </div>

      {/* Bottom Explore CTA */}
      <div className="mt-8 text-center pt-6 border-t border-neutral-100">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-8 py-3.5 uppercase tracking-widest transition-all shadow-xs"
        >
          <span>Explore All New Arrivals {currentYear}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
