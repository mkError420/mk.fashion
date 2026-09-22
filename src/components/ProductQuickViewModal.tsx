import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductImageZoom } from './ProductImageZoom';

export const ProductQuickViewModal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    quickViewProduct, 
    closeQuickView, 
    addToCart, 
    isInWishlist, 
    toggleWishlist,
    openSizeGuide
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIndex(0);
      setSelectedSize(quickViewProduct.sizes[0] || 'Free Size');
      setSelectedColor(quickViewProduct.colors[0]?.name || 'Standard');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentSize = selectedSize || product.sizes[0] || 'Free Size';
  const currentColor = selectedColor || product.colors[0]?.name || 'Standard';
  const isFavorited = isInWishlist(product.id);

  const handle1ClickBuy = () => {
    addToCart(product, currentSize, currentColor, quantity, false);
    closeQuickView();
    navigate('/checkout');
  };

  const handleAddToBag = () => {
    addToCart(product, currentSize, currentColor, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-none max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-300 my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 rounded-none bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black shadow-md transition-colors border border-neutral-300 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-3">
            {/* Main Active Image with Hover Zoom */}
            <div className="relative aspect-3/4 rounded-none overflow-hidden bg-neutral-100 border border-neutral-200">
              <ProductImageZoom
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full"
                zoomScale={2.2}
              />
              
              {/* Product Badge */}
              {product.badge && (
                <span className="absolute top-0 left-0 z-10 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded-none border-b border-r border-neutral-800 pointer-events-none">
                  {product.badge}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-2 right-2 z-10 p-2.5 rounded-none shadow-md backdrop-blur-md transition-colors cursor-pointer border ${
                  isFavorited ? 'bg-black text-white border-black' : 'bg-white/90 text-neutral-700 hover:text-black border-neutral-200'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white text-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 rounded-none overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-black ring-1 ring-black' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded-none" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & Ordering */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Bengali subtitle */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  {product.category} • {product.bengaliName}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide font-sans text-neutral-900 leading-snug">
                {product.name}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center text-neutral-800">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-neutral-800 text-neutral-800" />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-800">{product.rating}</span>
                <span className="text-xs text-neutral-400">({product.reviewCount} verified reviews)</span>
              </div>

              {/* Pricing in Bangladeshi Taka */}
              <div className="flex items-baseline space-x-3 my-4 pb-4 border-b border-neutral-200">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-neutral-400 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 px-2 py-0.5 rounded-none uppercase">
                      Save ৳{(product.originalPrice - product.price).toLocaleString()} ({product.discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Fabric Specs */}
              <div className="bg-neutral-50 p-3 rounded-none border border-neutral-200 text-xs mb-4">
                <p className="text-neutral-700">
                  <strong className="text-neutral-900">Fabric Composition:</strong> {product.fabric}
                </p>
                <p className="text-neutral-700 mt-1">
                  <strong className="text-neutral-900">Tailoring Silhouette:</strong> {product.fit}
                </p>
              </div>

              {/* Size Selector */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="modal-size-selector" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Select Size: <span className="text-neutral-900">{currentSize}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => openSizeGuide(product.category === 'suits' ? 'suits' : product.category === 'shirts' ? 'shirts' : 'panjabi')}
                    className="inline-flex items-center text-xs text-neutral-900 hover:underline font-semibold cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5 mr-1" />
                    <span>View Measurement Chart</span>
                  </button>
                </div>

                <div id="modal-size-selector" className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-none text-xs font-bold border transition-all cursor-pointer ${
                        currentSize === size
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                    Color: <span className="text-neutral-600 font-normal">{currentColor}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-none border text-xs transition-all cursor-pointer ${
                          currentColor === c.name 
                            ? 'border-black bg-neutral-100 text-black font-bold' 
                            : 'border-neutral-200 bg-white text-neutral-700'
                        }`}
                      >
                        <span 
                          className="w-3 h-3 rounded-none border border-neutral-300" 
                          style={{ backgroundColor: c.hex }} 
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">Quantity:</span>
                <div className="flex items-center border border-neutral-300 rounded-none bg-neutral-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:text-black font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-neutral-900 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-neutral-600 hover:text-black font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-neutral-700 font-semibold flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1 text-black" />
                  In Stock ({product.stockCount} left)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Direct 1-Click Order Button */}
                <button
                  type="button"
                  onClick={handle1ClickBuy}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3 px-4 rounded-none flex items-center justify-center space-x-2 transition-all cursor-pointer uppercase tracking-wider text-xs sm:text-sm"
                >
                  <span>Order Cash on Delivery</span>
                </button>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold py-3 px-4 rounded-none flex items-center justify-center space-x-2 transition-all cursor-pointer border border-neutral-300 uppercase tracking-wider text-xs sm:text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

              {/* Delivery Assurance */}
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2">
                <span className="flex items-center">
                  <Truck className="w-3.5 h-3.5 mr-1 text-neutral-700" />
                  Dhaka: 24h-48h (৳60)
                </span>
                <span className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-neutral-700" />
                  Cash on Delivery
                </span>
                <span className="flex items-center">
                  <RefreshCw className="w-3.5 h-3.5 mr-1 text-neutral-700" />
                  7-Day Exchange
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
