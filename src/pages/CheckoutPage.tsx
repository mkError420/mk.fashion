import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  Phone, 
  User, 
  ArrowRight, 
  AlertCircle, 
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Trash2,
  Tag,
  Package,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useFrontendData } from '../context/FrontendDataContext';
import { BD_DISTRICTS, getThanasForDistrict } from '../data/bangladeshDistricts';
import { CourierPartner } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { deliveryFees } = useFrontendData();
  const { 
    cart, 
    products,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    orderNote, 
    appliedCoupon, 
    applyCoupon,
    removeCoupon,
    isGiftPackaging, 
    setIsGiftPackaging,
    confirmOrder,
    addToast 
  } = useShop();

  // Handle direct product payload if passed through state or URL params
  useEffect(() => {
    const state = location.state as { directProduct?: any; selectedSize?: string; selectedColor?: string; quantity?: number } | null;
    if (state?.directProduct && cart.length === 0) {
      addToCart(
        state.directProduct, 
        state.selectedSize || state.directProduct.sizes[0] || 'Standard', 
        state.selectedColor || state.directProduct.colors[0]?.name || 'Standard', 
        state.quantity || 1, 
        false
      );
    }
  }, [location.state, cart.length, addToCart]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka (ঢাকা)');
  const [thana, setThana] = useState('');
  const [customThana, setCustomThana] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState(orderNote || '');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [selectedCourier, setSelectedCourier] = useState<CourierPartner>('Steadfast Courier');
  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Thana list dynamically resolved for current district
  const availableThanas = getThanasForDistrict(district);

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    setThana('');
    setCustomThana('');
    if (formErrors.thana) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.thana;
        return next;
      });
    }
  };

  // Delivery zone & calculations
  const isDhaka = district.toLowerCase().includes('dhaka');
  const deliveryZone = isDhaka ? 'Inside Dhaka' : 'Outside Dhaka';
  const freeShippingMin = deliveryFees.freeShippingMinimum || 3000;
  const isFreeDelivery = subtotal >= freeShippingMin;
  
  let baseDeliveryFee = isDhaka ? (deliveryFees.insideDhaka || 60) : (deliveryFees.outsideDhaka || 120);
  if (deliverySpeed === 'express' && isDhaka) {
    baseDeliveryFee = 100; // Same Day / 24h Express
  }
  const deliveryFee = isFreeDelivery && deliverySpeed === 'standard' ? 0 : baseDeliveryFee;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const giftFee = isGiftPackaging ? 150 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + giftFee);

  const handleApplyCoupon = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponInput('');
    }
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required (নাম প্রদান করুন)';
    }

    // Bangladesh mobile number regex: starts with 01 and has 11 digits
    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errors.phone = 'Mobile phone number is required (মোবাইল নম্বর প্রদান করুন)';
    } else if (!bdPhoneRegex.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX)';
    }

    if (!address.trim() || address.trim().length < 8) {
      errors.address = 'Detailed delivery address is required (বিস্তারিত ঠিকানা প্রদান করুন)';
    }

    if (!thana.trim() && !customThana.trim()) {
      errors.thana = 'Please select your Thana / Upazila (থানা বা উপজেলা নির্বাচন করুন)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      addToast('Shopping Bag Empty', 'Please select at least one product before checking out.', 'warning');
      return;
    }

    if (!validate()) {
      addToast('Incomplete Information', 'Please fill in the required delivery fields.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const effectiveThana = thana === 'Other / অন্যান্য' ? customThana.trim() : thana.trim();
    const fullDeliveryAddress = effectiveThana
      ? `${address.trim()}, Thana: ${effectiveThana}, ${district}`
      : `${address.trim()}, ${district}`;

    setTimeout(async () => {
      try {
        const order = await confirmOrder(
          {
            fullName: fullName.trim(),
            phone: phone.trim(),
            alternatePhone: altPhone.trim() || undefined,
            email: email.trim() || undefined,
            district,
            thana: effectiveThana || undefined,
            address: fullDeliveryAddress,
            notes: notes.trim() || undefined
          },
          deliveryZone as any,
          cart
        );

        setIsSubmitting(false);
        addToast('Order Placed Successfully!', `Order ${order.orderId} is confirmed for Cash on Delivery.`, 'success');
        navigate(`/order-success/${order.orderId}`);
      } catch {
        setIsSubmitting(false);
        addToast('Error Placing Order', 'Could not process your order. Please try again.', 'warning');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-20">
      
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-3">
          <nav className="flex items-center space-x-2 text-xs text-neutral-500">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link to="/cart" className="hover:text-black transition-colors">Shopping Bag</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-900 font-bold">Cash on Delivery Checkout (ক্যাশ অন ডেলিভারি)</span>
          </nav>
        </div>
      </div>

      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-8 sm:py-12">
        
        {/* Page Heading & Trust Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-black text-white">
                100% Cash on Delivery
              </span>
              <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-200 px-2.5 py-0.5 rounded">
                Zero Advance Payment (কোনো অগ্রিম লাগবে না)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
              Cash on Delivery Checkout (অর্ডার সম্পন্ন করুন)
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Please enter your delivery details below. You will pay in cash to the delivery rider upon inspecting the package.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs text-neutral-600 bg-white border border-neutral-200 px-4 py-2.5 rounded-xl shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-neutral-900 flex-shrink-0" />
            <span>Open Parcel & Check before final payment</span>
          </div>
        </div>

        {/* Empty Bag Safeguard: Quick Product Selection without leaving page */}
        {cart.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-neutral-400" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-neutral-900">
                Select an Item for Direct Cash on Delivery
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Your bag is currently empty. Pick any bestselling Blucheez item below to proceed with 1-click Cash on Delivery order:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {products.slice(0, 4).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => addToCart(p, p.sizes[0] || 'Standard', p.colors[0]?.name || 'Standard', 1, false)}
                  className="p-3 border border-neutral-200 rounded-xl hover:border-black transition-all cursor-pointer flex items-center space-x-3 group bg-neutral-50 hover:bg-white"
                >
                  <img src={p.images[0]} alt={p.name} className="w-14 h-16 rounded-lg object-cover bg-neutral-200 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 truncate group-hover:text-black">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-semibold">
                      ৳{p.price.toLocaleString()}
                    </p>
                    <span className="text-[10px] font-bold text-black underline mt-1 inline-block">
                      + Add & Order COD
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/collections/all"
              className="inline-block bg-black text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Browse All Collections
            </Link>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* LEFT: Customer, Delivery, & Logistics Form (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Customer Contact Info */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-neutral-100 pb-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                    Customer Information (গ্রাহকের তথ্য)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      Full Name (আপনার সম্পূর্ণ নাম) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Asif Chowdhury / আরিফ চৌধুরী"
                        className={`w-full text-xs sm:text-sm p-3 pl-10 border rounded-xl focus:outline-none focus:border-black ${
                          formErrors.fullName ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                        }`}
                      />
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    </div>
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Primary Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      Mobile Number (মোবাইল নম্বর) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className={`w-full text-xs sm:text-sm p-3 pl-10 border rounded-xl font-mono focus:outline-none focus:border-black ${
                          formErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                        }`}
                      />
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        {formErrors.phone}
                      </p>
                    )}
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Courier tracking SMS and call will be sent to this number.
                    </p>
                  </div>

                  {/* Alternate Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      Alternate Mobile (বিকল্প নম্বর) <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value)}
                        placeholder="018XXXXXXXX"
                        className="w-full text-xs sm:text-sm p-3 pl-10 border border-neutral-300 rounded-xl font-mono focus:outline-none focus:border-black"
                      />
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      Email Address (ইমেইল এড্রেস) <span className="text-neutral-400 font-normal">(Optional for digital invoice copy)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="asif@example.com"
                      className="w-full text-xs sm:text-sm p-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Destination & Address */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-neutral-100 pb-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                    Delivery Address in Bangladesh (ডেলিভারি ঠিকানা)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* District Selector */}
                  {/* District Selector */}
                  <div>
                    <label htmlFor="checkout-district-select" className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      District (জেলা নির্বাচন করুন) <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="checkout-district-select"
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:border-black cursor-pointer font-medium"
                    >
                      <option value="Dhaka (ঢাকা)">Dhaka (ঢাকা - Inside Dhaka: ৳60 / Free 3k+)</option>
                      {BD_DISTRICTS.filter((d: string) => !d.toLowerCase().includes('dhaka')).map((dist: string) => (
                        <option key={dist} value={dist}>
                          {dist} (Outside Dhaka: ৳120 / Free 3k+)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Thana / Upazila Selector (dynamically loaded for selected district) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="checkout-thana-select" className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                        Thana / Upazila (থানা / উপজেলা) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-neutral-500 font-semibold bg-neutral-100 px-2 py-0.5 rounded-full">
                        {availableThanas.length} Thanas available
                      </span>
                    </div>
                    <select
                      id="checkout-thana-select"
                      value={thana}
                      onChange={(e) => {
                        setThana(e.target.value);
                        if (formErrors.thana) {
                          setFormErrors(prev => {
                            const next = { ...prev };
                            delete next.thana;
                            return next;
                          });
                        }
                      }}
                      className={`w-full text-xs sm:text-sm p-3 border rounded-xl bg-white focus:outline-none focus:border-black cursor-pointer font-medium ${
                        formErrors.thana ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                      }`}
                    >
                      <option value="">-- Select Thana / Upazila ({availableThanas.length} options) --</option>
                      {availableThanas.map((th) => (
                        <option key={th} value={th}>
                          {th}
                        </option>
                      ))}
                      <option value="Other / অন্যান্য">Other / অন্যান্য (Type manually)</option>
                    </select>
                    {formErrors.thana && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        {formErrors.thana}
                      </p>
                    )}
                  </div>

                  {/* Custom Thana input if "Other" is picked */}
                  {thana === 'Other / অন্যান্য' && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                        Enter Custom Thana / Area Name (থানা বা এলাকার নাম লিখুন) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customThana}
                        onChange={(e) => setCustomThana(e.target.value)}
                        placeholder="Enter your Thana / Police Station / Upazila name"
                        className="w-full text-xs sm:text-sm p-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                      />
                    </div>
                  )}

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      Detailed Delivery Address (সম্পূর্ণ ঠিকানা) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House / Flat No, Road No, Sector / Village, Area Landmark (e.g. House 24, Road 11, Block D, Banani, Dhaka)"
                      className={`w-full text-xs sm:text-sm p-3 border rounded-xl focus:outline-none focus:border-black ${
                        formErrors.address ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  {/* Delivery Speed / Priority */}
                  <div className="sm:col-span-2 pt-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
                      Delivery Speed Option
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div 
                        onClick={() => setDeliverySpeed('standard')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                          deliverySpeed === 'standard' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${deliverySpeed === 'standard' ? 'border-black bg-black text-white' : 'border-neutral-300'}`}>
                          {deliverySpeed === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex justify-between font-bold text-neutral-900">
                            <span>Standard Nationwide</span>
                            <span>{isFreeDelivery ? 'FREE' : isDhaka ? '৳60' : '৳120'}</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {isDhaka ? '24–48 Hours (Inside Dhaka)' : '48–72 Hours (Outside Dhaka)'}
                          </p>
                        </div>
                      </div>

                      {isDhaka && (
                        <div 
                          onClick={() => setDeliverySpeed('express')}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                            deliverySpeed === 'express' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${deliverySpeed === 'express' ? 'border-black bg-black text-white' : 'border-neutral-300'}`}>
                            {deliverySpeed === 'express' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="flex-1 text-xs">
                            <div className="flex justify-between font-bold text-neutral-900">
                              <span className="flex items-center">
                                <Sparkles className="w-3 h-3 mr-1 text-neutral-900" />
                                Dhaka Same-Day Express
                              </span>
                              <span>৳100</span>
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              Guaranteed 12–24h door dispatch
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Note */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                      Delivery Instructions (বিশেষ নির্দেশনা)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Call before delivery, deliver after 2 PM, leave at building security..."
                      className="w-full text-xs p-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Courier Partner Selection */}
                  <div className="sm:col-span-2 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
                      Preferred Courier Service Partner
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['Steadfast Courier', 'Pathao Logistics', 'RedX Delivery', 'Paperfly'] as CourierPartner[]).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedCourier(c)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            selectedCourier === c
                              ? 'border-black bg-neutral-900 text-white shadow-xs'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Step 3: Payment Method (Cash on Delivery) */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-neutral-100 pb-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    3
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                    Payment Method (পেমেন্ট পদ্ধতি)
                  </h3>
                </div>

                <div className="border-2 border-black bg-neutral-50 rounded-xl p-4 flex items-start space-x-3.5">
                  <div className="mt-0.5">
                    <div className="w-4 h-4 rounded-full border-4 border-black bg-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-neutral-900">
                        Cash on Delivery (ক্যাশ অন ডেলিভারি)
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                        100% Guaranteed
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      Pay in cash directly to the courier delivery agent when your parcel arrives at your door. Zero advance payment required.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-neutral-700 font-semibold border-t border-neutral-200/80 pt-2.5">
                      <span className="flex items-center">
                        <Check className="w-3.5 h-3.5 mr-1 text-black" />
                        No Advance Required
                      </span>
                      <span className="flex items-center">
                        <Check className="w-3.5 h-3.5 mr-1 text-black" />
                        Inspect Before Paying
                      </span>
                      <span className="flex items-center">
                        <Check className="w-3.5 h-3.5 mr-1 text-black" />
                        7-Day Easy Exchange
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT: Order Summary, Items Review, & Confirmation Button (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 sticky top-24">
                
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <h3 className="font-sans uppercase tracking-widest font-extrabold text-sm text-neutral-900">
                    Order Summary ({totalItems} Items)
                  </h3>
                  <Link to="/cart" className="text-xs text-neutral-500 hover:text-black underline font-medium">
                    Edit Bag
                  </Link>
                </div>

                {/* Items List with Quantity Controls */}
                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center space-x-3 group">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-18 rounded-lg object-cover object-top bg-neutral-100 border border-neutral-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded font-bold text-neutral-800">
                            Size {item.selectedSize}
                          </span>
                          <span>•</span>
                          <span>{item.selectedColor}</span>
                        </div>
                        
                        {/* Stepper on Checkout */}
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="inline-flex items-center border border-neutral-200 rounded-md bg-white">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-0.5 text-neutral-500 hover:text-black text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-neutral-500 hover:text-black text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-900 block">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          ৳{item.product.price.toLocaleString()} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div className="border-t border-neutral-100 pt-3">
                  {appliedCoupon ? (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-black" />
                        <div>
                          <span className="font-bold text-neutral-900">{appliedCoupon.code}</span>
                          <span className="text-[11px] text-neutral-500 block">
                            {appliedCoupon.discountPercent ? `${appliedCoupon.discountPercent}% Discount Applied` : `৳${appliedCoupon.discountAmount} Discount Applied`}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-neutral-400 hover:text-black text-xs underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyCoupon(e);
                            }
                          }}
                          placeholder="Promo / Coupon Code (e.g. EID10)"
                          className="flex-1 text-xs p-2.5 border border-neutral-300 rounded-xl uppercase font-mono focus:outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <span>Try:</span>
                        <button 
                          type="button" 
                          onClick={() => { setCouponInput('EID10'); applyCoupon('EID10'); }}
                          className="font-mono font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          EID10
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setCouponInput('BLUCHEEZ15'); applyCoupon('BLUCHEEZ15'); }}
                          className="font-mono font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          BLUCHEEZ15
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gift Box Addon Option */}
                <div 
                  onClick={() => setIsGiftPackaging(!isGiftPackaging)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    isGiftPackaging ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Package className="w-4 h-4 text-neutral-800 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-neutral-900 block">Premium Gift Packaging</span>
                      <span className="text-[11px] text-neutral-500">Luxury branded rigid box with custom card (+৳150)</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isGiftPackaging}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-black accent-black cursor-pointer"
                  />
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-2.5 text-xs border-t border-neutral-200 pt-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({totalItems} items):</span>
                    <span className="font-bold text-neutral-900">৳{subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-neutral-900 font-semibold">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {isGiftPackaging && (
                    <div className="flex justify-between text-neutral-600">
                      <span>Luxury Gift Packaging:</span>
                      <span className="font-semibold text-neutral-900">+৳150</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span className="flex items-center">
                      <Truck className="w-3.5 h-3.5 mr-1" />
                      Delivery ({deliveryZone}):
                    </span>
                    <span className="font-bold">
                      {isFreeDelivery && deliverySpeed === 'standard' ? (
                        <span className="text-black font-extrabold uppercase">FREE</span>
                      ) : (
                        `৳${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                    <div>
                      <span className="font-sans uppercase font-extrabold text-sm text-neutral-900 block">
                        Total Payable at Doorstep:
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        (ক্যাশ অন ডেলিভারিতে প্রদেয় মোট)
                      </span>
                    </div>
                    <span className="text-2xl font-black text-neutral-900">
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Order Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer tracking-wider uppercase text-xs sm:text-sm active:scale-98"
                >
                  {isSubmitting ? (
                    <span>Processing Your Order...</span>
                  ) : (
                    <>
                      <span>Confirm Order (ক্যাশ অন ডেলিভারি অর্ডার নিশ্চিত করুন)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="space-y-1.5 pt-1 text-center text-[11px] text-neutral-500">
                  <p className="flex items-center justify-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-800" />
                    <span>No advance payment needed. Pay cash upon delivery.</span>
                  </p>
                  <p>7-Day Size & Color Exchange available across Bangladesh.</p>
                </div>

              </div>

            </div>

          </form>
        )}

      </div>

    </div>
  );
};
