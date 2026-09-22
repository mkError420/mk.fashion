import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Maximize2 } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface HorizontalProductCardProps {
  product: Product;
}

export const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, openQuickView, addToCart } = useShop();
  const isFavorited = isInWishlist(product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      className="group relative bg-white border border-neutral-200 hover:border-black transition-colors duration-300 rounded-none overflow-hidden cursor-pointer flex flex-row h-full w-full"
      onClick={handleCardClick}
    >
      {/* Left Thumbnail Image with Smooth CSS Crossfade (No React state jumps) */}
      <div className="relative w-36 sm:w-44 bg-neutral-100 overflow-hidden flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-top transition-all duration-500 ease-out group-hover:scale-105 ${
            product.images[1] ? 'group-hover:opacity-0' : ''
          }`}
          loading="lazy"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        )}

        {product.discountPercent && (
          <span className="absolute top-2 left-2 text-[9px] font-bold bg-neutral-900 text-white px-1.5 py-0.5 rounded-none z-10">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between bg-white min-w-0">
        <div>
          {/* Subcategory & Badge */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider truncate">
              {product.subcategory || product.category}
            </span>
            {product.badge && (
              <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 bg-black text-white rounded-none shrink-0">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Titles */}
          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1 font-serif">
            {product.name}
          </h4>
          <p className="text-[10px] text-neutral-400 font-serif line-clamp-1 mt-0.5">
            {product.bengaliName}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-sm sm:text-base font-extrabold font-mono text-neutral-900">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-neutral-400 line-through font-mono">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              title="Wishlist"
              className={`w-7 h-7 flex items-center justify-center rounded-none border transition-colors cursor-pointer ${
                isFavorited
                  ? 'bg-black text-white border-black'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openQuickView(product);
              }}
              title="Quick View"
              className="w-7 h-7 flex items-center justify-center bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-none transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              title="Add to Bag"
              className="w-7 h-7 flex items-center justify-center bg-neutral-900 hover:bg-black text-white rounded-none transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
