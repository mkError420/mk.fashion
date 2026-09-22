import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronRight, 
  X, 
  Check, 
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryType, Product } from '../types';

interface CategoryHeroInfo {
  title: string;
  bengaliTitle: string;
  description: string;
  bannerImage: string;
  badge?: string;
}

const CATEGORY_META: Record<string, CategoryHeroInfo> = {
  'all': {
    title: 'All Products',
    bengaliTitle: 'সকল কালেকশন',
    description: 'Explore the complete Blucheez atelier — from festive Eid Panjabis to summer knitwear, luxury black society, and Belwari handloom silks.',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    badge: 'Complete Catalog'
  },
  'men': {
    title: "Men's Collection",
    bengaliTitle: 'পুরুষদের কালেকশন — পাঞ্জাবি, শার্ট ও পোলো',
    description: 'Bespoke tailoring, 100% fine Egyptian cotton panjabis, executive non-iron formal shirting, and luxury polos designed for effortless distinction.',
    bannerImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
    badge: 'Festive & Contemporary'
  },
  'women': {
    title: "Women's Collection",
    bengaliTitle: 'নারীদের কালেকশন — শাড়ি, কুর্তি ও আনরকলি',
    description: 'Heritage handloom Jamdani, artisanal resham silk sarees, embroidered kurti sets, and draped festive silhouettes.',
    bannerImage: 'https://images.unsplash.com/photo-1610030469668-936ce4489b4f?auto=format&fit=crop&w=1600&q=80',
    badge: 'Heritage & Modernity'
  },
  'blucheez-black': {
    title: 'Blucheez | Black Society',
    bengaliTitle: 'ব্লুচিজ ব্ল্যাক সোসাইটি — লাক্সারি মোনোক্রোম',
    description: 'An exclusive monochrome atelier. Deep obsidian tones, bespoke wool blazers, tailored black panjabis, and minimalist modern essentials.',
    bannerImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
    badge: 'Atelier Noir'
  },
  'belwari': {
    title: 'Belwari Heritage',
    bengaliTitle: 'বেলওয়ারী হেরিটেজ — তাঁত ও জামদানি ঐতিহ্য',
    description: 'Preserving Bengali handloom craft. Woven with pure silk threads, antique metallic zari, and ancestral motifs by master weavers.',
    bannerImage: 'https://images.unsplash.com/photo-1610030469668-936ce4489b4f?auto=format&fit=crop&w=1600&q=80',
    badge: 'Royal Handloom'
  },
  'summer': {
    title: 'Summer Breeze 2026',
    bengaliTitle: 'সামার নিট পোলো ও টি-শার্ট',
    description: 'Crafted for tropical heat. Breathable open-gauge sweater polos, drop-shoulder tees, lawn cotton panjabis, and casual chinos.',
    bannerImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1600&q=80',
    badge: 'Warm-Weather Essentials'
  },
  'new-in': {
    title: 'New Arrivals',
    bengaliTitle: 'নতুন কালেকশন ড্রপ',
    description: 'Fresh off the atelier floor. Explore the latest Eid 2026 designs, limited-run waistcoats, and seasonal highlights.',
    bannerImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
    badge: 'Just Landed'
  }
};

