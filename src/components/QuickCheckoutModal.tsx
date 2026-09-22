import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Truck, Banknote, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BD_DISTRICTS, getThanasForDistrict } from '../data/bangladeshDistricts';
import { CartItem } from '../types';

export const QuickCheckoutModal: React.FC = () => {
  const { 
    quickCheckoutItem, 
    isCheckoutOpen,
    closeQuickCheckout, 
    placeOrder, 
    isCartOpen, 
    closeCart,
    cart,
    removeFromCart,
    addToast,
    appliedCoupon,
    orderNote,
    isGiftPackaging
  } = useShop();

  const isDirectItemOrder = !!quickCheckoutItem;
  
  // Prepare items for this checkout
  const itemsToProcess: CartItem[] = isDirectItemOrder
    ? [
        {
          id: `direct-${quickCheckoutItem.product.id}`,
          product: quickCheckoutItem.product,
          selectedSize: quickCheckoutItem.size,
          selectedColor: quickCheckoutItem.color,
          quantity: quickCheckoutItem.quantity
        }
      ]
    : cart;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka (ঢাকা)');
  const [thana, setThana] = useState('');
  const [customThana, setCustomThana] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState(orderNote || '');
  const [selectedSize, setSelectedSize] = useState(
    isDirectItemOrder ? quickCheckoutItem.size : ''
  );
  const [quantity, setQuantity] = useState(
    isDirectItemOrder ? quickCheckoutItem.quantity : 1
  );
  const [errorMsg, setErrorMsg] = useState('');

  const availableThanas = getThanasForDistrict(district);

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    setThana('');
    setCustomThana('');
  };

  useEffect(() => {
    if (quickCheckoutItem) {
      setSelectedSize(quickCheckoutItem.size);
      setQuantity(quickCheckoutItem.quantity);
      setErrorMsg('');
    }
  }, [quickCheckoutItem]);

  useEffect(() => {
    if (orderNote && !notes) {
      setNotes(orderNote);
    }
  }, [orderNote, notes]);

  // Handle ESC key to dismiss checkout modal
  useEffect(() => {
    if (!isCheckoutOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQuickCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, closeQuickCheckout]);

  if (!isCheckoutOpen) {
    return null;
  }

  const handleRemoveItem = (itemId: string, productName: string) => {
    if (isDirectItemOrder) {
      closeQuickCheckout();
      addToast('Item Removed', `${productName} removed from checkout.`, 'info');
    } else {
      removeFromCart(itemId);
      if (cart.length <= 1) {
        closeQuickCheckout();
        addToast('Checkout Closed', 'All items removed from your order summary.', 'info');
      } else {
        addToast('Item Removed', `${productName} removed from order summary.`, 'info');
      }
    }
  };

  if (itemsToProcess.length === 0) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
        onClick={closeQuickCheckout}
      >
        <div 
          className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-neutral-200 relative my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeQuickCheckout}
            className="absolute top-4 right-4 p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
            <X className="w-6 h-6 text-neutral-500" />
          </div>
          <h3 className="font-serif font-bold text-lg text-neutral-900 mb-1">Your Order is Empty</h3>
          <p className="text-xs text-neutral-500 mb-5">There are no products in your checkout summary.</p>
          <button
            type="button"
            onClick={closeQuickCheckout}
            className="w-full bg-black text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const isDhaka = district.toLowerCase().includes('dhaka');
  const deliveryZone = isDhaka ? 'Inside Dhaka' : 'Outside Dhaka';

  const subtotal = itemsToProcess.reduce((acc, item) => {
    const qty = isDirectItemOrder ? quantity : item.quantity;
    return acc + (item.product.price * qty);
  }, 0);

  // Blucheez Free Delivery for orders >= 3,000 Tk
  const isFreeDelivery = subtotal >= 3000;
  const standardFee = isDhaka ? 60 : 120;
  const deliveryFee = isFreeDelivery ? 0 : standardFee;

  let discountAmount = 0;
  if (appliedCoupon && !isDirectItemOrder) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const giftFee = (!isDirectItemOrder && isGiftPackaging) ? 150 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + giftFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name (আপনার নাম লিখুন)');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setErrorMsg('Please enter a valid 11-digit mobile number (e.g., 01711223344)');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMsg('Please enter your detailed delivery address (বিস্তারিত ঠিকানা লিখুন)');
      return;
    }

    if (!thana.trim() && !customThana.trim()) {
      setErrorMsg('Please select your Thana / Upazila (থানা বা উপজেলা নির্বাচন করুন)');
      return;
    }

    const updatedItems = itemsToProcess.map(item => 
      isDirectItemOrder 
        ? { ...item, selectedSize, quantity } 
        : item
    );

    const effectiveThana = thana === 'Other / অন্যান্য' ? customThana.trim() : thana.trim();
    const fullDeliveryAddress = effectiveThana
      ? `${address.trim()}, Thana: ${effectiveThana}`
      : address.trim();

    // Trigger order placement with Cash on Delivery
    placeOrder(
      {
        fullName: fullName.trim(),
        phone: phone.trim(),
        district,
        thana: effectiveThana || undefined,
        address: fullDeliveryAddress,
        notes: notes.trim()
      },
      deliveryZone,
      updatedItems
    );

    closeQuickCheckout();
    if (isCartOpen) closeCart();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={closeQuickCheckout}
    >
      <div 
        className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-black text-white px-5 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center space-x-2">
              <Banknote className="w-5 h-5 text-white" />
              <h3 className="font-serif font-bold text-base sm:text-lg">
                Cash on Delivery (ক্যাশ অন ডেলিভারি)
              </h3>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              Pay in cash to the courier agent when your parcel arrives at your doorstep
            </p>
          </div>

          <button
            id="quick-checkout-close-btn"
            type="button"
            onClick={closeQuickCheckout}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Close Checkout"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Item Summary Card */}
        <div className="p-5 bg-neutral-50 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Item Summary ({itemsToProcess.length} {itemsToProcess.length === 1 ? 'Product' : 'Products'})
            </p>
            <span className="text-[11px] text-neutral-400">
              Click <X className="w-3 h-3 inline pb-0.5 text-neutral-500" /> to remove an item
            </span>
          </div>

          <div className="space-y-3">
            {itemsToProcess.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-neutral-200 relative group">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-20 object-cover rounded-lg border border-neutral-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-medium text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">
                        {item.product.bengaliName}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-neutral-900 truncate mt-0.5">
                        {item.product.name}
                      </h4>
                    </div>

                    {/* Item Remove Cross Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id, item.product.name)}
                      className="text-neutral-400 hover:text-black p-1 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer flex-shrink-0"
                      title="Remove this item from order"
                      aria-label={`Remove ${item.product.name} from checkout`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {isDirectItemOrder ? (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center space-x-1">
                        <label htmlFor="quick-checkout-size-select" className="text-xs text-neutral-600 font-medium">Size:</label>
                        <select
                          id="quick-checkout-size-select"
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="text-xs bg-neutral-100 border border-neutral-300 rounded px-2 py-1 font-semibold"
                        >
                          {item.product.sizes.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center space-x-1">
                        <label htmlFor="quick-checkout-qty-select" className="text-xs text-neutral-600 font-medium">Qty:</label>
                        <select
                          id="quick-checkout-qty-select"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="text-xs bg-neutral-100 border border-neutral-300 rounded px-2 py-1 font-semibold"
                        >
                          {[1, 2, 3, 4, 5].map(q => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-600">
                      <span>Size: <strong>{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>Qty: <strong>{item.quantity}</strong></span>
                    </div>
                  )}

                  <p className="text-sm font-bold text-neutral-900 mt-1">
                    ৳{((isDirectItemOrder ? quantity : item.quantity) * item.product.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Shipping & Contact Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label htmlFor="customer-name-input" className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
              Your Full Name (আপনার নাম) *
            </label>
            <input
              id="customer-name-input"
              type="text"
              required
              placeholder="e.g. Tanvir Hossain"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customer-phone-input" className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Mobile Number (মোবাইল নম্বর) *
              </label>
              <input
                id="customer-phone-input"
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">Used for delivery rider call & SMS updates</span>
            </div>

            <div>
              <label htmlFor="customer-district-select" className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                District / City (জেলা) *
              </label>
              <select
                id="customer-district-select"
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
              >
                {BD_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <span className="text-[10px] font-medium text-neutral-600 mt-0.5 block">
                {isDhaka ? 'Inside Dhaka: ৳60 delivery' : 'Outside Dhaka: ৳120 courier delivery'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="customer-thana-select" className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Thana / Upazila (থানা) *
                </label>
                <span className="text-[10px] text-neutral-500 font-semibold bg-neutral-200/70 px-2 py-0.5 rounded-full">
                  {availableThanas.length} Thanas
                </span>
              </div>
              <select
                id="customer-thana-select"
                value={thana}
                onChange={(e) => setThana(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
              >
                <option value="">-- Select Thana / Upazila ({availableThanas.length} options) --</option>
                {availableThanas.map((th) => (
                  <option key={th} value={th}>{th}</option>
                ))}
                <option value="Other / অন্যান্য">Other / অন্যান্য (Type manually)</option>
              </select>
            </div>
          </div>

          {/* Custom Thana input if Other chosen */}
          {thana === 'Other / অন্যান্য' && (
            <div>
              <label htmlFor="customer-custom-thana-input" className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                Specify Thana / Area Name (থানা বা এলাকার নাম লিখুন) *
              </label>
              <input
                id="customer-custom-thana-input"
                type="text"
                required
                value={customThana}
                onChange={(e) => setCustomThana(e.target.value)}
                placeholder="Enter your Thana or Upazila"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          )}

          <div>
            <label htmlFor="customer-address-input" className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
              Full Delivery Address (বিস্তারিত ঠিকানা) *
            </label>
            <textarea
              id="customer-address-input"
              rows={2}
              required
              placeholder="House, Road, Area, Thana / Post Office..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="customer-notes-input" className="block text-xs font-semibold text-neutral-600 mb-1">
              Special Delivery Note (Optional)
            </label>
            <input
              id="customer-notes-input"
              type="text"
              placeholder="e.g. Deliver after 3 PM, call when near..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>

          {/* Payment breakdown */}
          <div className="bg-neutral-100 p-4 rounded-xl space-y-2 border border-neutral-200">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-neutral-900">৳{subtotal.toLocaleString()}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-black font-semibold">
                <span>Promo Discount ({appliedCoupon?.code}):</span>
                <span>-৳{discountAmount.toLocaleString()}</span>
              </div>
            )}

            {giftFee > 0 && (
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Blucheez Gift Packaging:</span>
                <span className="font-semibold text-neutral-900">+৳150</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-neutral-600">
              <span className="flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1 text-black" />
                Courier Delivery ({deliveryZone}):
              </span>
              <span className="font-semibold text-neutral-900">
                {isFreeDelivery ? (
                  <span className="text-black font-bold uppercase tracking-wide">
                    FREE (Qualified)
                  </span>
                ) : (
                  `৳${deliveryFee}`
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-neutral-900">
                Total Cash to Pay on Delivery:
              </span>
              <span className="text-xl font-bold text-neutral-900">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Third-Party Courier Integration Note */}
          <div className="flex items-center space-x-2 text-[11px] text-neutral-600 bg-neutral-100 p-2.5 rounded-lg border border-neutral-200">
            <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />
            <span>
              Dispatched via <strong>Steadfast Courier</strong> or <strong>Pathao Logistics</strong> with live SMS & tracking ID.
            </span>
          </div>

          {/* Submit Button */}
          <button
            id="confirm-cod-order-button"
            type="submit"
            className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-sm sm:text-base">
              Confirm Order (ক্যাশ অন ডেলিভারি অর্ডার কনফার্ম করুন)
            </span>
          </button>
        </form>

      </div>
    </div>
  );
};
