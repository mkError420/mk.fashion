import React, { useState, useEffect, useMemo } from 'react';
import { Mail, MessageCircle, Copy, Check, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useFrontendData } from '../context/FrontendDataContext';
import { DEFAULT_VOUCHER_CONFIG, VoucherConfig } from './admin/VoucherManagement';

export const VipClubVoucher: React.FC = () => {
  const { addToast } = useShop();
  const { settings } = useFrontendData();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [updateTick, setUpdateTick] = useState(0);

  // Listen for real-time updates dispatched by Admin Dashboard
  useEffect(() => {
    const handleUpdate = () => setUpdateTick(prev => prev + 1);
    window.addEventListener('voucher-config-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('voucher-config-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute active dynamic configuration
  const activeConfig: VoucherConfig = useMemo(() => {
    // 1. Database settings
    const dbEnabled = settings['voucher_enabled'];
    const dbBadge = settings['voucher_badge'];
    const dbBadgeBn = settings['voucher_badge_bn'];
    const dbHeading = settings['voucher_heading'];
    const dbDesc = settings['voucher_description'];
    const dbCode = settings['voucher_code'];
    const dbDiscount = settings['voucher_discount_display'];
    const dbMinOrder = settings['voucher_min_order_display'];
    const dbNewsletterTitle = settings['voucher_newsletter_heading'];
    const dbNewsletterSuccess = settings['voucher_newsletter_success'];
    const dbWhatsappNum = settings['voucher_whatsapp_number'];
    const dbWhatsappTxt = settings['voucher_whatsapp_text'];
    const dbWhatsappBtn = settings['voucher_whatsapp_btn_text'];
    const dbAccent = settings['voucher_accent_color'];

    // 2. localStorage fallback for instant client sync
    let localConfig: Partial<VoucherConfig> = {};
    const savedLocal = localStorage.getItem('aristo_voucher_config');
    if (savedLocal) {
      try {
        localConfig = JSON.parse(savedLocal);
      } catch (e) {
        // ignore
      }
    }

    return {
      enabled: dbEnabled !== undefined ? dbEnabled !== '0' : (localConfig.enabled !== undefined ? localConfig.enabled : DEFAULT_VOUCHER_CONFIG.enabled),
      badge: dbBadge !== undefined ? dbBadge : (localConfig.badge !== undefined ? localConfig.badge : DEFAULT_VOUCHER_CONFIG.badge),
      badgeBn: dbBadgeBn !== undefined ? dbBadgeBn : (localConfig.badgeBn !== undefined ? localConfig.badgeBn : DEFAULT_VOUCHER_CONFIG.badgeBn),
      heading: dbHeading !== undefined ? dbHeading : (localConfig.heading !== undefined ? localConfig.heading : DEFAULT_VOUCHER_CONFIG.heading),
      description: dbDesc !== undefined ? dbDesc : (localConfig.description !== undefined ? localConfig.description : DEFAULT_VOUCHER_CONFIG.description),
      code: dbCode !== undefined ? dbCode : (localConfig.code !== undefined ? localConfig.code : DEFAULT_VOUCHER_CONFIG.code),
      discountDisplay: dbDiscount || localConfig.discountDisplay || DEFAULT_VOUCHER_CONFIG.discountDisplay,
      minOrderDisplay: dbMinOrder || localConfig.minOrderDisplay || DEFAULT_VOUCHER_CONFIG.minOrderDisplay,
      newsletterHeading: dbNewsletterTitle !== undefined ? dbNewsletterTitle : (localConfig.newsletterHeading !== undefined ? localConfig.newsletterHeading : DEFAULT_VOUCHER_CONFIG.newsletterHeading),
      newsletterSuccessMsg: dbNewsletterSuccess !== undefined ? dbNewsletterSuccess : (localConfig.newsletterSuccessMsg !== undefined ? localConfig.newsletterSuccessMsg : DEFAULT_VOUCHER_CONFIG.newsletterSuccessMsg),
      whatsappNumber: dbWhatsappNum || localConfig.whatsappNumber || DEFAULT_VOUCHER_CONFIG.whatsappNumber,
      whatsappText: dbWhatsappTxt !== undefined ? dbWhatsappTxt : (localConfig.whatsappText !== undefined ? localConfig.whatsappText : DEFAULT_VOUCHER_CONFIG.whatsappText),
      whatsappButtonText: dbWhatsappBtn || localConfig.whatsappButtonText || DEFAULT_VOUCHER_CONFIG.whatsappButtonText,
      accentColor: dbAccent || localConfig.accentColor || DEFAULT_VOUCHER_CONFIG.accentColor,
    };
  }, [settings, updateTick]);

  // If disabled from the shop admin dashboard, hide section
  if (!activeConfig.enabled) {
    return null;
  }

  const promoCode = activeConfig.code || 'WELCOME250';
  const cleanPhone = (activeConfig.whatsappNumber || '8801572491828').replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(activeConfig.whatsappText || 'Hi Aristo Fashion, I need help with sizing and orders.');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    addToast(`Coupon ${promoCode} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please provide a valid email address', 'error');
      return;
    }
    setIsSubmitted(true);
    addToast(`Welcome to Aristo VIP Club! ${activeConfig.discountDisplay} discount voucher activated.`, 'success');
  };

  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="bg-neutral-900 text-white border border-neutral-800 p-6 sm:p-10 lg:p-12 relative overflow-hidden">

        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-800/50 to-neutral-900 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: Voucher Offer */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5">
                {activeConfig.badge || 'Limited Time Promo'}
              </span>
              {activeConfig.badgeBn && (
                <span className="text-xs text-neutral-400 font-medium">
                  {activeConfig.badgeBn}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white">
              {activeConfig.heading || 'Enjoy ৳250 OFF On Your First Order'}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              {activeConfig.description}
            </p>

            {/* Voucher Coupon Box */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="flex items-center space-x-2 px-3.5 py-2 bg-neutral-950 border border-dashed border-amber-400/80">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="font-mono font-bold text-sm tracking-widest text-amber-300">
                  {promoCode}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 border border-white/20 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Newsletter Input & WhatsApp Concierge */}
          <div className="lg:col-span-5 bg-black/50 p-5 sm:p-6 border border-neutral-800 space-y-4">
            <div className="flex items-center space-x-2 text-neutral-200">
              <span className="text-xs font-bold uppercase tracking-wider">
                {activeConfig.newsletterHeading || 'Join VIP Club & Get WhatsApp Updates'}
              </span>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 text-center text-xs text-emerald-300 space-y-1">
                <p className="font-bold">✨ You're Subscribed!</p>
                <p className="text-[11px] text-emerald-400/80">
                  {activeConfig.newsletterSuccessMsg} {email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-neutral-950 border border-neutral-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}

            {/* Quick WhatsApp Concierge Link */}
            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center space-x-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{activeConfig.whatsappButtonText || 'WhatsApp'}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

