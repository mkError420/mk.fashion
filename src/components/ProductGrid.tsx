import React, { useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CategoryType } from '../types';

export const ProductGrid: React.FC = () => {
  const { products, filters, updateFilter, resetFilters } = useShop();

  const blucheezCategories: { label: string; value: CategoryType; badge?: string }[] = [
    { label: 'All Collection', value: 'all' },
    { label: 'New In', value: 'new-in', badge: 'NEW' },
    { label: 'Summer', value: 'summer' },
    { label: 'Blucheez | Black', value: 'blucheez-black', badge: 'LUXURY' },
    { label: 'Belwari', value: 'belwari', badge: 'HERITAGE' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Accessories', value: 'accessories' }
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (filters.category !== 'all') {
      if (filters.category === 'new-in') {
        // Show new arrival badges or latest items
        list = list.filter(p => p.badge === 'New Arrival' || p.badge === 'Blucheez Exclusive' || p.discountPercent);
      } else if (filters.category === 'summer') {
        list = list.filter(p => p.category === 'summer' || p.subcategory?.toLowerCase().includes('polo') || p.category === 'polos');
      } else {
        list = list.filter(p => p.category === filters.category);
      }
    }

    // Subcategory filter
    if (filters.subcategory) {
      list = list.filter(p => p.subcategory?.toLowerCase() === filters.subcategory?.toLowerCase());
    }

    // Search query filter (matches name, bengali name, fabric, sku, badge, subcategory)
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.bengaliName.includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        p.fabric.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        break;
      case 'featured':
      default:
        break;
    }

    return list;
  }, [products, filters]);

  const hasActiveFilters = filters.category !== 'all' || !!filters.subcategory || filters.query.trim() !== '' || filters.sortBy !== 'featured';

  const currentCategoryLabel = blucheezCategories.find(c => c.value === filters.category)?.label || 'All Collection';

  return (
    <section id="product-catalog" className="py-10 bg-white min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900 tracking-tight">
                {filters.subcategory ? `${currentCategoryLabel} - ${filters.subcategory}` : currentCategoryLabel}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> products with Instant COD & Nationwide Courier
            </p>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-3 self-end md:self-auto">
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-none border border-neutral-300 text-xs font-semibold text-neutral-800 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-black" />
              <label htmlFor="product-sort-select" className="sr-only">Sort products</label>
              <select
                id="product-sort-select"
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                className="bg-transparent border-none focus:outline-none text-neutral-900 font-semibold cursor-pointer text-xs"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="discount">Biggest Discount (%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {blucheezCategories.map((cat) => {
            const isActive = filters.category === cat.value && !filters.subcategory;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  updateFilter('category', cat.value);
                  updateFilter('subcategory', undefined);
                }}
                className={`text-xs font-semibold px-4 py-2 rounded-none whitespace-nowrap transition-all cursor-pointer border flex items-center space-x-1.5 uppercase tracking-wider ${
                  isActive
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-black hover:text-black'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-none ${
                    isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-800'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex items-center flex-wrap gap-2 mb-6 p-3 bg-neutral-100 rounded-none border border-neutral-200 text-xs">
            <span className="font-semibold text-neutral-800">Active Filters:</span>
            
            {filters.category !== 'all' && (
              <span className="inline-flex items-center bg-white px-2.5 py-1 rounded-none border border-neutral-300 text-neutral-800">
                Category: {currentCategoryLabel}
                <button 
                  onClick={() => updateFilter('category', 'all')} 
                  className="ml-1.5 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.subcategory && (
              <span className="inline-flex items-center bg-white px-2.5 py-1 rounded-none border border-neutral-300 text-neutral-800">
                Subcategory: {filters.subcategory}
                <button 
                  onClick={() => updateFilter('subcategory', undefined)} 
                  className="ml-1.5 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.query.trim() !== '' && (
              <span className="inline-flex items-center bg-white px-2.5 py-1 rounded-none border border-neutral-300 text-neutral-800">
                Search: "{filters.query}"
                <button 
                  onClick={() => updateFilter('query', '')} 
                  className="ml-1.5 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="inline-flex items-center text-black hover:underline font-bold ml-auto cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset All
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-none border border-neutral-200 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-none bg-neutral-100 flex items-center justify-center text-neutral-400">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 font-serif mb-1">
              No matching products found
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              We couldn't find any products in this selection. Explore Blucheez Men, Women, Belwari, or Summer Polos.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-none transition-colors cursor-pointer uppercase tracking-wider"
            >
              Show All Products
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
