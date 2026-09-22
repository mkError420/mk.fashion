import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle2, ShieldCheck, Truck, ChevronRight, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ExchangePolicyPage: React.FC = () => {
  const { addToast } = useShop();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('Need a different size (সাইজ পরিবর্তন)');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) return;
    setSubmitted(true);
    addToast('Exchange Request Received', 'Our support team will contact you within 24 hours.', 'success');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Breadcrumb */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-4 border-b border-neutral-100">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">7-Day Exchange Policy</span>
        </nav>
      </div>

      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-10">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-black text-white inline-block">
            Customer Guarantee
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-neutral-900">
            7-Day Hassle-Free Exchange Policy
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            ৭ দিনের মধ্যে সহজ এক্সচেঞ্জ সুবিধা — We guarantee complete peace of mind with every Cash on Delivery purchase.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-neutral-200 rounded-2xl p-5 bg-neutral-50 text-xs">
            <RefreshCw className="w-6 h-6 text-black mb-3" />
            <h3 className="font-bold text-neutral-900 text-sm mb-1">7 Days Window</h3>
            <p className="text-neutral-600 leading-relaxed">
              Initiate an exchange within 7 days from the delivery date for any size or color adjustment.
            </p>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-5 bg-neutral-50 text-xs">
            <ShieldCheck className="w-6 h-6 text-black mb-3" />
            <h3 className="font-bold text-neutral-900 text-sm mb-1">In-Store or Courier</h3>
            <p className="text-neutral-600 leading-relaxed">
              Swap sizes instantly at Banani, Dhanmondi, or Uttara outlets, or request door-to-door courier exchange.
            </p>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-5 bg-neutral-50 text-xs">
            <Truck className="w-6 h-6 text-black mb-3" />
            <h3 className="font-bold text-neutral-900 text-sm mb-1">Zero Hassle Pickup</h3>
            <p className="text-neutral-600 leading-relaxed">
              Our courier rider will deliver the replacement size right to your doorstep and collect the previous one.
            </p>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-12 text-xs space-y-3">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">
            Exchange Terms & Conditions
          </h3>
          <ul className="space-y-2 text-neutral-600 list-disc pl-5">
            <li>The garment must be unworn, unwashed, and with all original Blucheez brand tags attached.</li>
            <li>Original courier invoice or packing slip should be presented or digital order ID provided.</li>
            <li>Products purchased under final clearance or flash sale may only be exchanged for sizing, subject to stock availability.</li>
          </ul>
        </div>

        {/* Instant Online Exchange Request Form */}
        <div className="border border-neutral-200 rounded-3xl p-6 sm:p-8 bg-white shadow-xs">
          <h3 className="text-lg font-bold font-serif text-neutral-900 mb-2">
            Submit an Online Exchange Request
          </h3>
          <p className="text-xs text-neutral-500 mb-6">
            Enter your order details and our concierge will arrange your doorstep exchange within 24 hours.
          </p>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-neutral-900">Request Submitted Successfully!</h4>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                Our customer service team will call you at <strong>{phone}</strong> to confirm your replacement size and coordinate courier pickup.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="bg-black text-white text-xs font-bold px-6 py-2 rounded-xl"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Order ID (e.g. BC-10294) *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="BC-XXXXX"
                    className="w-full p-3 border border-neutral-300 rounded-xl uppercase font-mono focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-3 border border-neutral-300 rounded-xl font-mono focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Reason for Exchange *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:border-black"
                >
                  <option value="Need a different size (সাইজ পরিবর্তন)">Need a different size (সাইজ পরিবর্তন)</option>
                  <option value="Need a different color (রং পরিবর্তন)">Need a different color (রং পরিবর্তন)</option>
                  <option value="Fit adjustment required (ফিটিং পরিবর্তন)">Fit adjustment required (ফিটিং পরিবর্তন)</option>
                  <option value="Defective / Damaged parcel (ত্রুটিপূর্ণ পণ্য)">Defective / Damaged parcel (ত্রুটিপূর্ণ পণ্য)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors cursor-pointer"
              >
                Request Exchange (এক্সচেঞ্জের আবেদন করুন)
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
