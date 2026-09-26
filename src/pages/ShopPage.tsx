import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Search, 
  Grid2X2, 
  Grid3X3, 
  LayoutGrid, 
  Home, 
  Check, 
  Sparkles, 
  ShoppingBag,
  ArrowUpDown,
  Tag,
  Filter
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useFrontendData } from '../context/FrontendDataContext';
import { buildUnifiedCategories, UnifiedCategory } from '../utils/categoryNav';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface SidebarCategory {
  id: string;
  name: string;
  bengaliName: string;
  badge?: string;
  subcategories: string[];
}

const INITIAL_SHOP_CATEGORIES: SidebarCategory[] = [
  {
    id: 'all',
    name: 'All Collections',
    bengaliName: 'সকল কালেকশন',
    subcategories: []
  },
  {
    id: 'men',
    name: 'Men',
    bengaliName: 'পুরুষদের পোশাক',
    badge: 'Trending',
    subcategories: [
      'Essential Panjabi',
      'Exclusive Panjabi',
      'Panjabi | Black',
      'Kabli Set',
      'Formal Shirt',
      'Casual Shirt',
      'Sweater Polos',
      'Classic Polos',
      'Drop Shoulder T-Shirt',
      'Executive Wool Blazers',
      'Casual Pant',
      'Pajama'
    ]
  },
  {
    id: 'women',
    name: 'Women',
    bengaliName: 'নারীদের পোশাক',
    badge: 'Belwari',
    subcategories: [
      'Belwari Jamdani Saree',
      'Salwar Kameez',
      'Embroidered Kurti Sets',
      'Two Pieces Kurti',
      'Three Pieces Kurti',
      'Anarkali',
      'Western Tops',
      'Wide Leg Pants'
    ]
  },
  {
    id: 'blucheez-black',
    name: 'Blucheez | Black',
    bengaliName: 'ব্ল্যাক সোসাইটি',
    badge: 'Luxury',
    subcategories: [
      'Panjabi | Black',
      'Executive Wool Blazers',
      'Tailored Black Shirts',
      'Slim Fit Black Trousers',
      'Black Zari Suits',
      'Premium Noir Fragrance'
    ]
  },
  {
    id: 'belwari',
    name: 'Belwari Heritage',
    bengaliName: 'বেলওয়ারী ঐতিহ্য',
    badge: 'Artisan',
    subcategories: [
      'Belwari Jamdani Saree',
      'Zari Embroidered Suit',
      'Artisan Silk Kurtis',
      'Two-Piece Salwar Kameez',
      'Three-Piece Kurti'
    ]
  },
  {
    id: 'summer',
    name: 'Summer Breeze 2026',
    bengaliName: 'সামার কালেকশন',
    badge: 'New',
    subcategories: [
      'Sweater Polos',
      'Boxy-Fit Drop Shoulder Polos',
      'Classic Polos',
      'Drop Shoulder T-Shirt',
      'Lawn Cotton Panjabi',
      'Cotton Chinos'
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    bengaliName: 'এক্সেসরিজ',
    subcategories: [
      'Fragrances (Men & Women)',
      'Genuine Leather Belts',
      'Wallets',
      'Cufflinks',
      'Caps'
    ]
  }
];

const KNOWN_CATEGORY_META: Record<string, { bengaliName?: string; badge?: string; defaultSubcategories?: string[] }> = {
  'men': {
    bengaliName: 'পুরুষদের পোশাক',
    badge: 'Trending',
  },
  'women': {
    bengaliName: 'নারীদের পোশাক',
    badge: 'Belwari',
  },
  'blucheez-black': {
    bengaliName: 'ব্ল্যাক সোসাইটি',
    badge: 'Luxury',
  },
  'belwari': {
    bengaliName: 'বেলওয়ারী ঐতিহ্য',
    badge: 'Artisan',
  },
  'summer': {
    bengaliName: 'সামার কালেকশন',
    badge: 'New',
  },
  'accessories': {
    bengaliName: 'এক্সেসরিজ',
  },
  'new-in': {
    bengaliName: 'নতুন আগমন',
    badge: 'New Arrival',
  }
};

const FABRIC_FILTERS = [
  'Cotton',
  'Silk',
  'Linen',
  'Jacquard',
  'Knitwear',
  'Georgette',
  'Wool'
];

const SIZE_FILTERS = ['S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44', '46'];

const COLOR_SWATCHES = [
  { name: 'Black', hex: '#0a0a0a' },
  { name: 'White', hex: '#fdfdfd' },
  { name: 'Navy Blue', hex: '#0f172a' },
  { name: 'Maroon', hex: '#800020' },
  { name: 'Olive Green', hex: '#3d4a36' },
  { name: 'Beige', hex: '#d4c5b9' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Gold / Zari', hex: '#d97706' }
];

export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { category: routeCategory } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useShop();
  const { categories: dynamicCategories, loadCategories } = useFrontendData();

  useEffect(() => {
    loadCategories();
  }, []);

  // Dynamically constructed categories from Database + Fallbacks via unified category utility
  const shopCategories: SidebarCategory[] = useMemo(() => {
    const unified = buildUnifiedCategories(dynamicCategories, false);
    return [
      {
        id: 'all',
        name: 'All Collections',
        bengaliName: 'সকল কালেকশন',
        subcategories: []
      },
      ...unified.map(u => ({
        id: u.id,
        name: u.name,
        bengaliName: u.bengaliName || u.name,
        badge: u.badge,
        subcategories: u.subcategories
      }))
    ];
  }, [dynamicCategories]);

  // Active Filters from URL / State
  const selectedCategory = routeCategory || searchParams.get('category') || 'all';
  const selectedSubcategory = searchParams.get('sub') || 'all';
  const queryParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'featured';

  // Local Filter States
  const [shopSearchInput, setShopSearchInput] = useState(queryParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [selectedFabric, setSelectedFabric] = useState<string>(searchParams.get('fabric') || 'all');
  const [selectedSize, setSelectedSize] = useState<string>(searchParams.get('size') || 'all');
  const [selectedColor, setSelectedColor] = useState<string>(searchParams.get('color') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 10000
  ]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(searchParams.get('inStock') === 'true');
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(searchParams.get('onSale') === 'true');

  // UI state: Subcategories are primarily hidden (null).
  // When a user clicks on a category, only that category opens its floating subcategories, and any previously open category automatically closes.
  const [openCategoryAccordion, setOpenCategoryAccordion] = useState<string | null>(() => {
    const initialSub = searchParams.get('sub');
    if (initialSub && selectedCategory !== 'all') {
      return selectedCategory;
    }
    return null; // Primarily hidden by default
  });
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(4);

  // Sync state with URL params
  useEffect(() => {
    setShopSearchInput(searchParams.get('q') || '');
    setSelectedSort(searchParams.get('sort') || 'featured');
    setSelectedFabric(searchParams.get('fabric') || 'all');
    setSelectedSize(searchParams.get('size') || 'all');
    setSelectedColor(searchParams.get('color') || 'all');
    setPriceRange([
      Number(searchParams.get('minPrice')) || 0,
      Number(searchParams.get('maxPrice')) || 10000
    ]);
    setInStockOnly(searchParams.get('inStock') === 'true');
    setOnSaleOnly(searchParams.get('onSale') === 'true');
    
    // Automatically expand the category accordion when visiting a category or subcategory
    const activeCat = routeCategory || searchParams.get('category');
    if (activeCat && activeCat !== 'all') {
      setOpenCategoryAccordion(activeCat);
    }
  }, [searchParams, routeCategory]);

  const toggleCategoryAccordion = (catId: string) => {
    // If clicked category is already open, collapse it; otherwise open it and close any previously open category
    setOpenCategoryAccordion(prev => (prev === catId ? null : catId));
  };

  const handleSelectCategory = (catId: string, toggleSubcategories: boolean = true) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('sub');
    if (catId === 'all') {
      setOpenCategoryAccordion(null);
      navigate('/shop');
    } else {
      if (toggleSubcategories) {
        setOpenCategoryAccordion(prev => (prev === catId ? null : catId));
      } else {
        setOpenCategoryAccordion(catId);
      }
      navigate(`/shop/${catId}`);
    }
  };

  const handleSelectSubcategory = (catId: string, subName: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (subName === 'all') {
      nextParams.delete('sub');
    } else {
      nextParams.set('sub', subName);
    }
    
    if (catId === 'all') {
      navigate(`/shop?${nextParams.toString()}`);
    } else {
      navigate(`/shop/${catId}?${nextParams.toString()}`);
    }
    setIsMobileDrawerOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (shopSearchInput.trim()) {
      nextParams.set('q', shopSearchInput.trim());
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', sort);
    setSearchParams(nextParams);
  };

  const handleFabricSelect = (fabric: string) => {
    const newFab = selectedFabric === fabric ? 'all' : fabric;
    setSelectedFabric(newFab);
    const nextParams = new URLSearchParams(searchParams);
    if (newFab === 'all') nextParams.delete('fabric');
    else nextParams.set('fabric', newFab);
    setSearchParams(nextParams);
  };

  const handleSizeSelect = (size: string) => {
    const newSize = selectedSize === size ? 'all' : size;
    setSelectedSize(newSize);
    const nextParams = new URLSearchParams(searchParams);
    if (newSize === 'all') nextParams.delete('size');
    else nextParams.set('size', newSize);
    setSearchParams(nextParams);
  };

  const handleColorSelect = (colorName: string) => {
    const newColor = selectedColor === colorName ? 'all' : colorName;
    setSelectedColor(newColor);
    const nextParams = new URLSearchParams(searchParams);
    if (newColor === 'all') nextParams.delete('color');
    else nextParams.set('color', newColor);
    setSearchParams(nextParams);
  };

  const handlePricePreset = (min: number, max: number) => {
    setPriceRange([min, max]);
    const nextParams = new URLSearchParams(searchParams);
    if (min === 0) nextParams.delete('minPrice');
    else nextParams.set('minPrice', String(min));
    if (max === 10000) nextParams.delete('maxPrice');
    else nextParams.set('maxPrice', String(max));
    setSearchParams(nextParams);
  };

  const handleInStockToggle = (checked: boolean) => {
    setInStockOnly(checked);
    const nextParams = new URLSearchParams(searchParams);
    if (checked) nextParams.set('inStock', 'true');
    else nextParams.delete('inStock');
    setSearchParams(nextParams);
  };

  const handleOnSaleToggle = (checked: boolean) => {
    setOnSaleOnly(checked);
    const nextParams = new URLSearchParams(searchParams);
    if (checked) nextParams.set('onSale', 'true');
    else nextParams.delete('onSale');
    setSearchParams(nextParams);
  };

  const handleResetAll = () => {
    setShopSearchInput('');
    setSelectedFabric('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setPriceRange([0, 10000]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSelectedSort('featured');
    navigate('/shop');
  };

  // Filter computation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category Match
      if (selectedCategory !== 'all') {
        const catLower = selectedCategory.toLowerCase();
        const catObj = shopCategories.find(c => c.id === catLower || c.name.toLowerCase() === catLower);
        const pCat = (product.category || '').toLowerCase();

        let match = false;
        if (pCat === catLower || (catObj && pCat === catObj.name.toLowerCase())) {
          match = true;
        } else if (catLower === 'men' && (product.gender === 'men' || pCat.includes('men'))) {
          match = true;
        } else if (catLower === 'women' && (product.gender === 'women' || pCat.includes('women'))) {
          match = true;
        } else if (catObj && catObj.subcategories.length > 0 && product.subcategory) {
          match = catObj.subcategories.some(s => s.toLowerCase() === product.subcategory?.toLowerCase());
        } else if (catObj && product.badge && product.badge.toLowerCase().includes(catObj.name.toLowerCase())) {
          match = true;
        }

        if (!match) return false;
      }

      // Subcategory Match
      if (selectedSubcategory !== 'all') {
        const sub = selectedSubcategory.toLowerCase();
        const pSub = (product.subcategory || '').toLowerCase();
        const pName = product.name.toLowerCase();
        const pCat = (product.category || '').toLowerCase();
        if (pSub !== sub && !pSub.includes(sub) && !pName.includes(sub) && !pCat.includes(sub)) {
          return false;
        }
      }

      // Query Keyword Search
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const inName = product.name.toLowerCase().includes(q);
        const inBengali = product.bengaliName.toLowerCase().includes(q);
        const inSub = (product.subcategory || '').toLowerCase().includes(q);
        const inFabric = product.fabric.toLowerCase().includes(q);
        const inSku = product.sku.toLowerCase().includes(q);
        if (!inName && !inBengali && !inSub && !inFabric && !inSku) {
          return false;
        }
      }

      // Fabric Filter
      if (selectedFabric !== 'all') {
        if (!product.fabric.toLowerCase().includes(selectedFabric.toLowerCase())) return false;
      }

      // Size Filter
      if (selectedSize !== 'all') {
        if (!product.sizes.includes(selectedSize)) return false;
      }

      // Color Filter
      if (selectedColor !== 'all') {
        const hasColor = product.colors.some(c => 
          c.name.toLowerCase().includes(selectedColor.toLowerCase())
        );
        if (!hasColor) return false;
      }

      // Price Range Filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // In Stock Filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // On Sale Filter
      if (onSaleOnly && (!product.discountPercent || product.discountPercent <= 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      if (selectedSort === 'newest') return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0);
      return 0; // featured default
    });
  }, [
    products, 
    shopCategories,
    selectedCategory, 
    selectedSubcategory, 
    queryParam, 
    selectedFabric, 
    selectedSize, 
    selectedColor, 
    priceRange, 
    inStockOnly, 
    onSaleOnly, 
    selectedSort
  ]);

  // Total count per category helper
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return products.length;
    const catLower = catId.toLowerCase();
    const catObj = shopCategories.find(c => c.id === catId || c.name.toLowerCase() === catLower);

    return products.filter(p => {
      if (catLower === 'men') return p.gender === 'men' || p.category === 'men';
      if (catLower === 'women') return p.gender === 'women' || p.category === 'women';
      
      const pCat = (p.category || '').toLowerCase();
      if (pCat === catLower || (catObj && pCat === catObj.name.toLowerCase())) return true;
      if (catObj && catObj.subcategories.length > 0 && p.subcategory) {
        return catObj.subcategories.some(s => s.toLowerCase() === p.subcategory?.toLowerCase());
      }
      return false;
    }).length;
  };

  // Subcategory count helper
  const getSubcategoryCount = (catId: string, subName: string) => {
    const sub = subName.toLowerCase();
    const catLower = catId.toLowerCase();
    const catObj = shopCategories.find(c => c.id === catId || c.name.toLowerCase() === catLower);

    return products.filter(p => {
      // Category scope check
      if (catId !== 'all') {
        if (catLower === 'men' && !(p.gender === 'men' || p.category === 'men')) return false;
        if (catLower === 'women' && !(p.gender === 'women' || p.category === 'women')) return false;
        if (catLower !== 'men' && catLower !== 'women') {
          const pCat = (p.category || '').toLowerCase();
          const matchCat = pCat === catLower || (catObj && pCat === catObj.name.toLowerCase());
          if (!matchCat) return false;
        }
      }

      // Subcategory check
      const pSub = (p.subcategory || '').toLowerCase();
      const pName = p.name.toLowerCase();
      return pSub.includes(sub) || pName.includes(sub);
    }).length;
  };

  // Active filters count
  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSubcategory !== 'all' ? 1 : 0) +
    (queryParam ? 1 : 0) +
    (selectedFabric !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (selectedColor !== 'all' ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0);

  const currentCategoryObj = useMemo(() => {
    const found = shopCategories.find(c => c.id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase());
    return found || {
      id: selectedCategory,
      name: selectedCategory === 'all' ? 'All Collections' : selectedCategory.toUpperCase(),
      bengaliName: '',
      subcategories: []
    };
  }, [shopCategories, selectedCategory]);

  // Render Sidebar Content (shared between Desktop & Mobile drawer)
  const renderSidebarFilters = () => (
    <div className="space-y-6 text-neutral-900">
      
      {/* Category Tree Navigation */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-black" />
            Categories & Subcategories
          </h3>
          <div className="flex items-center space-x-2">
            {dynamicCategories.length > 0 && (
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-none font-mono">
                Live
              </span>
            )}
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => handleSelectCategory('all')}
                className="text-[11px] text-neutral-500 hover:text-black underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          {shopCategories.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            const isOpen = openCategoryAccordion === cat.id;
            const count = getCategoryCount(cat.id);

            return (
              <div key={cat.id} className="border-b border-neutral-100 last:border-0 pb-1 pt-1">
                <div className="flex items-center justify-between group">
                  <button
                    type="button"
                    onClick={() => {
                      if (cat.subcategories.length > 0) {
                        handleSelectCategory(cat.id, true);
                      } else {
                        handleSelectCategory(cat.id, false);
                      }
                    }}
                    className={`flex-1 text-left py-2 px-2.5 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer rounded-none ${
                      isCatActive 
                        ? 'bg-black text-white font-extrabold' 
                        : isOpen
                          ? 'bg-neutral-100 text-neutral-900 border-l-2 border-black pl-2'
                          : 'text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="truncate">{cat.name}</span>
                      {cat.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-none font-bold uppercase flex-shrink-0 ${
                          isCatActive ? 'bg-white text-black' : 'bg-neutral-200 text-neutral-800'
                        }`}>
                          {cat.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono ml-1 flex-shrink-0 ${isCatActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                      ({count})
                    </span>
                  </button>

                  {cat.subcategories.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategoryAccordion(cat.id);
                      }}
                      className={`p-2 hover:text-black cursor-pointer transition-colors ${
                        isOpen ? 'text-black bg-neutral-100' : isCatActive ? 'text-neutral-800' : 'text-neutral-400'
                      }`}
                      aria-label={`Toggle ${cat.name} subcategories`}
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Floating Subcategories Container */}
                {cat.subcategories.length > 0 && isOpen && (
                  <div className="my-2 mx-1 p-2 bg-neutral-50/95 border border-neutral-200 shadow-md shadow-neutral-900/5 rounded-xs space-y-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1.5">
                    <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-neutral-200 text-[10px] uppercase font-bold tracking-wider text-neutral-500 px-1">
                      <span>{cat.name} Subcategories</span>
                      <span className="font-mono text-neutral-400 font-normal">
                        {cat.subcategories.length} items
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto pr-1 space-y-0.5 scrollbar-thin">
                      {cat.subcategories.map((sub) => {
                        const isSubActive = isCatActive && selectedSubcategory === sub;
                        const subCount = getSubcategoryCount(cat.id, sub);

                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => handleSelectSubcategory(cat.id, sub)}
                            className={`w-full text-left py-1.5 px-2.5 text-[11px] flex items-center justify-between transition-all cursor-pointer rounded-xs ${
                              isSubActive
                                ? 'bg-black text-white font-bold shadow-xs'
                                : 'text-neutral-700 hover:text-black hover:bg-white bg-transparent hover:shadow-2xs'
                            }`}
                          >
                            <span className="truncate">{sub}</span>
                            <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                              {subCount > 0 && (
                                <span className={`text-[9px] font-mono ${isSubActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                                  ({subCount})
                                </span>
                              )}
                              {isSubActive && <Check className="w-3 h-3 text-white flex-shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Presets & Range Slider */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-widest text-neutral-900">
            Price Range (BDT)
          </label>
          <span className="text-xs font-bold text-neutral-900">
            ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
          </span>
        </div>

        {/* Quick price presets */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <button
            type="button"
            onClick={() => handlePricePreset(0, 2000)}
            className="text-[11px] py-1 px-2 border border-neutral-200 hover:border-black rounded-none text-neutral-700 hover:text-black cursor-pointer bg-white"
          >
            Under ৳2,000
          </button>
          <button
            type="button"
            onClick={() => handlePricePreset(2000, 3500)}
            className="text-[11px] py-1 px-2 border border-neutral-200 hover:border-black rounded-none text-neutral-700 hover:text-black cursor-pointer bg-white"
          >
            ৳2,000 - ৳3,500
          </button>
          <button
            type="button"
            onClick={() => handlePricePreset(3500, 5000)}
            className="text-[11px] py-1 px-2 border border-neutral-200 hover:border-black rounded-none text-neutral-700 hover:text-black cursor-pointer bg-white"
          >
            ৳3,500 - ৳5,000
          </button>
          <button
            type="button"
            onClick={() => handlePricePreset(5000, 10000)}
            className="text-[11px] py-1 px-2 border border-neutral-200 hover:border-black rounded-none text-neutral-700 hover:text-black cursor-pointer bg-white"
          >
            ৳5,000 & Above
          </button>
        </div>

        <input
          type="range"
          min="500"
          max="10000"
          step="250"
          value={priceRange[1]}
          onChange={(e) => handlePricePreset(priceRange[0], Number(e.target.value))}
          className="w-full accent-black cursor-pointer"
        />
      </div>

      {/* Fabric Material Filter */}
      <div className="border-b border-neutral-200 pb-5">
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-900 mb-2">
          Fabric & Material
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FABRIC_FILTERS.map((fab) => {
            const isSelected = selectedFabric === fab;
            return (
              <button
                key={fab}
                type="button"
                onClick={() => handleFabricSelect(fab)}
                className={`text-xs px-2.5 py-1 rounded-none border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                }`}
              >
                {fab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="border-b border-neutral-200 pb-5">
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-900 mb-2">
          Select Size
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {SIZE_FILTERS.map((sz) => {
            const isSelected = selectedSize === sz;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => handleSizeSelect(sz)}
                className={`text-xs py-1.5 rounded-none border text-center font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Swatches */}
      <div className="border-b border-neutral-200 pb-5">
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-900 mb-2">
          Color Palette
        </label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_SWATCHES.map((col) => {
            const isSelected = selectedColor === col.name;
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => handleColorSelect(col.name)}
                className={`flex items-center space-x-1 p-1 text-[10px] border transition-all cursor-pointer rounded-none ${
                  isSelected ? 'border-black bg-neutral-100 font-bold' : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}
                title={col.name}
              >
                <span 
                  className="w-3.5 h-3.5 border border-neutral-300 flex-shrink-0"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="truncate">{col.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability & Offers Toggles */}
      <div className="space-y-2.5 pb-2">
        <label className="flex items-center space-x-2 text-xs text-neutral-800 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => handleInStockToggle(e.target.checked)}
            className="rounded-none text-black focus:ring-black h-4 w-4"
          />
          <span className="font-medium">In Stock Only (Ready to Dispatch)</span>
        </label>

        <label className="flex items-center space-x-2 text-xs text-neutral-800 cursor-pointer">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => handleOnSaleToggle(e.target.checked)}
            className="rounded-none text-black focus:ring-black h-4 w-4"
          />
          <span className="font-medium">Special Eid Discounts / On Sale</span>
        </label>
      </div>

      {/* Reset Filter Button */}
      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={handleResetAll}
          className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold py-2.5 rounded-none transition-colors uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer border border-neutral-300"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters ({activeFiltersCount})</span>
        </button>
      )}

    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Top Breadcrumb & Page Banner Header */}
      <div className="bg-neutral-900 text-white border-b border-neutral-800 py-6">
        <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            {/* Breadcrumb path */}
            <nav className="flex items-center space-x-2 text-xs text-neutral-400 mb-2">
              <Link to="/" className="hover:text-white transition-colors flex items-center">
                <Home className="w-3.5 h-3.5 mr-1" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              <Link to="/shop" className="hover:text-white transition-colors font-medium">
                Shop
              </Link>
              {selectedCategory !== 'all' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-white font-semibold">{currentCategoryObj.name}</span>
                </>
              )}
              {selectedSubcategory !== 'all' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-neutral-300 font-bold">{selectedSubcategory}</span>
                </>
              )}
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-sans tracking-wide text-white">
              {selectedSubcategory !== 'all' 
                ? selectedSubcategory 
                : currentCategoryObj.name}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              {currentCategoryObj.bengaliName} • {filteredProducts.length} Premium Designs Available
            </p>
          </div>

          {/* Quick Return to Home & Express Order Button */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-4 py-2 rounded-none transition-colors uppercase tracking-wider flex items-center space-x-1.5 border border-neutral-700"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/checkout"
              className="bg-white hover:bg-neutral-200 text-black text-xs font-extrabold px-4 py-2 rounded-none transition-colors uppercase tracking-wider flex items-center space-x-1.5 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Direct Checkout</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Main Layout: Sidebar (Left) + Product Grid (Right) */}
      <div className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* DESKTOP SIDEBAR (3 cols on lg) */}
          <aside className="hidden lg:block lg:col-span-3 border-r border-neutral-200 pr-6 space-y-6 sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2 scrollbar-thin">
            {renderSidebarFilters()}
          </aside>

          {/* RIGHT PRODUCT CATALOG (9 cols on lg) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Catalog Top Control Bar */}
            <div className="bg-white border border-neutral-200 p-3 sm:p-4 rounded-none flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              
              {/* Left: Mobile Filter Button & Search inside Catalog */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                {/* Mobile Drawer Trigger */}
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className="lg:hidden bg-black text-white text-xs font-bold px-3.5 py-2 rounded-none flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>

                {/* Catalog Search Input */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={shopSearchInput}
                    onChange={(e) => setShopSearchInput(e.target.value)}
                    placeholder="Search in catalog (e.g. panjabi, black, polo)..."
                    className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded-none pl-8 pr-14 py-2 text-neutral-900 focus:outline-none focus:border-black"
                  />
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  {shopSearchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setShopSearchInput('');
                        const nextParams = new URLSearchParams(searchParams);
                        nextParams.delete('q');
                        setSearchParams(nextParams);
                      }}
                      className="absolute right-10 top-2 text-neutral-400 hover:text-black text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded-none hover:bg-black"
                  >
                    Go
                  </button>
                </form>
              </div>

              {/* Right: Grid Switcher & Sorting Dropdown */}
              <div className="flex items-center gap-3 ml-auto">
                
                {/* Grid Density Buttons (Hidden on small mobile) */}
                <div className="hidden sm:flex items-center border border-neutral-200 rounded-none bg-neutral-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setGridColumns(2)}
                    className={`p-1.5 transition-colors cursor-pointer rounded-none ${gridColumns === 2 ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'}`}
                    title="2 Columns"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridColumns(3)}
                    className={`p-1.5 transition-colors cursor-pointer rounded-none ${gridColumns === 3 ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'}`}
                    title="3 Columns"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridColumns(4)}
                    className={`p-1.5 transition-colors cursor-pointer rounded-none ${gridColumns === 4 ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'}`}
                    title="4 Columns"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center space-x-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
                  <label htmlFor="shop-sort-select" className="sr-only">Sort By</label>
                  <select
                    id="shop-sort-select"
                    value={selectedSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="text-xs font-bold bg-white border border-neutral-300 rounded-none px-2.5 py-2 text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="featured">Featured Curations</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High (৳)</option>
                    <option value="price-high">Price: High to Low (৳)</option>
                    <option value="rating">Highest Rated (★ 4.9+)</option>
                    <option value="discount">Biggest Discount (%)</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-neutral-50 border border-neutral-200 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mr-1">
                  Active Filters:
                </span>

                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center bg-white border border-neutral-300 px-2 py-0.5 rounded-none text-xs font-bold text-neutral-800">
                    Category: {currentCategoryObj.name}
                    <button onClick={() => handleSelectCategory('all')} className="ml-1 text-neutral-400 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedSubcategory !== 'all' && (
                  <span className="inline-flex items-center bg-white border border-neutral-300 px-2 py-0.5 rounded-none text-xs font-bold text-neutral-800">
                    Sub: {selectedSubcategory}
                    <button onClick={() => handleSelectSubcategory(selectedCategory, 'all')} className="ml-1 text-neutral-400 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {queryParam && (
                  <span className="inline-flex items-center bg-white border border-neutral-300 px-2 py-0.5 rounded-none text-xs font-bold text-neutral-800">
                    Query: "{queryParam}"
                    <button onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('q');
                      setSearchParams(next);
                    }} className="ml-1 text-neutral-400 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedFabric !== 'all' && (
                  <span className="inline-flex items-center bg-white border border-neutral-300 px-2 py-0.5 rounded-none text-xs font-bold text-neutral-800">
                    Fabric: {selectedFabric}
                    <button onClick={() => handleFabricSelect('all')} className="ml-1 text-neutral-400 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedSize !== 'all' && (
                  <span className="inline-flex items-center bg-white border border-neutral-300 px-2 py-0.5 rounded-none text-xs font-bold text-neutral-800">
                    Size: {selectedSize}
                    <button onClick={() => handleSizeSelect('all')} className="ml-1 text-neutral-400 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedColor !== 'all' && (
                  <span className="inline-flex items-center bg-white border border-neutral-300 px-2 py-0.5 rounded-none text-xs font-bold text-neutral-800">
                    Color: {selectedColor}
                    <button onClick={() => handleColorSelect('all')} className="ml-1 text-neutral-400 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <span className="inline-flex items-center bg-white border border-neutral-300 px-2 py-0.5 rounded-none text-xs font-bold text-neutral-800">
                    ৳{priceRange[0]} - ৳{priceRange[1]}
                    <button onClick={() => handlePricePreset(0, 10000)} className="ml-1 text-neutral-400 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center bg-white border border-neutral-300 px-2 py-0.5 rounded-none text-xs font-bold text-neutral-800">
                    In Stock Only
                    <button onClick={() => handleInStockToggle(false)} className="ml-1 text-neutral-400 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {onSaleOnly && (
                  <span className="inline-flex items-center bg-white border border-neutral-300 px-2 py-0.5 rounded-none text-xs font-bold text-neutral-800">
                    Discounts Only
                    <button onClick={() => handleOnSaleToggle(false)} className="ml-1 text-neutral-400 hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetAll}
                  className="text-xs text-neutral-600 hover:text-black font-bold underline ml-auto cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid Area */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 border border-neutral-200 p-8 rounded-none">
                <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">
                  No matching products found
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                  Try clearing some filter tags or search terms to see the complete Blucheez collections.
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-none uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                  <Link
                    to="/"
                    className="bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 text-xs font-bold px-6 py-2.5 rounded-none uppercase tracking-wider transition-colors"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                gridColumns === 2 
                  ? 'grid-cols-2' 
                  : gridColumns === 3 
                    ? 'grid-cols-2 sm:grid-cols-3' 
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Bottom Quick Return to Home Footer Strip */}
            <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-neutral-900">Blucheez Fashion Atelier</span>
                <span>•</span>
                <span>Free nationwide delivery over ৳3,000</span>
                <span>•</span>
                <span>7-Day Easy Exchange</span>
              </div>
              <Link
                to="/"
                className="font-bold text-neutral-900 hover:underline inline-flex items-center"
              >
                <span>Return to Homepage</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

          </main>

        </div>
      </div>

      {/* MOBILE FILTER SLIDE-OVER DRAWER */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 border-l border-neutral-200">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4" />
                <h2 className="text-xs font-bold uppercase tracking-widest">
                  Filters & Categories ({activeFiltersCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 hover:text-neutral-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {renderSidebarFilters()}
            </div>

            {/* Sticky Drawer Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleResetAll}
                className="w-full bg-white text-neutral-900 text-xs font-bold py-3 border border-neutral-300 rounded-none uppercase tracking-wider"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full bg-black text-white text-xs font-bold py-3 rounded-none uppercase tracking-wider"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
