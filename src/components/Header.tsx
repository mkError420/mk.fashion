import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Truck, 
  Phone, 
  Menu, 
  X, 
  ArrowRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryType } from '../types';
import { BLUCHEEZ_NAVBAR_ITEMS, MegaCategory } from '../data/blucheezMenu';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    wishlist, 
    filters, 
    updateFilter, 
    openCart, 
    openWishlist, 
    openTracking, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    products
  } = useShop();

  const [searchInput, setSearchInput] = useState(filters.query);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<any>(null);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Sync search input with filter state
  useEffect(() => {
    setSearchInput(filters.query);
  }, [filters.query]);

  // Click outside to close search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = !searchContainerRef.current || !searchContainerRef.current.contains(event.target as Node);
      const isOutsideMobile = !mobileSearchContainerRef.current || !mobileSearchContainerRef.current.contains(event.target as Node);
      
      if (isOutsideDesktop && isOutsideMobile) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (productName: string) => {
    setIsSearchFocused(false);
    setSearchInput(productName);
    navigate(`/shop?q=${encodeURIComponent(productName)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (searchInput.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const handleSuggestionClick = (term: string) => {
    setSearchInput(term);
    setIsSearchFocused(false);
    navigate(`/shop?q=${encodeURIComponent(term)}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    setHoveredCategory(null);
    setIsMobileMenuOpen(false);
    if (categoryId === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${categoryId}`);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryName: string) => {
    setHoveredCategory(null);
    setIsMobileMenuOpen(false);
    if (categoryId === 'all') {
      navigate(`/shop?sub=${encodeURIComponent(subcategoryName)}`);
    } else {
      navigate(`/shop/${categoryId}?sub=${encodeURIComponent(subcategoryName)}`);
    }
  };

  // Hover handlers for mega-menu with grace delay
  const handleMouseEnterNav = (id: string) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setHoveredCategory(id);
  };

  const handleMouseLeaveNav = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    megaMenuTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 250);
  };

  // Auto-complete match suggestions
  const suggestedProducts = searchInput.trim().length > 0 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.category.toLowerCase().includes(searchInput.toLowerCase()) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(searchInput.toLowerCase())) ||
        p.fabric.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.bengaliName.includes(searchInput)
      ).slice(0, 4)
    : [];

  const popularSearches = ['Panjabi', 'Polo Shirt', 'Belwari Saree', 'Blucheez Black', 'Kabli Set', 'Fragrance'];

  const activeMegaCategory = BLUCHEEZ_NAVBAR_ITEMS.find(c => c.id === hoveredCategory);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 w-full shadow-xs">
      
      {/* Top Announcement Bar - Blucheez Monochrome & Clean */}
      <div className="bg-black text-neutral-300 text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 border-b border-neutral-800 w-full overflow-hidden">
        <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto flex flex-nowrap sm:flex-wrap items-center justify-between gap-1 sm:gap-2">
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs truncate min-w-0 flex-1">
            <span className="font-semibold tracking-wide text-white uppercase flex items-center truncate">
              <span className="truncate">Cash on Delivery Available Nationwide • 100% Cotton</span>
            </span>
            <span className="hidden md:inline text-neutral-600 shrink-0">•</span>
            <span className="hidden md:inline text-neutral-300 shrink-0">
              Inside Dhaka ৳60 | Outside ৳120
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 text-[10px] sm:text-xs shrink-0">
            <Link 
              to="/track" 
              className="inline-flex items-center text-neutral-300 hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline font-medium"
            >
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-white" />
              <span className="whitespace-nowrap">Track</span>
            </Link>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <Link 
              to="/admin/login" 
              className="inline-flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
            >
              <span className="whitespace-nowrap">Admin</span>
            </Link>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <div className="hidden sm:flex items-center text-neutral-300">
              <Phone className="w-3 h-3 mr-1 text-white" />
              <span>Hotline: <strong className="text-white">09613-258248</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="w-full max-w-7xl md:max-w-none px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Mobile Menu Trigger & Logo Group */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Mobile Menu Trigger */}
            <button 
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 -ml-1 text-neutral-800 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Brand Identity: BLUCHEEZ */}
            <Link 
              to="/"
              className="flex flex-col flex-shrink-0 select-none group" 
            >
              <div className="flex items-center space-x-1">
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-widest text-black font-sans uppercase">
                  BLUCHEEZ
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest px-1 py-0.5 rounded bg-black text-white font-bold">
                  .FASHION
                </span>
              </div>
              <p className="text-[8px] sm:text-[9px] text-neutral-500 uppercase tracking-widest font-semibold hidden sm:block">
                Modern Lifestyle & Heritage Atelier
              </p>
            </Link>
          </div>

          {/* Search Bar with Live Suggestions (Desktop) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-2 sm:mx-6 hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <input
                  id="header-desktop-search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search Panjabi, Polos, Belwari Sarees, Blucheez Black..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-full pl-11 pr-24 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <Search className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none" />
                
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => { setSearchInput(''); updateFilter('query', ''); }}
                    className="absolute right-20 text-neutral-400 hover:text-neutral-700 text-xs px-1.5 py-0.5 rounded"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-neutral-200 py-3 z-50 overflow-hidden">
                {suggestedProducts.length > 0 ? (
                  <div className="divide-y divide-neutral-100">
                    <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                      <span>Matching Products ({suggestedProducts.length})</span>
                      <span className="text-[10px] text-neutral-400 font-normal">Click product to view</span>
                    </div>
                    {suggestedProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleProductClick(p.name)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors group"
                      >
                        <img src={p.images[0]} alt={p.name} className="w-11 h-14 object-cover rounded border border-neutral-200 group-hover:border-black transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-black">{p.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{p.subcategory || p.fabric} • <span className="text-black font-bold">৳{p.price.toLocaleString()}</span></p>
                        </div>
                        <span className="text-[11px] font-bold text-neutral-400 group-hover:text-black uppercase tracking-wider flex items-center gap-1 transition-colors">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    ))}

                    {/* View all matching in catalog */}
                    <div
                      onClick={() => {
                        setIsSearchFocused(false);
                        navigate(`/shop?q=${encodeURIComponent(searchInput.trim())}`);
                      }}
                      className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 cursor-pointer flex items-center justify-between text-xs font-bold text-black transition-colors"
                    >
                      <span>View all results for "{searchInput}"</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ) : null}

                <div className="px-4 pt-2.5 pb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                    Popular Searches on Blucheez
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSearches.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleSuggestionClick(tag)}
                        className="text-xs bg-neutral-100 hover:bg-black hover:text-white text-neutral-700 px-3 py-1 rounded-full transition-colors cursor-pointer border border-neutral-200 font-medium"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            
            {/* Courier Tracking Quick Button */}
            <Link
              id="header-track-order-btn"
              to="/track"
              className="hidden xl:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300 text-neutral-800 hover:text-black hover:border-black transition-colors text-xs font-semibold cursor-pointer bg-white"
            >
              <Truck className="w-4 h-4 text-black" />
              <span>Track Order</span>
            </Link>

            {/* Wishlist Button */}
            <Link
              id="header-wishlist-btn"
              to="/wishlist"
              className="relative p-2 sm:p-2.5 text-neutral-800 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-black text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger - Solid Black */}
            <button
              id="header-cart-btn"
              type="button"
              onClick={openCart}
              className="flex items-center space-x-1.5 sm:space-x-2 bg-black hover:bg-neutral-800 text-white px-3 sm:px-4 py-2 rounded-full transition-all cursor-pointer active:scale-95 shrink-0"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-white text-black text-[9px] sm:text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight pl-1">
                <span className="text-[10px] text-neutral-300 uppercase font-semibold">Bag</span>
                <span className="text-xs font-bold">৳{cartSubtotal.toLocaleString()}</span>
              </div>
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div ref={mobileSearchContainerRef} className="sm:hidden pb-2.5 pt-0.5 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              id="header-mobile-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search Blucheez..."
              className="w-full bg-neutral-50 border border-neutral-300 rounded-full pl-9 pr-16 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black"
            />
            <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
            >
              Find
            </button>
          </form>

          {/* Mobile Live Suggestions Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-neutral-200 py-2.5 z-50 overflow-hidden max-h-[75vh] overflow-y-auto">
              {suggestedProducts.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                    <span>Products ({suggestedProducts.length})</span>
                    <span className="text-[9px] text-neutral-400">Tap to view</span>
                  </div>
                  {suggestedProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleProductClick(p.name)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-50 active:bg-neutral-100 cursor-pointer transition-colors"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded border border-neutral-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{p.subcategory || p.fabric} • <span className="text-black font-bold">৳{p.price.toLocaleString()}</span></p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    </div>
                  ))}

                  {/* View all matching in catalog */}
                  <div
                    onClick={() => {
                      setIsSearchFocused(false);
                      navigate(`/shop?q=${encodeURIComponent(searchInput.trim())}`);
                    }}
                    className="px-3 py-2 bg-neutral-50 active:bg-neutral-100 cursor-pointer flex items-center justify-between text-xs font-bold text-black"
                  >
                    <span>View all for "{searchInput}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : null}

              <div className="px-3 pt-2 pb-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-1">
                  {popularSearches.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSuggestionClick(tag)}
                      className="text-[11px] bg-neutral-100 active:bg-black active:text-white text-neutral-700 px-2.5 py-1 rounded-full transition-colors border border-neutral-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Blucheez Mega-Menu Navigation Bar */}
      <nav 
        className="hidden lg:block bg-neutral-50 border-t border-neutral-200 relative"
        onMouseLeave={handleMouseLeaveNav}
      >
        <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto">
          <ul className="flex items-center justify-center space-x-6 text-xs uppercase font-bold tracking-wider text-neutral-800">
            
            {/* Home Link */}
            <li>
              <Link
                to="/"
                onMouseEnter={() => setHoveredCategory(null)}
                className="py-3 px-1 transition-colors cursor-pointer border-b-2 border-transparent text-neutral-700 hover:text-black hover:border-black font-extrabold flex items-center space-x-1"
              >
                <span>HOME</span>
              </Link>
            </li>

            {/* Shop All */}
            <li>
              <button
                type="button"
                onMouseEnter={() => setHoveredCategory(null)}
                onClick={() => handleCategoryClick('all')}
                className={`py-3 px-1 transition-colors cursor-pointer border-b-2 font-extrabold ${
                  filters.category === 'all' && !filters.subcategory
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-700 hover:text-black hover:border-neutral-400'
                }`}
              >
                SHOP ALL
              </button>
            </li>

            {BLUCHEEZ_NAVBAR_ITEMS.map((item) => {
              const isActive = filters.category === item.id;
              const isHovered = hoveredCategory === item.id;

              return (
                <li 
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnterNav(item.id)}
                >
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(item.id)}
                    className={`py-3 px-1.5 flex items-center space-x-1 transition-colors cursor-pointer border-b-2 ${
                      isActive || isHovered
                        ? 'border-black text-black' 
                        : 'border-transparent text-neutral-700 hover:text-black hover:border-neutral-400'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        item.badge === 'NEW' 
                          ? 'bg-red-500 text-white' 
                          : item.badge === 'LUXURY'
                          ? 'bg-black text-white'
                          : 'bg-neutral-800 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHovered ? 'rotate-180 text-black' : 'text-neutral-400'}`} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mega-Menu Dropdown Panel */}
        {activeMegaCategory && activeMegaCategory.groups && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border-b border-neutral-300 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => handleMouseEnterNav(activeMegaCategory.id)}
            onMouseLeave={handleMouseLeaveNav}
          >
            <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-8">
              <div className="grid grid-cols-12 gap-8">
                
                {/* Columns of Subcategories */}
                <div className="col-span-8 grid grid-cols-3 gap-6">
                  {activeMegaCategory.groups.map((grp, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-black border-b border-neutral-200 pb-2">
                        {grp.title}
                      </h4>
                      <ul className="space-y-2">
                        {grp.items.map((sub, sIdx) => {
                          const isSubActive = filters.subcategory === sub;
                          return (
                            <li key={sIdx}>
                              <button
                                type="button"
                                onClick={() => handleSubcategoryClick(activeMegaCategory.id, sub)}
                                className={`text-xs text-left transition-colors cursor-pointer hover:translate-x-1 transform duration-150 inline-block ${
                                  isSubActive
                                    ? 'text-black font-bold underline'
                                    : 'text-neutral-600 hover:text-black font-medium'
                                }`}
                              >
                                {sub}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Featured Lookbook Card */}
                {activeMegaCategory.featuredImage && (
                  <div className="col-span-4 border-l border-neutral-200 pl-8">
                    <div 
                      onClick={() => handleCategoryClick(activeMegaCategory.id)}
                      className="group relative rounded-xl overflow-hidden cursor-pointer aspect-4/3 bg-neutral-900 shadow-md"
                    >
                      <img 
                        src={activeMegaCategory.featuredImage} 
                        alt={activeMegaCategory.featuredTitle || activeMegaCategory.name}
                        className="w-full h-full object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-black px-2 py-0.5 rounded">
                          Blucheez Spotlight
                        </span>
                        <h5 className="font-serif font-bold text-base text-white mt-1">
                          {activeMegaCategory.featuredTitle}
                        </h5>
                        <p className="text-[11px] text-neutral-300 flex items-center mt-1 group-hover:text-white">
                          <span>Explore Collection</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Navigation with Accordion Categories & Subcategories */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold tracking-wider text-black font-sans">
                    BLUCHEEZ
                  </span>
                  <span className="text-[10px] uppercase tracking-widest px-1 py-0.5 rounded bg-black text-white font-bold">
                    .FASHION
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Categories */}
              <div className="mt-4">
                <p className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-2">
                  Categories & Departments
                </p>

                {/* Quick Navigation: Home & Shop */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-center py-2 px-3 border border-neutral-300 rounded-none text-xs font-extrabold uppercase tracking-wider text-black hover:bg-neutral-100"
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick('all')}
                    className="w-full text-center py-2 px-3 bg-black text-white rounded-none text-xs font-extrabold uppercase tracking-wider hover:bg-neutral-800"
                  >
                    Shop All
                  </button>
                </div>

                {/* Blucheez Menu Accordions */}
                <div className="space-y-1">
                  {BLUCHEEZ_NAVBAR_ITEMS.map((cat) => {
                    const isExpanded = expandedMobileCategory === cat.id;
                    const isSelected = filters.category === cat.id;

                    return (
                      <div key={cat.id} className="border border-neutral-100 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between bg-neutral-50">
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`flex-1 text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 ${
                              isSelected ? 'text-black' : 'text-neutral-800'
                            }`}
                          >
                            <span>{cat.name}</span>
                            {cat.badge && (
                              <span className="text-[9px] bg-black text-white px-1.5 py-0.2 rounded font-sans">
                                {cat.badge}
                              </span>
                            )}
                          </button>

                          {cat.groups && (
                            <button
                              type="button"
                              onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                              className="p-2.5 text-neutral-500 hover:text-black"
                              aria-label="Expand subcategories"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>

                        {/* Expanded Subcategories */}
                        {isExpanded && cat.groups && (
                          <div className="p-3 bg-white space-y-3 border-t border-neutral-200">
                            {cat.groups.map((grp, gIdx) => (
                              <div key={gIdx} className="space-y-1">
                                <span className="text-[10px] font-bold uppercase text-neutral-400 block tracking-wider">
                                  {grp.title}
                                </span>
                                <div className="space-y-1 pl-1">
                                  {grp.items.map((sub, sIdx) => (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => handleSubcategoryClick(cat.id, sub)}
                                      className={`block w-full text-left text-xs py-1 transition-colors ${
                                        filters.subcategory === sub ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'
                                      }`}
                                    >
                                      {sub}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Tracking Button in Mobile Drawer */}
              <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/track');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold hover:border-black"
                >
                  <span className="flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-black" />
                    Track Courier Parcel
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-900">Cash on Delivery Support</p>
              <p>Hotline: 09613-258248 (10 AM - 10 PM)</p>
              <p>Logistics: Steadfast • Pathao • RedX</p>
            </div>
          </div>

          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
