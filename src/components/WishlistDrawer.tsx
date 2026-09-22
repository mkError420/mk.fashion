import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistDrawer: React.FC = () => {
  const { 
    isWishlistOpen, 
    closeWishlist, 
    wishlist, 
    products, 
    toggleWishlist, 
    addToCart, 
    openQuickCheckout 
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-black fill-black" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900">
              Saved Wishlist ({wishlistProducts.length})
            </h3>
          </div>

          <button
            type="button"
            onClick={closeWishlist}
            className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-neutral-800 font-serif">Your wishlist is empty</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Save your favorite Panjabis, Blazers, and Sarees to easily order them anytime with Cash on Delivery.
              </p>
              <button
                type="button"
                onClick={closeWishlist}
                className="mt-5 bg-black text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div key={product.id} className="flex gap-3 pb-4 border-b border-neutral-200 last:border-none">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded-lg border border-neutral-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-medium text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">
                        {product.bengaliName}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className="text-neutral-400 hover:text-black p-0.5"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-serif font-bold text-xs sm:text-sm text-neutral-900 truncate mt-1">
                      {product.name}
                    </h4>
                    
                    <p className="text-xs font-bold text-neutral-900 mt-0.5">
                      ৳{product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Dual Action: 1-Click COD or Add to Cart */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        openQuickCheckout(product);
                        closeWishlist();
                      }}
                      className="bg-black hover:bg-neutral-800 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>1-Click COD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product);
                      }}
                      className="bg-white hover:bg-neutral-100 text-neutral-900 text-[11px] font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 transition-colors border border-neutral-300 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>To Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-center">
          <p className="text-xs text-neutral-500">
            Items saved in your wishlist remain securely stored on your device.
          </p>
        </div>
      </div>

      <div className="flex-1" onClick={closeWishlist} />
    </div>
  );
};
