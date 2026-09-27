import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Sparkles,
  BookOpen,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useFrontendData } from '../context/FrontendDataContext';
import { buildUnifiedCategories, UnifiedCategory } from '../utils/categoryNav';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cart, 
    wishlist, 
    filters, 
    updateFilter, 
    openCart, 
    openWishlist, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    products
  } = useShop();
  const { announcementText, contactPhone, deliveryFees, categories: dynamicCategories } = useFrontendData();

  const navCategories: UnifiedCategory[] = React.useMemo(() => {
    return buildUnifiedCategories(dynamicCategories);
  }, [dynamicCategories]);

  const [searchInput, setSearchInput] = useState(filters.query);
  const [drawerSearchInput, setDrawerSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<any>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Check category nav horizontal scroll boundaries
  const checkNavScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      const scrollDistance = direction === 'left' ? -220 : 220;
      navScrollRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
      setTimeout(checkNavScroll, 320);
    }
  };

  // Re-check category nav scrollability on mount, resize, and categories change
  useEffect(() => {
    checkNavScroll();
    const timer = setTimeout(checkNavScroll, 150);
    window.addEventListener('resize', checkNavScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkNavScroll);
    };
  }, [navCategories]);

  // Track scroll position for header elevation shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync search input with filter state
  useEffect(() => {
    setSearchInput(filters.query);
  }, [filters.query]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMobileMenuOpen]);

  // Auto-close mobile drawer and search suggestions on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
  }, [location.pathname, location.search]);

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

  const handleDrawerSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawerSearchInput.trim()) {
      setIsMobileMenuOpen(false);
      navigate(`/shop?q=${encodeURIComponent(drawerSearchInput.trim())}`);
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

  // Hover handlers for desktop mega-menu with grace delay
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
        (p.bengaliName && p.bengaliName.includes(searchInput))
      ).slice(0, 4)
    : [];

  const popularSearches = ['Panjabi', 'Polo Shirt', 'Belwari Saree', 'Blucheez Black', 'Kabli Set', 'Fragrance'];

  const activeMegaCategory = navCategories.find(c => c.id === hoveredCategory);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-black text-neutral-300 text-[10px] sm:text-xs border-b border-neutral-800 w-full overflow-hidden">
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 mx-auto flex items-center justify-between gap-2 py-1.5 sm:py-2">
          {/* Left: Announcement text & Delivery info */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs truncate min-w-0 flex-1">
            <span className="font-semibold tracking-wide text-white uppercase flex items-center truncate">
              <Sparkles className="w-3 h-3 mr-1.5 text-amber-400 shrink-0 hidden xs:inline" />
              <span className="truncate">{announcementText}</span>
            </span>
            <span className="hidden md:inline text-neutral-600 shrink-0">•</span>
            <span className="hidden md:inline text-neutral-300 shrink-0">
              Inside Dhaka ৳{deliveryFees.insideDhaka} | Outside ৳{deliveryFees.outsideDhaka}
            </span>
          </div>

          {/* Right: Quick Utility Links */}
          <div className="flex items-center space-x-2 sm:space-x-4 text-[10px] sm:text-xs shrink-0 font-medium">
            <Link 
              to="/track" 
              className="inline-flex items-center text-neutral-300 hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
              title="Track your shipment"
            >
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-white shrink-0" />
              <span className="whitespace-nowrap">Track</span>
            </Link>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <Link 
              to="/blog" 
              className="hidden sm:inline-flex items-center text-neutral-300 hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
            >
              <span className="whitespace-nowrap">Blog</span>
            </Link>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <Link 
              to="/admin/login" 
              className="inline-flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
            >
              <span className="whitespace-nowrap">Admin</span>
            </Link>
            <span className="hidden lg:inline text-neutral-700">|</span>
            <div className="hidden lg:flex items-center text-neutral-300">
              <Phone className="w-3 h-3 mr-1 text-white shrink-0" />
              <span>Hotline: <strong className="text-white">{contactPhone}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`sticky top-0 z-40 bg-white border-b border-neutral-200 w-full transition-shadow duration-200 ${isScrolled ? 'shadow-md' : 'shadow-xs'}`}>
        
        {/* Main Header Bar */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 mx-auto">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 sm:gap-4">
            
            {/* Mobile / Tablet Menu Trigger & Brand Identity */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Menu Trigger Button (visible on mobile and tablet < 1280px) */}
              <button 
                id="mobile-menu-toggle"
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 -ml-1 text-neutral-800 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              {/* Brand Logo */}
              <Link 
                to="/"
                className="flex flex-col select-none group" 
              >
                <div className="flex items-center space-x-1">
                  <span className="font-extrabold tracking-widest text-black font-sans uppercase text-lg sm:text-2xl lg:text-3xl">
                    BLUCHEEZ
                  </span>
                  <span className="text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest px-1 py-0.5 rounded bg-black text-white font-bold">
                    .FASHION
                  </span>
                </div>
                <p className="text-[7px] sm:text-[8px] lg:text-[9px] text-neutral-500 uppercase tracking-widest font-semibold hidden md:block">
                  Modern Lifestyle & Heritage Atelier
                </p>
              </Link>
            </div>

            {/* Search Bar for Tablet & Desktop (>= 768px `md:`) */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-sm lg:max-w-lg xl:max-w-xl mx-2 lg:mx-6 hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center">
                  <input
                    id="header-desktop-search"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search Panjabi, Polos, Belwari Sarees..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-full pl-10 pr-20 py-2 sm:py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                  
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => { setSearchInput(''); updateFilter('query', ''); }}
                      className="absolute right-16 text-neutral-400 hover:text-neutral-700 text-xs px-1.5 py-0.5 rounded"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="submit"
                    className="absolute right-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Desktop Live Search Suggestions Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-neutral-200 py-3 z-50 overflow-hidden max-h-[70vh] overflow-y-auto">
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
                          <img src={p.images[0]} alt={p.name} className="w-11 h-14 object-cover rounded border border-neutral-200 group-hover:border-black transition-colors shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-black">{p.name}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{p.subcategory || p.fabric} • <span className="text-black font-bold">৳{p.price.toLocaleString()}</span></p>
                          </div>
                          <span className="text-[11px] font-bold text-neutral-400 group-hover:text-black uppercase tracking-wider flex items-center gap-1 transition-colors shrink-0">
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
                      Popular Searches
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

            {/* Quick Action Buttons (Track, Wishlist, Cart) */}
            <div className="flex items-center space-x-1 sm:space-x-2.5 lg:space-x-3 shrink-0">
              
              {/* Courier Tracking Quick Button (Desktop XL) */}
              <Link
                id="header-track-order-btn"
                to="/track"
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-neutral-300 text-neutral-800 hover:text-black hover:border-black transition-colors text-xs font-semibold cursor-pointer bg-white"
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

              {/* Shopping Cart Drawer Trigger */}
              <button
                id="header-cart-btn"
                type="button"
                onClick={openCart}
                className="flex items-center space-x-1.5 sm:space-x-2 bg-black hover:bg-neutral-800 text-white px-2.5 sm:px-3.5 lg:px-4 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer active:scale-95 shrink-0"
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
                <div className="hidden lg:flex flex-col text-left leading-tight pl-1">
                  <span className="text-[10px] text-neutral-300 uppercase font-semibold">Bag</span>
                  <span className="text-xs font-bold">৳{cartSubtotal.toLocaleString()}</span>
                </div>
              </button>

            </div>
          </div>

          {/* Mobile Search Bar (< 768px `md:hidden`) */}
          <div ref={mobileSearchContainerRef} className="md:hidden pb-2.5 pt-0.5 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                id="header-mobile-search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search Panjabi, Sarees, Polos..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-full pl-9 pr-18 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); updateFilter('query', ''); }}
                  className="absolute right-14 top-2 text-neutral-400 hover:text-neutral-700 text-xs px-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1 top-1 bg-black text-white text-[11px] font-semibold px-3 py-1 rounded-full cursor-pointer"
              >
                Find
              </button>
            </form>

            {/* Mobile Live Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-neutral-200 py-2.5 z-50 overflow-hidden max-h-[60vh] overflow-y-auto">
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

        {/* Desktop Category Navigation Bar - Hidden in Tablet & Mobile mode */}
        <nav 
          className="hidden xl:block bg-neutral-50 border-t border-neutral-200 relative w-full select-none"
          onMouseLeave={handleMouseLeaveNav}
        >
          <div className="relative w-full max-w-full flex items-center">
            
            {/* Left Scroll Navigation Button (shown when scrollable left) */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollNav('left')}
                className="absolute left-0 top-0 bottom-0 z-20 px-1 sm:px-2 bg-gradient-to-r from-neutral-50 via-neutral-50/95 to-transparent flex items-center justify-center text-neutral-800 hover:text-black transition-opacity"
                aria-label="Scroll categories left"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-sm border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              </button>
            )}

            {/* Horizontally Scrollable Category Items Container */}
            <div 
              ref={navScrollRef}
              onScroll={checkNavScroll}
              className="w-full overflow-x-auto no-scrollbar scroll-smooth px-3 sm:px-6 lg:px-8 xl:px-12 py-0.5"
            >
              <ul className="min-w-max mx-auto flex items-center justify-start lg:justify-center gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-4 xl:gap-6 2xl:gap-7 text-[11px] sm:text-xs uppercase font-bold tracking-wider text-neutral-800">
                
                {/* Home Link */}
                <li className="shrink-0">
                  <Link
                    to="/"
                    onMouseEnter={() => setHoveredCategory(null)}
                    className={`py-2 sm:py-2.5 xl:py-3 px-1.5 sm:px-2 transition-colors cursor-pointer border-b-2 flex items-center space-x-1 ${
                      location.pathname === '/' 
                        ? 'border-black text-black font-extrabold' 
                        : 'border-transparent text-neutral-700 hover:text-black hover:border-black font-bold'
                    }`}
                  >
                    <span>HOME</span>
                  </Link>
                </li>

                {/* Shop All */}
                <li className="shrink-0">
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredCategory(null)}
                    onClick={() => handleCategoryClick('all')}
                    className={`py-2 sm:py-2.5 xl:py-3 px-1.5 sm:px-2 transition-colors cursor-pointer border-b-2 font-extrabold ${
                      filters.category === 'all' && !filters.subcategory && location.pathname.startsWith('/shop')
                        ? 'border-black text-black'
                        : 'border-transparent text-neutral-700 hover:text-black hover:border-neutral-400'
                    }`}
                  >
                    SHOP ALL
                  </button>
                </li>

                {navCategories.map((item) => {
                  const isActive = (filters.category === item.id || location.pathname === `/shop/${item.id}`) && !filters.subcategory;
                  const isHovered = hoveredCategory === item.id;

                  return (
                    <li 
                      key={item.id}
                      className="relative shrink-0"
                      onMouseEnter={() => handleMouseEnterNav(item.id)}
                    >
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(item.id)}
                        className={`py-2 sm:py-2.5 xl:py-3 px-1.5 sm:px-2 flex items-center space-x-1 sm:space-x-1.5 transition-colors cursor-pointer border-b-2 ${
                          isActive || isHovered
                            ? 'border-black text-black font-extrabold' 
                            : 'border-transparent text-neutral-700 hover:text-black hover:border-neutral-400 font-bold'
                        }`}
                      >
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className={`text-[7.5px] sm:text-[8px] xl:text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-none ${
                            item.badge === 'NEW' 
                              ? 'bg-red-500 text-white' 
                              : item.badge === 'LUXURY'
                              ? 'bg-black text-white'
                              : item.badge === 'TRENDING'
                              ? 'bg-black text-white'
                              : item.badge === 'HERITAGE'
                              ? 'bg-black text-white'
                              : 'bg-neutral-800 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.hasDropdown && (
                          <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${isHovered ? 'rotate-180 text-black' : 'text-neutral-400'}`} />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Scroll Navigation Button (shown when scrollable right) */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollNav('right')}
                className="absolute right-0 top-0 bottom-0 z-20 px-1 sm:px-2 bg-gradient-to-l from-neutral-50 via-neutral-50/95 to-transparent flex items-center justify-center text-neutral-800 hover:text-black transition-opacity"
                aria-label="Scroll categories right"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-sm border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            )}

          </div>

          {/* Desktop Mega-Menu Dropdown Panel */}
          {activeMegaCategory && activeMegaCategory.groups && (
            <div 
              className="absolute top-full left-0 right-0 bg-white border-b border-neutral-300 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              onMouseEnter={() => handleMouseEnterNav(activeMegaCategory.id)}
              onMouseLeave={handleMouseLeaveNav}
            >
              <div className="w-full px-6 lg:px-8 xl:px-12 mx-auto py-6 xl:py-8">
                <div className="grid grid-cols-12 gap-6 xl:gap-8">
                  
                  {/* Columns of Subcategories */}
                  <div className={`grid gap-4 xl:gap-6 ${
                    activeMegaCategory.featuredImage 
                      ? 'col-span-12 lg:col-span-8 grid-cols-2 md:grid-cols-3' 
                      : 'col-span-12 grid-cols-2 md:grid-cols-4'
                  }`}>
                    {activeMegaCategory.groups.map((grp, idx) => (
                      <div key={idx} className="space-y-2.5">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-black border-b border-neutral-200 pb-2">
                          {grp.title}
                        </h4>
                        <ul className="space-y-1.5">
                          {grp.items.map((sub, sIdx) => {
                            const isSubActive = filters.subcategory === sub;
                            return (
                              <li key={sIdx}>
                                <button
                                  type="button"
                                  onClick={() => handleSubcategoryClick(activeMegaCategory.id, sub)}
                                  className={`text-xs text-left transition-colors cursor-pointer hover:translate-x-1 transform duration-150 inline-block py-0.5 ${
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
                    <div className="hidden lg:block lg:col-span-4 border-l border-neutral-200 pl-6 xl:pl-8">
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
                          <h5 className="font-serif font-bold text-base text-white mt-1 line-clamp-1">
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

        {/* Mobile & Tablet Full Navigation Drawer */}
        <div 
          className={`xl:hidden fixed inset-0 z-50 transition-all duration-300 ${
            isMobileMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          {/* Backdrop overlay */}
          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer slide-in panel */}
          <div 
            className={`relative z-10 w-[85%] sm:w-[380px] md:w-[420px] max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Drawer Header (Fixed at top) */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 shrink-0">
              <div className="flex items-center space-x-1">
                <span className="text-xl font-black tracking-wider text-black font-sans">
                  BLUCHEEZ
                </span>
                <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-black text-white font-bold">
                  .FASHION
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
              
              {/* Quick Search inside Drawer */}
              <form onSubmit={handleDrawerSearchSubmit} className="relative">
                <input
                  type="text"
                  value={drawerSearchInput}
                  onChange={(e) => setDrawerSearchInput(e.target.value)}
                  placeholder="Search products in store..."
                  className="w-full bg-neutral-100 border border-neutral-300 rounded-lg pl-9 pr-9 py-2 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-black"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                {drawerSearchInput && (
                  <button
                    type="button"
                    onClick={() => setDrawerSearchInput('')}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Quick Navigation Shortcuts */}
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
                  Quick Navigation
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="text-left py-2.5 px-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-bold uppercase tracking-wider text-black transition-colors"
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick('all')}
                    className="text-left py-2.5 px-3 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Shop All
                  </button>
                </div>
              </div>

              {/* Categories & Departments */}
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
                  Categories & Collections
                </p>

                <div className="space-y-1.5">
                  {navCategories.map((cat) => {
                    const isExpanded = expandedMobileCategory === cat.id;
                    const isSelected = filters.category === cat.id;

                    return (
                      <div key={cat.id} className="border border-neutral-200 rounded-lg overflow-hidden transition-all">
                        <div className="flex items-center justify-between bg-neutral-50">
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`flex-1 text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 ${
                              isSelected ? 'text-black' : 'text-neutral-800'
                            }`}
                          >
                            <span>{cat.name}</span>
                            {cat.badge && (
                              <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full ${
                                cat.badge === 'NEW' 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-black text-white'
                              }`}>
                                {cat.badge}
                              </span>
                            )}
                          </button>

                          {cat.groups && cat.groups.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                              className="p-3 text-neutral-500 hover:text-black transition-transform"
                              aria-label={`Toggle subcategories for ${cat.name}`}
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>

                        {/* Expanded Subcategories */}
                        {isExpanded && cat.groups && (
                          <div className="p-3 bg-white space-y-3 border-t border-neutral-200 animate-in fade-in duration-150">
                            {cat.groups.map((grp, gIdx) => (
                              <div key={gIdx} className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase text-neutral-400 block tracking-wider">
                                  {grp.title}
                                </span>
                                <div className="space-y-1 pl-1">
                                  {grp.items.map((sub, sIdx) => (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => handleSubcategoryClick(cat.id, sub)}
                                      className={`block w-full text-left text-xs py-1 transition-colors flex items-center justify-between ${
                                        filters.subcategory === sub ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'
                                      }`}
                                    >
                                      <span>{sub}</span>
                                      <ChevronRight className="w-3 h-3 text-neutral-300" />
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

              {/* Essential Brand Links */}
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
                  Customer Essentials
                </p>
                <div className="space-y-1 text-xs font-semibold">
                  <Link
                    to="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-100 text-neutral-800 transition-colors"
                  >
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2.5 text-neutral-700" />
                      Journal & Style Guides
                    </span>
                    <span className="text-[9px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded">
                      NEW
                    </span>
                  </Link>

                  <Link
                    to="/track"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-100 text-neutral-800 transition-colors"
                  >
                    <span className="flex items-center">
                      <Truck className="w-4 h-4 mr-2.5 text-neutral-700" />
                      Track Parcel Delivery
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </Link>

                  <Link
                    to="/outlets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-100 text-neutral-800 transition-colors"
                  >
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2.5 text-neutral-700" />
                      Dhaka Flagship Outlets
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </Link>

                  <Link
                    to="/exchange-policy"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-100 text-neutral-800 transition-colors"
                  >
                    <span className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2.5 text-neutral-700" />
                      7-Day Exchange Policy
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Drawer Footer (Fixed at bottom) */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 shrink-0 space-y-2 text-xs">
              <a 
                href={`tel:${contactPhone}`} 
                className="flex items-center justify-between text-neutral-800 hover:text-black font-semibold"
              >
                <span className="flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-neutral-600" />
                  Hotline: {contactPhone}
                </span>
                <span className="text-[10px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded font-bold">
                  Tap to Call
                </span>
              </a>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-200">
                <span>Cash on Delivery Support</span>
                <Link 
                  to="/admin/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-neutral-600 hover:text-black font-medium underline"
                >
                  Admin Portal
                </Link>
              </div>
            </div>

          </div>
        </div>

      </header>
    </>
  );
};
