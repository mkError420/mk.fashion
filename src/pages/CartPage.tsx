import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Tag, 
  Gift, 
  Check, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    orderNote, 
    setOrderNote, 
    isGiftPackaging, 
    setIsGiftPackaging 
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Free delivery threshold: 3,000 BDT
  const freeThreshold = 3000;
  const isFreeDelivery = subtotal >= freeThreshold;
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const shippingPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  // Discounts
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const giftFee = isGiftPackaging ? 150 : 0;
  const estimatedShipping = isFreeDelivery ? 0 : 60;
  const grandTotal = Math.max(0, subtotal - discountAmount + giftFee + (cart.length > 0 ? estimatedShipping : 0));

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
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Breadcrumb */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-4 border-b border-neutral-100">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">Shopping Bag</span>
        </nav>
      </div>

      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-8">
        
        <div className="flex items-baseline justify-between mb-8 border-b border-neutral-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
            Your Shopping Bag
          </h1>
          <span className="text-xs sm:text-sm text-neutral-500 font-medium">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'} selected
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-200 max-w-2xl mx-auto p-8">
            <div className="w-20 h-20 rounded-full bg-neutral-200/60 flex items-center justify-center mx-auto mb-4 text-neutral-500">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-serif font-bold text-neutral-900 mb-2">Your shopping bag is empty</h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-6">
              Looks like you haven't added any garments to your bag yet. Explore our Eid Panjabis, Blucheez Black society collection, or summer knitwear.
            </p>
            <Link
              to="/collections/all"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-8 py-3.5 rounded-full uppercase tracking-wider transition-all inline-flex items-center space-x-2"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT: Items List (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Delivery Bar */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  {isFreeDelivery ? (
                    <span className="text-black font-extrabold flex items-center">
                      <Sparkles className="w-4 h-4 mr-1.5 text-black" />
                      Congratulations! You unlocked FREE Nationwide Delivery!
                    </span>
                  ) : (
                    <span className="text-neutral-700">
                      Add <strong className="text-black font-bold">৳{remainingForFree.toLocaleString()}</strong> more to enjoy <strong className="text-black font-extrabold">FREE Nationwide Shipping</strong>
                    </span>
                  )}
                  <span className="font-bold text-neutral-500">{shippingPercent}%</span>
                </div>

                <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black rounded-full transition-all duration-500" 
                    style={{ width: `${shippingPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                    
                    {/* Image & Title */}
                    <div className="flex items-center space-x-4">
                      <Link 
                        to={`/product/${item.product.id}`}
                        className="w-20 h-26 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </Link>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {item.product.subcategory || item.product.category}
                        </span>
                        
                        <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                          <Link to={`/product/${item.product.id}`} className="hover:underline">
                            {item.product.name}
                          </Link>
                        </h3>

                        <div className="flex items-center space-x-2 text-xs text-neutral-600">
                          <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-semibold text-neutral-800">
                            Size: {item.selectedSize}
                          </span>
                          <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                            {item.selectedColor}
                          </span>
                        </div>

                        <p className="text-[10px] text-neutral-400 font-mono">
                          SKU: {item.product.sku}
                        </p>
                      </div>
                    </div>

                    {/* Stepper, Price & Remove */}
                    <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                      
                      {/* Stepper */}
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-neutral-900 min-w-8 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-24">
                        <div className="text-sm sm:text-base font-black text-neutral-900">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                        {item.product.originalPrice > item.product.price && (
                          <div className="text-[10px] text-neutral-400 line-through">
                            ৳{(item.product.originalPrice * item.quantity).toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-black p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                ))}
              </div>

              {/* Special Instructions & Note */}
              <div className="border border-neutral-200 rounded-2xl p-5 bg-neutral-50/60">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Special Delivery Instructions / Note</span>
                </div>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Give any specific instructions for the delivery rider (e.g., call 30 mins before arrival, deliver after 2 PM, apartment guard instructions)..."
                  className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-black bg-white resize-none h-20"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Note is forwarded directly onto the courier consignment label.
                </p>
              </div>

            </div>

            {/* RIGHT: Order Summary & Checkout (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order Summary Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 space-y-5">
                <h3 className="font-sans uppercase tracking-widest font-extrabold text-sm text-neutral-900 border-b border-neutral-200 pb-3">
                  Order Summary
                </h3>

                {/* Promo Code Form */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Have a Promo Code?
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-white border border-neutral-300 p-2.5 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-black" />
                        <div>
                          <span className="font-mono font-bold text-xs text-neutral-900 block">{appliedCoupon.code}</span>
                          <span className="text-[11px] text-neutral-500">{appliedCoupon.label}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-neutral-500 hover:text-black font-semibold underline cursor-pointer"
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
                          placeholder="Code (e.g. BLUCHEEZ10)"
                          className="flex-1 uppercase font-mono text-xs px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                        />
                        <button
                          type="submit"
                          className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
                    </form>
                  )}
                </div>

                {/* Gift packaging option */}
                <label className="border border-neutral-200 rounded-xl p-3 bg-white flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftPackaging}
                    onChange={(e) => setIsGiftPackaging(e.target.checked)}
                    className="mt-0.5 rounded text-black focus:ring-black cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between font-bold text-neutral-900">
                      <span className="flex items-center">
                        <Gift className="w-3.5 h-3.5 mr-1" />
                        Luxury Gift Atelier Packaging
                      </span>
                      <span>+৳150</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Magnetic gift box, satin monogram ribbon & greeting card.
                    </p>
                  </div>
                </label>

                {/* Financial calculations */}
                <div className="space-y-2 text-xs border-t border-neutral-200 pt-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Bag Subtotal:</span>
                    <span className="font-bold text-neutral-900">৳{subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-neutral-900 font-semibold">
                      <span>Promo Discount ({appliedCoupon?.code}):</span>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {isGiftPackaging && (
                    <div className="flex justify-between text-neutral-600">
                      <span>Gift Packaging:</span>
                      <span className="font-semibold text-neutral-900">+৳150</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span className="flex items-center">
                      <Truck className="w-3.5 h-3.5 mr-1" />
                      Courier Shipping:
                    </span>
                    <span className="font-bold">
                      {isFreeDelivery ? (
                        <span className="text-black font-extrabold uppercase">FREE</span>
                      ) : (
                        <span>৳60 (Inside Dhaka) / ৳120 (Outside)</span>
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                    <span className="font-sans uppercase font-extrabold text-sm text-neutral-900">
                      Estimated Total:
                    </span>
                    <span className="text-2xl font-black text-neutral-900">
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action: Checkout */}
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer tracking-wider uppercase text-xs sm:text-sm active:scale-98"
                >
                  <span>Cash on Delivery Checkout (ক্যাশ অন ডেলিভারি)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center space-x-4 text-[11px] text-neutral-500 pt-1">
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-black" />
                    <span>100% COD</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <RefreshCw className="w-3.5 h-3.5 text-black" />
                    <span>7-Day Exchange</span>
                  </div>
                </div>

              </div>

              {/* Continue Shopping button */}
              <Link
                to="/collections/all"
                className="w-full bg-white hover:bg-neutral-100 text-neutral-800 font-semibold py-3 px-4 rounded-xl text-xs transition-colors border border-neutral-200 block text-center uppercase tracking-wider"
              >
                Continue Shopping
              </Link>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
