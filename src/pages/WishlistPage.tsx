import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, ChevronRight, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, addToCart, openQuickCheckout, toggleWishlist } = useShop();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Breadcrumb */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-4 border-b border-neutral-100">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">Wishlist</span>
        </nav>
      </div>

      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-8">
        
        <div className="flex items-baseline justify-between mb-8 border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
              My Wishlist (পছন্দের তালিকা)
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Save your favorite garments and order anytime via Cash on Delivery.
            </p>
          </div>
          <span className="text-xs sm:text-sm text-neutral-500 font-medium">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-200 max-w-2xl mx-auto p-8">
            <div className="w-20 h-20 rounded-full bg-neutral-200/60 flex items-center justify-center mx-auto mb-4 text-neutral-500">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-serif font-bold text-neutral-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-6">
              You haven't saved any items yet. Browse our collections and click the heart icon to save products here.
            </p>
            <Link
              to="/collections/all"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-8 py-3.5 rounded-full uppercase tracking-wider transition-all inline-flex items-center space-x-2"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
