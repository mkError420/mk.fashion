import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const FestiveTabShowcase: React.FC = () => {
  const { products } = useShop();

  // Curate 12 high-impact festive items spanning Men's & Women's collections
  const displayedProducts = products
    .filter(p => p.gender === 'men' || p.gender === 'women' || p.category === 'men' || p.category === 'women' || p.category === 'belwari')
    .slice(0, 12);

  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Product Grid (12 Items) - Clicking any image redirects directly to the Shop page with its category and subcategory */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {displayedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            redirectToCategory={true} 
          />
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 text-center pt-6 border-t border-neutral-100">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold px-8 py-3.5 rounded-none uppercase tracking-widest transition-all shadow-xs"
        >
          <span>Explore More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
