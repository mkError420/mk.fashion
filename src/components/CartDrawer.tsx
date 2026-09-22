import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Tag, 
  FileText, 
  Gift, 
  Check, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    openCartCheckout,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    orderNote,
    setOrderNote,
    isGiftPackaging,
    setIsGiftPackaging,
    openQuickView
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  if (!isCartOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Blucheez standard free shipping threshold is Tk 3,000
  const freeShippingThreshold = 3000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const giftFee = isGiftPackaging ? 150 : 0;
  const estimatedDelivery = isFreeShipping ? 0 : 60; // Standard Dhaka 60 or Free
  const total = Math.max(0, subtotal - discountAmount + giftFee + (cart.length > 0 ? estimatedDelivery : 0));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    openCartCheckout();
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      {/* Click backdrop to dismiss */}
      <div className="flex-1" onClick={closeCart} />

      {/* Slide-out Drawer */}
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header - Clean Blucheez Aesthetic */}
        <div className="p-4 sm:p-5 bg-white border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-black" />
            <div className="flex items-baseline space-x-2">
              <h3 className="font-sans uppercase tracking-widest font-extrabold text-sm sm:text-base text-neutral-900">
                Shopping Bag
              </h3>
              <span className="text-xs bg-neutral-100 text-neutral-800 font-bold px-2 py-0.5 rounded-full border border-neutral-200">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close Shopping Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blucheez Free Delivery Threshold Progress Meter */}
        <div className="bg-neutral-50 px-5 py-3.5 border-b border-neutral-200">
          <div className="flex items-center justify-between text-xs mb-1.5">
            {isFreeShipping ? (
              <span className="text-black font-extrabold flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-black flex-shrink-0" />
                Congratulations! You’ve unlocked FREE Nationwide Delivery!
              </span>
            ) : (
              <span className="text-neutral-700 font-medium">
                Add <strong className="text-black font-bold">Tk {remainingForFreeShipping.toLocaleString()}</strong> more to get <strong className="text-black font-extrabold">FREE Delivery</strong>
              </span>
            )}
            <span className="text-[11px] font-bold text-neutral-500">
              {shippingProgress}%
            </span>
          </div>

          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-neutral-500 mt-1">
            <span>Tk 0</span>
            <span className="font-semibold text-neutral-700">Threshold: Tk 3,000 (Free Nationwide Shipping)</span>
          </div>
        </div>

        {/* Cart Items Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-neutral-100">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h4 className="font-serif font-bold text-lg text-neutral-900">Your shopping bag is empty</h4>
              <p className="text-xs text-neutral-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Discover our Eid Panjabis, Blucheez Black society collection, Belwari handloom sarees, and summer knits.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-6 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-8 py-3.5 rounded-full transition-all cursor-pointer tracking-wider uppercase shadow-md active:scale-95"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const isDiscounted = item.product.originalPrice > item.product.price;
              return (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 sm:gap-4 items-start">
                  
                  {/* Thumbnail */}
                  <div 
                    onClick={() => openQuickView(item.product)}
                    className="relative w-20 h-26 sm:w-24 sm:h-30 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0 cursor-pointer group"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    {isDiscounted && item.product.discountPercent && (
                      <span className="absolute top-1 left-1 bg-black text-white text-[9px] font-bold px-1 rounded">
                        -{item.product.discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      {/* Department / Category Tag */}
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 truncate">
                          {item.product.subcategory || item.product.category}
                        </span>
                        
                        {/* Remove item button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-black p-1 transition-colors cursor-pointer rounded-full hover:bg-neutral-100"
                          title="Remove item"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Product Title */}
                      <h4 
                        onClick={() => openQuickView(item.product)}
                        className="font-sans font-bold text-xs sm:text-sm text-neutral-900 leading-snug line-clamp-1 hover:underline cursor-pointer"
                      >
                        {item.product.name}
                      </h4>

                      {/* SKU & Bengali Name */}
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        SKU: {item.product.sku}
                      </p>

                      {/* Variant Specs: Size & Color */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-neutral-600">
                        <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-semibold text-neutral-800">
                          Size: {item.selectedSize}
                        </span>
                        
                        <span className="inline-flex items-center bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 text-neutral-700">
                          <span 
                            className="w-2 h-2 rounded-full mr-1.5 border border-neutral-400 flex-shrink-0"
                            style={{ 
                              backgroundColor: item.product.colors.find(c => c.name === item.selectedColor)?.hex || '#000000' 
                            }} 
                          />
                          {item.selectedColor}
                        </span>
                      </div>
                    </div>

                    {/* Price & Quantity Stepper */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
                      
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-300 rounded-md bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors cursor-pointer disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-neutral-900 min-w-6 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Price Display */}
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-extrabold text-neutral-900">
                          Tk {(item.product.price * item.quantity).toLocaleString()}
                        </div>
                        {isDiscounted && (
                          <span className="text-[10px] text-neutral-400 line-through">
                            Tk {(item.product.originalPrice * item.quantity).toLocaleString()}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              );
            })
          )}

          {/* Add-on Accordions (Only when cart has items) */}
          {cart.length > 0 && (
            <div className="pt-4 space-y-3">
              
              {/* Order Special Instructions / Note Toggle */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
                <button
                  type="button"
                  onClick={() => setIsNoteOpen(!isNoteOpen)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-100/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Order Special Instructions / Delivery Note</span>
                    {orderNote.trim() && (
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    )}
                  </div>
                  {isNoteOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isNoteOpen && (
                  <div className="p-3 bg-white border-t border-neutral-200">
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Add special delivery instructions (e.g. Call 30 mins before delivery, deliver after 2 PM, leave with apartment guard)..."
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-black resize-none h-20"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Your note will be printed on the courier consignment label.
                    </p>
                  </div>
                )}
              </div>

              {/* Coupon / Discount Code Accordion */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
                <button
                  type="button"
                  onClick={() => setIsCouponOpen(!isCouponOpen)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-100/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Tag className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Apply Discount / Promo Code</span>
                    {appliedCoupon && (
                      <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full">
                        {appliedCoupon.code}
                      </span>
                    )}
                  </div>
                  {isCouponOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isCouponOpen && (
                  <div className="p-3 bg-white border-t border-neutral-200 space-y-2">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 p-2.5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-black" />
                          <div>
                            <span className="font-bold text-xs text-neutral-900 block font-mono">
                              {appliedCoupon.code}
                            </span>
                            <span className="text-[11px] text-neutral-500">
                              {appliedCoupon.label} (-Tk {discountAmount.toLocaleString()})
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-xs text-neutral-500 hover:text-red-600 font-semibold cursor-pointer underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Enter code (e.g. BLUCHEEZ10)"
                            className="flex-1 uppercase font-mono text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                          />
                          <button
                            type="submit"
                            className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
                          >
                            Apply
                          </button>
                        </div>

                        {couponError && (
                          <p className="text-[11px] text-red-600 font-medium">
                            {couponError}
                          </p>
                        )}

                        {/* Available coupons hints */}
                        <div className="pt-1 flex flex-wrap gap-1 text-[10px] text-neutral-500">
                          <span>Try:</span>
                          <button 
                            type="button" 
                            onClick={() => applyCoupon('BLUCHEEZ10')}
                            className="font-mono font-bold bg-neutral-100 hover:bg-neutral-200 px-1.5 py-0.5 rounded cursor-pointer text-neutral-700"
                          >
                            BLUCHEEZ10 (10% Off)
                          </button>
                          <button 
                            type="button" 
                            onClick={() => applyCoupon('EID2026')}
                            className="font-mono font-bold bg-neutral-100 hover:bg-neutral-200 px-1.5 py-0.5 rounded cursor-pointer text-neutral-700"
                          >
                            EID2026 (Tk 300 Off)
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Luxury Gift Packaging Add-on */}
              <label className="border border-neutral-200 rounded-xl p-3 bg-neutral-50/50 flex items-start space-x-3 cursor-pointer hover:bg-neutral-100/50 transition-colors">
                <input
                  type="checkbox"
                  checked={isGiftPackaging}
                  onChange={(e) => setIsGiftPackaging(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-black focus:ring-black border-neutral-300 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900 flex items-center">
                      <Gift className="w-3.5 h-3.5 mr-1 text-black" />
                      Add Luxury Blucheez Gift Packaging
                    </span>
                    <span className="font-bold text-neutral-900">+Tk 150</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Premium magnetic atelier box, satin monogram ribbon, and handwritten greeting card.
                  </p>
                </div>
              </label>

            </div>
          )}
        </div>

        {/* Bottom Checkout & Total Section */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 space-y-3">
            
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Bag Subtotal:</span>
                <span className="font-bold text-neutral-900">Tk {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-neutral-900 font-semibold">
                  <span className="flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    Coupon Discount ({appliedCoupon?.code}):
                  </span>
                  <span>-Tk {discountAmount.toLocaleString()}</span>
                </div>
              )}

              {isGiftPackaging && (
                <div className="flex justify-between text-neutral-600">
                  <span>Gift Packaging Box:</span>
                  <span className="font-semibold text-neutral-900">+Tk 150</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span className="flex items-center">
                  <Truck className="w-3 h-3 mr-1" />
                  Nationwide Delivery:
                </span>
                <span className="font-bold">
                  {isFreeShipping ? (
                    <span className="text-black font-extrabold uppercase tracking-wide">
                      FREE (Qualified)
                    </span>
                  ) : (
                    <span className="text-neutral-900">
                      Tk 60 (Inside Dhaka) / Tk 120 (Outside)
                    </span>
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                <div>
                  <span className="font-sans uppercase tracking-wider font-extrabold text-xs text-neutral-900 block">
                    Estimated Total:
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Taxes included. Cash on Delivery nationwide.
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-neutral-900 font-sans">
                    Tk {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Button: Cash on Delivery Checkout */}
            <button
              id="cart-checkout-cod-btn"
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer active:scale-98 tracking-wider uppercase text-xs sm:text-sm"
            >
              <span>Cash on Delivery Checkout (ক্যাশ অন ডেলিভারি)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Action: Continue Shopping */}
            <button
              type="button"
              onClick={closeCart}
              className="w-full bg-white hover:bg-neutral-100 text-neutral-800 font-semibold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer border border-neutral-200"
            >
              Continue Shopping
            </button>

            {/* Assurances Pill Badges */}
            <div className="pt-1 flex items-center justify-center space-x-4 text-[11px] text-neutral-500">
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>100% COD Available</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <RefreshCw className="w-3 h-3 text-black" />
                <span>7-Day Easy Exchange</span>
              </div>
            </div>

          </div>
        )}

      </div>
      
    </div>
  );
};