export const CollectionPage: React.FC = () => {
  const { category = 'all' } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useShop();

  const subcategoryParam = searchParams.get('sub') || 'all';
  const queryParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'featured';

  // Filter States
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(subcategoryParam);
  const [selectedSort, setSelectedSort] = useState<string>(sortParam);
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Sync state when URL params change
  useEffect(() => {
    setSelectedSubcategory(searchParams.get('sub') || 'all');
  }, [searchParams]);

  const activeCategoryMeta = CATEGORY_META[category] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    bengaliTitle: 'কালেকশন',
    description: 'Explore the curated selection from Blucheez.',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80'
  };

  // Extract all unique subcategories available in current category
  const availableSubcategories = useMemo(() => {
    const list = products.filter(p => {
      if (category === 'all') return true;
      if (category === 'men') return p.gender === 'men' || p.category === 'men';
      if (category === 'women') return p.gender === 'women' || p.category === 'women';
      return p.category === category;
    });

    const subs = new Set<string>();
    list.forEach(p => {
      if (p.subcategory) subs.add(p.subcategory);
    });
    return Array.from(subs);
  }, [products, category]);

  // Extract all unique fabrics
  const availableFabrics = useMemo(() => {
    const fabrics = new Set<string>();
    products.forEach(p => {
      if (p.fabric) {
        if (p.fabric.includes('Cotton')) fabrics.add('Cotton');
        if (p.fabric.includes('Linen')) fabrics.add('Linen');
        if (p.fabric.includes('Silk') || p.fabric.includes('Resham')) fabrics.add('Silk');
        if (p.fabric.includes('Knit') || p.fabric.includes('Gauge')) fabrics.add('Knitwear');
        if (p.fabric.includes('Jacquard')) fabrics.add('Jacquard');
      }
    });
    return Array.from(fabrics);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category match
      if (category !== 'all') {
        if (category === 'men' && product.gender !== 'men' && product.category !== 'men') return false;
        if (category === 'women' && product.gender !== 'women' && product.category !== 'women') return false;
        if (category !== 'men' && category !== 'women' && product.category !== category) return false;
      }

      // Subcategory match
      if (selectedSubcategory !== 'all' && product.subcategory !== selectedSubcategory) {
        return false;
      }

      // Query match
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBengali = product.bengaliName.toLowerCase().includes(q);
        const matchesSub = product.subcategory?.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesBengali && !matchesSub && !matchesSku) return false;
      }

      // Fabric match
      if (selectedFabric !== 'all') {
        if (!product.fabric.toLowerCase().includes(selectedFabric.toLowerCase())) return false;
      }

      // Size match
      if (selectedSize !== 'all') {
        if (!product.sizes.includes(selectedSize)) return false;
      }

      // Price match
      if (product.price > priceMax) return false;

      // In stock match
      if (inStockOnly && !product.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      return 0; // featured default
    });
  }, [products, category, selectedSubcategory, queryParam, selectedFabric, selectedSize, priceMax, inStockOnly, selectedSort]);

  const handleSubcategoryChange = (sub: string) => {
    setSelectedSubcategory(sub);
    const newParams = new URLSearchParams(searchParams);
    if (sub === 'all') {
      newParams.delete('sub');
    } else {
      newParams.set('sub', sub);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedSubcategory('all');
    setSelectedFabric('all');
    setSelectedSize('all');
    setPriceMax(10000);
    setInStockOnly(false);
    setSelectedSort('featured');
    setSearchParams({});
  };

  const hasActiveFilters = selectedSubcategory !== 'all' || selectedFabric !== 'all' || selectedSize !== 'all' || priceMax < 10000 || inStockOnly || queryParam;

  return (
    <div className="min-h-screen bg-white pb-16">
      
      {/* Category Hero Banner */}
      <div className="relative bg-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src={activeCategoryMeta.bannerImage}
            alt={activeCategoryMeta.title}
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-10 sm:py-14 z-10">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center space-x-2 text-xs text-neutral-400 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            <Link to="/collections/all" className="hover:text-white transition-colors">Collections</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-white font-semibold">{activeCategoryMeta.title}</span>
            {selectedSubcategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-neutral-300">{selectedSubcategory}</span>
              </>
            )}
          </nav>

          {activeCategoryMeta.badge && (
            <span className="text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-white text-black mb-2 inline-block">
              {activeCategoryMeta.badge}
            </span>
          )}

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white tracking-tight">
            {activeCategoryMeta.title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 font-medium mt-1">
            {activeCategoryMeta.bengaliTitle}
          </p>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-2 leading-relaxed">
            {activeCategoryMeta.description}
          </p>
        </div>
      </div>

      {/* Main Catalog Container */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto pt-6">
        
        {/* Subcategory Pills Carousel */}
        {availableSubcategories.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-3 pt-1 scrollbar-none border-b border-neutral-100">
            <button
              type="button"
              onClick={() => handleSubcategoryChange('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Items ({products.filter(p => category === 'all' || p.category === category || p.gender === category).length})
            </button>

            {availableSubcategories.map(sub => {
              const count = products.filter(p => p.subcategory === sub).length;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSubcategoryChange(sub)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSubcategory === sub
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {sub} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Filter & Sorting Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-neutral-200">
          
          <div className="flex items-center space-x-3">
            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-black" />
              )}
            </button>

            {/* Results Count */}
            <span className="text-xs text-neutral-500">
              Showing <strong className="text-neutral-900 font-bold">{filteredProducts.length}</strong> items
            </span>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-black font-semibold cursor-pointer underline ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <label htmlFor="catalog-sort" className="text-xs text-neutral-500 font-medium">Sort by:</label>
            <select
              id="catalog-sort"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="text-xs font-semibold bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High (৳)</option>
              <option value="price-high">Price: High to Low (৳)</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="discount">Biggest Discount (%)</option>
            </select>
          </div>

        </div>

        {/* Expandable Filter Panel */}
        {isFilterDrawerOpen && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 sm:p-6 my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-200">
            
            {/* Fabric Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Fabric Material
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="radio"
                    name="fabric"
                    checked={selectedFabric === 'all'}
                    onChange={() => setSelectedFabric('all')}
                    className="text-black focus:ring-black"
                  />
                  <span>All Fabrics</span>
                </label>
                {availableFabrics.map(fab => (
                  <label key={fab} className="flex items-center space-x-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="radio"
                      name="fabric"
                      checked={selectedFabric === fab}
                      onChange={() => setSelectedFabric(fab)}
                      className="text-black focus:ring-black"
                    />
                    <span>{fab}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Sizes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['all', '38', '40', '42', '44', '46', 'M', 'L', 'XL'].map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 text-xs rounded font-semibold border cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {sz === 'all' ? 'All' : sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Max Price
                </label>
                <span className="text-xs font-bold text-neutral-900">
                  Up to ৳{priceMax.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="250"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>৳1,000</span>
                <span>৳10,000+</span>
              </div>
            </div>

            {/* Stock & Quick Filter Toggle */}
            <div className="flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Availability
                </label>
                <label className="flex items-center space-x-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-black focus:ring-black"
                  />
                  <span>In Stock Only (Ready to Dispatch)</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="mt-4 w-full bg-black text-white text-xs font-bold py-2 rounded-lg hover:bg-neutral-800 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Apply Filters
              </button>
            </div>

          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-200 mt-6 p-8">
            <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-lg font-serif font-bold text-neutral-900">
              No products found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              We couldn't find any items matching your selected criteria in this collection.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-full uppercase tracking-wider transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
