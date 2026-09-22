import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Maximize2 } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  redirectToCategory?: boolean;
  tall?: boolean;
  className?: string;
  imageAspectClassName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  redirectToCategory = false,
  tall = false,
  className = '',
  imageAspectClassName = ''
}) => {
  const navigate = useNavigate();
  const { 
    isInWishlist, 
    toggleWishlist, 
    openQuickView, 
    addToCart 
  } = useShop();

  const isFavorited = isInWishlist(product.id);

  const handleCardClick = () => {
    if (redirectToCategory) {
      if (product.subcategory) {
        navigate(`/shop/${product.category}?sub=${encodeURIComponent(product.subcategory)}`);
      } else {
        navigate(`/shop/${product.category}`);
      }
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const aspectClasses = imageAspectClassName 
    ? imageAspectClassName 
    : tall 
      ? 'aspect-[3/4] md:aspect-[3/4.6] lg:aspect-[3/4.9] md:min-h-[460px] lg:min-h-[520px] xl:min-h-[560px]' 
      : 'aspect-3/4';

  return (
    <div 
      className={`group relative bg-white border border-neutral-200 hover:border-black transition-colors duration-300 rounded-none overflow-hidden cursor-pointer flex flex-col h-full w-full ${className}`}
      onClick={handleCardClick}
    >
      {/* Full Image Container with Smooth CSS Crossfade */}
      <div className={`relative w-full bg-neutral-100 overflow-hidden flex-1 ${aspectClasses}`}>
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${
            product.images[1] ? 'group-hover:opacity-0' : ''
          }`}
          loading="lazy"
        />

        {/* Secondary Hover Image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Top-Left Badges */}
        <div className="absolute top-0 left-0 flex flex-col gap-0.5 z-10">
          {product.badge && (
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-black text-white rounded-none">
              {product.badge}
            </span>
          )}
          {product.discountPercent && (
            <span className="text-[9px] sm:text-[10px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-none w-fit">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Vertical Action Buttons (Top Right) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`w-8 h-8 flex items-center justify-center transition-all cursor-pointer rounded-none border shadow-xs ${
              isFavorited
                ? 'bg-black text-white border-black'
                : 'bg-white/95 hover:bg-black hover:text-white text-neutral-800 border-neutral-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
          </button>

          {/* Quick View */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            title="Quick View"
            className="w-8 h-8 flex items-center justify-center bg-white/95 hover:bg-black hover:text-white text-neutral-800 border border-neutral-200 transition-all cursor-pointer rounded-none shadow-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Quick Add To Bag */}
          <button
            type="button"
            onClick={handleQuickAdd}
            title="Quick Add to Bag"
            className="w-8 h-8 flex items-center justify-center bg-white/95 hover:bg-black hover:text-white text-neutral-800 border border-neutral-200 transition-all cursor-pointer rounded-none shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>

          {/* View Details */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            title="View Product"
            className="w-8 h-8 flex items-center justify-center bg-white/95 hover:bg-black hover:text-white text-neutral-800 border border-neutral-200 transition-all cursor-pointer rounded-none shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Minimal Price Tag (Bottom Left) */}
        <div className="absolute bottom-2 left-2 z-10 bg-black/80 backdrop-blur-xs text-white px-2.5 py-1 text-xs font-bold font-mono tracking-wide">
          ৳{product.price.toLocaleString()}
        </div>

        {/* Hover Quick View / Expand Bar on Bottom */}
        <div className="hidden sm:block absolute bottom-0 inset-x-0 bg-black text-white text-center py-2 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          VIEW DETAILS (বিস্তারিত দেখুন)
        </div>
      </div>
    </div>
  );
};
