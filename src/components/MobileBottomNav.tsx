import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const MobileBottomNav: React.FC = () => {
  const { cart, wishlist } = useShop();
  const location = useLocation();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/shop' && (location.pathname.startsWith('/shop') || location.pathname.startsWith('/collections'))) return true;
    if (path !== '/' && path !== '/shop' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-2 py-2 shadow-lg backdrop-blur-md bg-white/95">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
            isActive('/') ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
            isActive('/shop') ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-bold">Shop</span>
        </Link>

        {/* Track Parcel */}
        <Link
          to="/track"
          className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
            isActive('/track') ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] mt-1">Track</span>
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className={`relative flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
            isActive('/wishlist') ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Wishlist</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className={`relative flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
            isActive('/cart') ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1">Bag</span>
        </Link>

      </div>
    </div>
  );
};
