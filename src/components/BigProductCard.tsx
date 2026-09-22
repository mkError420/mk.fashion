import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Maximize2, Sparkles, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface BigProductCardProps {
  product: Product;
  rank?: number;
}

export const BigProductCard: React.FC<BigProductCardProps> = ({ product, rank }) => {
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
      className="group relative h-full w-full flex flex-col bg-neutral-900 border border-neutral-200 hover:border-black transition-colors duration-300 rounded-none overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Full-bleed Big Image Container with CSS Crossfade */}
      <div className="relative w-full h-full flex-1 bg-neutral-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${
            product.images[1] ? 'group-hover:opacity-0' : ''
          }`}
          loading="lazy"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} editorial view`}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Ambient Dark Gradient on bottom for high contrast editorial presentation */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Top-Left Rank & Badges */}
        <div className="absolute top-0 left-0 flex flex-col gap-1 z-10">
          {rank && (
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 bg-amber-400 text-black flex items-center space-x-1 shadow-md">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>TOP #{rank}</span>
            </span>
          )}
          {product.badge && (
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-black text-white rounded-none w-fit">
              {product.badge}
            </span>
          )}
          {product.discountPercent && (
            <span className="text-[9px] sm:text-[10px] font-bold bg-neutral-900 text-white px-2.5 py-0.5 rounded-none w-fit">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Vertical Floating Action Buttons (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`w-9 h-9 flex items-center justify-center transition-all cursor-pointer rounded-none border shadow-md ${
              isFavorited
                ? 'bg-black text-white border-black'
                : 'bg-white/95 hover:bg-black hover:text-white text-neutral-800 border-neutral-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
          </button>

          {/* Quick View */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            title="Quick View"
            className="w-9 h-9 flex items-center justify-center bg-white/95 hover:bg-black hover:text-white text-neutral-800 border border-neutral-200 transition-all cursor-pointer rounded-none shadow-md"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Quick Add To Bag */}
          <button
            type="button"
            onClick={handleQuickAdd}
            title="Quick Add to Bag"
            className="w-9 h-9 flex items-center justify-center bg-white/95 hover:bg-black hover:text-white text-neutral-800 border border-neutral-200 transition-all cursor-pointer rounded-none shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          {/* View Details */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            title="View Product"
            className="w-9 h-9 flex items-center justify-center bg-white/95 hover:bg-black hover:text-white text-neutral-800 border border-neutral-200 transition-all cursor-pointer rounded-none shadow-md"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Big Editorial Content Overlay (Bottom) */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-10 text-white">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-amber-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FEATURED SHOWCASE</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-serif line-clamp-1 group-hover:text-amber-200 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-300 font-serif line-clamp-1 mt-0.5 opacity-90">
            {product.bengaliName}
          </p>

          {/* Price & Add Button */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
            <div className="flex items-baseline space-x-2">
              <span className="text-base sm:text-xl font-extrabold font-mono text-white">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-neutral-400 line-through font-mono">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="bg-white hover:bg-neutral-200 text-black text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 transition-all shadow-md flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add To Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
