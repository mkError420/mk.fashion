import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle2, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useFrontendData } from '../context/FrontendDataContext';
import { getActiveExchangeConfig } from '../components/admin/PagesManagement';

export const ExchangePolicyPage: React.FC = () => {
  const { addToast } = useShop();
  const { settings } = useFrontendData();

  const config = useMemo(() => getActiveExchangeConfig(
    Object.fromEntries(
      Object.entries(settings).map(([k, v]) => [k, { value: v, type: 'text', category: 'pages', description: '' }])
    )
  ), [settings]);

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

  const PILLAR_ICONS = [
    <RefreshCw className="w-6 h-6 text-black mb-3" />,
    <ShieldCheck className="w-6 h-6 text-black mb-3" />,
    <Truck className="w-6 h-6 text-black mb-3" />,
  ];

  const pillars = [
    { title: config.pillar1Title, text: config.pillar1Text },
    { title: config.pillar2Title, text: config.pillar2Text },
    { title: config.pillar3Title, text: config.pillar3Text },
  ];

  const terms = [config.term1, config.term2, config.term3].filter(Boolean);

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* Breadcrumb */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-4 border-b border-neutral-100">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">Exchange Policy</span>
        </nav>
      </div>

      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-10">

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          {config.badge && (
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-black text-white inline-block">
              {config.badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-neutral-900">
            {config.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            {config.subtitle}
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {pillars.map((p, i) => (
            <div key={i} className="border border-neutral-200 rounded-2xl p-5 bg-neutral-50 text-xs">
              {PILLAR_ICONS[i]}
              <h3 className="font-bold text-neutral-900 text-sm mb-1">{p.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>

        {/* Terms & Conditions */}
        {terms.length > 0 && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-12 text-xs space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">
              {config.termsTitle}
            </h3>
            <ul className="space-y-2 text-neutral-600 list-disc pl-5">
              {terms.map((term, i) => <li key={i}>{term}</li>)}
            </ul>
          </div>
        )}

        {/* Exchange Request Form */}
        <div className="border border-neutral-200 rounded-3xl p-6 sm:p-8 bg-white shadow-xs">
          <h3 className="text-lg font-bold font-serif text-neutral-900 mb-2">
            {config.formTitle}
          </h3>
          <p className="text-xs text-neutral-500 mb-6">
            {config.formSubtitle}
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
                    onChange={e => setOrderId(e.target.value)}
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
                    onChange={e => setPhone(e.target.value)}
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
                  onChange={e => setReason(e.target.value)}
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
