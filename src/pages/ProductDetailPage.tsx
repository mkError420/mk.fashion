import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  Share2,
  Minus,
  Plus,
  Check,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ProductImageZoom } from '../components/ProductImageZoom';
import { Product } from '../types';
import { fetchProduct, convertBackendToFrontendProduct } from '../services/api';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    openQuickCheckout,
    toggleWishlist,
    isInWishlist,
    openSizeGuide,
    addToast
  } = useShop();

  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [isFetchingDirect, setIsFetchingDirect] = useState(false);

  // Fetch single product from API if not yet found in context or to guarantee freshest gallery/variants
  useEffect(() => {
    if (id) {
      const numId = Number(id);
      if (!isNaN(numId) && numId > 0) {
        setIsFetchingDirect(true);
        fetchProduct(numId)
          .then(data => {
            if (data && data.id) {
              setDirectProduct(convertBackendToFrontendProduct(data) as Product);
            }
          })
          .catch(() => { })
          .finally(() => setIsFetchingDirect(false));
      }
    }
  }, [id]);

  const product = directProduct || products.find(p => p.id === id || p.sku === id || p.backendId?.toString() === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping' | 'reviews'>('details');

  // Initialize size and color
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0]?.name || '');
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product && isFetchingDirect) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <RefreshCw className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
        <p className="text-sm font-medium text-neutral-600">Loading product details…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6 max-w-sm">
          The requested product may have sold out or the link is incorrect.
        </p>
        <Link
          to="/collections/all"
          className="bg-black text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  // Find variant matching current size & color selection
  const matchingVariant = product.variants?.find(v => {
    const sizeMatch = !v.size || v.size === selectedSize;
    const colorMatch = !v.color || v.color === selectedColor;
    return sizeMatch && colorMatch;
  });

  const effectivePrice = matchingVariant && matchingVariant.price_override != null
    ? Number(matchingVariant.price_override)
    : product.price;

  const isVariantOutOfStock = matchingVariant ? matchingVariant.stock_quantity <= 0 : !product.inStock;
  const isFavorited = isInWishlist(product.id);
  const isDiscounted = product.originalPrice > effectivePrice;
  const savingsAmount = product.originalPrice - effectivePrice;
  const isFreeDeliveryQualified = effectivePrice * quantity >= 3000;

  const handleAddToCart = () => {
    const productWithEffectivePrice = { ...product, price: effectivePrice };
    addToCart(productWithEffectivePrice, selectedSize, selectedColor, quantity, true);
  };

  const handleCashOnDeliveryBuyNow = () => {
    const productWithEffectivePrice = { ...product, price: effectivePrice };
    addToCart(productWithEffectivePrice, selectedSize, selectedColor, quantity, false);
    navigate('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Blucheez`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link Copied', 'Product link copied to clipboard.', 'info');
    }
  };

  // Related products from same category or subcategory
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.subcategory === product.subcategory || p.category === product.category))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-4 border-b border-neutral-100">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link
            to={`/collections/${product.category}`}
            className="hover:text-black transition-colors uppercase font-medium"
          >
            {product.category}
          </Link>
          {product.subcategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <Link
                to={`/collections/${product.category}?sub=${encodeURIComponent(product.subcategory)}`}
                className="hover:text-black transition-colors"
              >
                {product.subcategory}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main PDP Grid */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT: Product Photography Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">

            {/* Thumbnail Navigation */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:w-20 flex-shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${activeImageIndex === idx ? 'border-black ring-1 ring-black' : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Primary Featured Image Viewport with Dynamic Hover Magnification Zoom */}
            <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <ProductImageZoom
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full"
                zoomScale={2.5}
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.badge && (
                  <span className="bg-black text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded shadow-md">
                    {product.badge}
                  </span>
                )}
                {isDiscounted && product.discountPercent && (
                  <span className="bg-neutral-900 text-white text-xs font-bold px-2.5 py-0.5 rounded shadow-sm w-fit">
                    -{product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist floating toggle */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${isFavorited ? 'bg-black text-white' : 'bg-white/90 hover:bg-white text-neutral-700 hover:text-black'
                  }`}
                aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white text-white' : ''}`} />
              </button>
            </div>

          </div>

          {/* RIGHT: Product Ordering & Specs (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Header / Brand & Title */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                <span className="font-bold uppercase tracking-widest text-neutral-900">
                  {product.category === 'blucheez-black' ? 'Blucheez | Black Society' : product.category === 'belwari' ? 'Belwari Atelier' : 'Blucheez Exclusive'}
                </span>
                <span className="font-mono">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900 leading-tight">
                {product.name}
              </h1>

              {product.bengaliName && (
                <p className="text-sm text-neutral-500 font-medium mt-1">
                  {product.bengaliName}
                </p>
              )}

              {/* Ratings & Stock Status */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center space-x-1 bg-neutral-100 px-2 py-0.5 rounded text-xs font-bold text-neutral-800">
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-400 font-normal">({product.reviewCount} reviews)</span>
                </div>

                {matchingVariant ? (
                  matchingVariant.stock_quantity > 0 ? (
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      In Stock ({matchingVariant.stock_quantity} available)
                    </span>
                  ) : (
                    <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold border border-rose-200 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />
                      Out of Stock for Selected Variant
                    </span>
                  )
                ) : (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    In Stock - Dispatch within 24h
                  </span>
                )}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-black text-neutral-900">
                  ৳{effectivePrice.toLocaleString()}
                </span>
                {matchingVariant && matchingVariant.price_override != null && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                    Variant Price
                  </span>
                )}
                {isDiscounted && (
                  <>
                    <span className="text-base text-neutral-400 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      Save ৳{savingsAmount.toLocaleString()} ({Math.round((savingsAmount / product.originalPrice) * 100)}%)
                    </span>
                  </>
                )}
              </div>

              <p className="text-[11px] text-neutral-500 mt-1">
                Prices inclusive of all VAT & taxes. 100% Cash on Delivery across Bangladesh.
              </p>

              {/* Free delivery badge */}
              {isFreeDeliveryQualified ? (
                <div className="mt-3 flex items-center space-x-1.5 text-xs text-black font-extrabold">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Qualified for FREE Nationwide Delivery (Tk 3,000+ Order)</span>
                </div>
              ) : (
                <div className="mt-3 text-xs text-neutral-600">
                  <span>Add <strong>৳{(3000 - (effectivePrice * quantity)).toLocaleString()}</strong> more to get <strong>FREE Nationwide Delivery</strong>.</span>
                </div>
              )}
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-neutral-900">
                    Color: <span className="font-semibold text-neutral-700">{selectedColor}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${selectedColor === color.name
                          ? 'border-black bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400'
                        }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-400"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector with Size Guide Trigger */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-neutral-900">
                  Select Size: <span className="font-semibold text-neutral-700">{selectedSize}</span>
                </span>

                <button
                  type="button"
                  onClick={() => openSizeGuide('panjabi')}
                  className="inline-flex items-center space-x-1 text-neutral-600 hover:text-black font-semibold cursor-pointer underline text-xs"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart (মাপের নির্দেশিকা)</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map(size => {
                  const sizeVariant = product.variants?.find(v =>
                    v.size === size && (!selectedColor || v.color === selectedColor)
                  );
                  const isSizeOut = sizeVariant ? sizeVariant.stock_quantity <= 0 : false;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-center text-xs font-bold rounded-none border transition-all cursor-pointer ${selectedSize === size
                          ? 'bg-black text-white border-black shadow-xs'
                          : isSizeOut
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through'
                            : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500'
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-neutral-300 rounded-none bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                  disabled={quantity <= 1 || isVariantOutOfStock}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-neutral-900 min-w-10 text-center select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                  disabled={isVariantOutOfStock}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons: 1-Click COD & Add to Bag */}
            <div className="space-y-2.5 pt-2">

              {/* PRIMARY ACTION 1: Direct Cash on Delivery Checkout */}
              <button
                type="button"
                onClick={handleCashOnDeliveryBuyNow}
                disabled={isVariantOutOfStock}
                className={`w-full font-bold py-4 px-6 rounded-none flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer tracking-wider uppercase text-xs sm:text-sm active:scale-98 ${isVariantOutOfStock
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-black hover:bg-neutral-800 text-white'
                  }`}
              >
                <span>{isVariantOutOfStock ? 'Out of Stock (এই ভ্যারিয়েন্টটি শেষ)' : 'Cash on Delivery Buy Now (ক্যাশ অন ডেলিভারি অর্ডার)'}</span>
                {!isVariantOutOfStock && <ArrowRight className="w-4 h-4" />}
              </button>

              {/* PRIMARY ACTION 2: Add to Shopping Bag */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isVariantOutOfStock}
                  className={`flex-1 font-bold py-3.5 px-4 rounded-none flex items-center justify-center space-x-2 transition-colors cursor-pointer text-xs uppercase tracking-wider border ${isVariantOutOfStock
                      ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-300'
                    }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isVariantOutOfStock ? 'Unavailable' : 'Add to Bag (ব্যাগে রাখুন)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-3.5 rounded-none border border-neutral-300 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Delivery & Service Assurances Box */}
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 space-y-3 text-xs">
              <div className="flex items-start space-x-3">
                <Truck className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">Nationwide Fast Delivery</h4>
                  <p className="text-neutral-500 mt-0.5">
                    Inside Dhaka: <strong>24–48 Hours (৳60)</strong> | Outside Dhaka: <strong>48–72 Hours (৳120)</strong>. Free for orders ৳3,000+.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">Zero Advance Cash on Delivery</h4>
                  <p className="text-neutral-500 mt-0.5">
                    No advance payment required. Inspect your parcel and pay upon delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RefreshCw className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">7-Day Hassle-Free Exchange</h4>
                  <p className="text-neutral-500 mt-0.5">
                    Exchange sizes easily at our Banani, Dhanmondi, or Uttara outlets, or request door-to-door courier exchange.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Product Details */}
        <div className="mt-12 pt-8 border-t border-neutral-200">

          {/* Tab Navigation */}
          <div className="flex items-center space-x-6 border-b border-neutral-200 overflow-x-auto scrollbar-none">
            {[
              { id: 'details', label: 'Fabric & Specifications' },
              { id: 'care', label: 'Wash & Care Guide' },
              { id: 'shipping', label: 'Delivery & Returns Policy' },
              { id: 'reviews', label: `Verified Reviews (${product.reviewCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap cursor-pointer transition-colors border-b-2 -mb-px ${activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="py-6 max-w-3xl text-xs sm:text-sm text-neutral-700 leading-relaxed">

            {activeTab === 'details' && (
              <div className="space-y-4">
                <p>{product.description}</p>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2 mt-4">
                  <div className="grid grid-cols-3 gap-2 py-1 border-b border-neutral-200">
                    <span className="font-bold text-neutral-900">Fabric:</span>
                    <span className="col-span-2 text-neutral-700">{product.fabric}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1 border-b border-neutral-200">
                    <span className="font-bold text-neutral-900">Fit Cut:</span>
                    <span className="col-span-2 text-neutral-700">{product.fit}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-1">
                    <span className="font-bold text-neutral-900">Craftsmanship:</span>
                    <span className="col-span-2 text-neutral-700">Artisan hand-embroidery, reinforced side slits & custom buttons</span>
                  </div>
                </div>

                {product.highlights && product.highlights.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold text-neutral-900 mb-2">Key Highlights</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.highlights.map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900">Preserving Your Garment</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  {product.careInstructions?.map((ins, i) => (
                    <li key={i}>{ins}</li>
                  )) || (
                      <>
                        <li>Dry cleaning recommended for first wash to set color vibrancy.</li>
                        <li>Cold water gentle cycle with mild detergent.</li>
                        <li>Do not bleach or dry under direct scorching sunlight.</li>
                        <li>Warm iron on reverse side of decorative stitching.</li>
                      </>
                    )}
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h4 className="font-bold text-neutral-900">Cash on Delivery & Courier Partners</h4>
                <p>
                  We partner with Bangladesh’s leading courier networks including <strong>Steadfast Courier, Pathao Logistics, and RedX</strong> to ensure prompt delivery to all 64 districts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="border border-neutral-200 p-3.5 rounded-lg bg-neutral-50">
                    <span className="font-bold text-neutral-900 block">Inside Dhaka Metropolis</span>
                    <span className="text-neutral-500">24 to 48 hours delivery (৳60)</span>
                  </div>
                  <div className="border border-neutral-200 p-3.5 rounded-lg bg-neutral-50">
                    <span className="font-bold text-neutral-900 block">Outside Dhaka (All Bangladesh)</span>
                    <span className="text-neutral-500">48 to 72 hours delivery (৳120)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl font-bold text-neutral-900">{product.rating}</div>
                  <div>
                    <div className="flex text-black">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-black text-black" />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">Based on {product.reviewCount} customer reviews</span>
                  </div>
                </div>

                <div className="space-y-3 divide-y divide-neutral-200">
                  <div className="pt-3 first:pt-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-neutral-900">Tanvir H. (Gulshan, Dhaka)</span>
                      <span className="text-neutral-400">Verified Buyer</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      "The fabric quality on this Panjabi is exceptional. The mercerized finish gives it a subtle luxury sheen without being loud. Delivered in 24 hours in Dhaka via Steadfast with zero hassle."
                    </p>
                  </div>
                  <div className="pt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-neutral-900">Nabila K. (Nasirabad, Chattogram)</span>
                      <span className="text-neutral-400">Verified Buyer</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      "Bought this as an Eid gift. The packaging was immaculate with the magnetic box and ribbon. True to size according to the size chart."
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-neutral-400">
                  Complete the Wardrobe
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-neutral-900">
                  You May Also Like
                </h3>
              </div>
              <Link
                to={`/collections/${product.category}`}
                className="text-xs font-bold uppercase tracking-wider text-black hover:underline inline-flex items-center"
              >
                <span>View More in {product.category}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
