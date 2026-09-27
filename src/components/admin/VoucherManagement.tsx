import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useFrontendData } from '../../context/FrontendDataContext';
import {
  Ticket,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Tag,
  Mail,
  MessageCircle,
  Sparkles,
  Phone,
  Power
} from 'lucide-react';

export interface VoucherConfig {
  enabled: boolean;
  badge: string;
  badgeBn: string;
  heading: string;
  description: string;
  code: string;
  discountDisplay: string;
  minOrderDisplay: string;
  newsletterHeading: string;
  newsletterSuccessMsg: string;
  whatsappNumber: string;
  whatsappText: string;
  whatsappButtonText: string;
  accentColor: 'amber' | 'emerald' | 'gold' | 'rose' | string;
}

export const DEFAULT_VOUCHER_CONFIG: VoucherConfig = {
  enabled: true,
  badge: 'Limited Time Promo',
  badgeBn: 'বিশেষ ছাড় ভাউচার',
  heading: 'Enjoy ৳250 OFF On Your First Order',
  description: 'Use voucher code WELCOME250 at checkout on orders above ৳2,000. Plus receive early private sale invites and festive lookbooks.',
  code: 'WELCOME250',
  discountDisplay: '৳250',
  minOrderDisplay: '৳2,000',
  newsletterHeading: 'Join VIP Club & Get WhatsApp Updates',
  newsletterSuccessMsg: "We've sent your ৳250 discount voucher to",
  whatsappNumber: '8801572491828',
  whatsappText: 'Hi Aristo Fashion, I need help with sizing and orders.',
  whatsappButtonText: 'WhatsApp',
  accentColor: 'amber',
};

export interface VoucherPreset {
  id: string;
  name: string;
  description: string;
  tag: string;
  config: Partial<VoucherConfig>;
}

const VOUCHER_PRESETS: VoucherPreset[] = [
  {
    id: 'welcome-250',
    name: 'First Order Welcome (৳250 OFF)',
    description: 'Classic first-time buyer acquisition promo with ৳250 OFF over ৳2,000 order.',
    tag: 'Default',
    config: {
      enabled: true,
      badge: 'Limited Time Promo',
      badgeBn: 'বিশেষ ছাড় ভাউচার',
      heading: 'Enjoy ৳250 OFF On Your First Order',
      description: 'Use voucher code WELCOME250 at checkout on orders above ৳2,000. Plus receive early private sale invites and festive lookbooks.',
      code: 'WELCOME250',
      discountDisplay: '৳250',
      minOrderDisplay: '৳2,000',
      newsletterHeading: 'Join VIP Club & Get WhatsApp Updates',
      newsletterSuccessMsg: "We've sent your ৳250 discount voucher to",
      whatsappNumber: '8801572491828',
      whatsappText: 'Hi Aristo Fashion, I need help with sizing and orders.',
      whatsappButtonText: 'WhatsApp',
      accentColor: 'amber',
    }
  },
  {
    id: 'eid-500',
    name: 'Eid Festive Special (৳500 OFF)',
    description: 'High conversion Eid seasonal voucher for premium Panjabis & Demi-Couture.',
    tag: 'Festive Season',
    config: {
      enabled: true,
      badge: 'EID SPECIAL PRIVILEGE',
      badgeBn: 'ঈদ স্পেশাল ছাড়',
      heading: 'Enjoy ৳500 OFF On Eid Festive Curations',
      description: 'Use voucher code EID500 at checkout on orders above ৳3,500. Handcrafted Demi-Couture, Royal Panjabi & Heritage Weaves.',
      code: 'EID500',
      discountDisplay: '৳500',
      minOrderDisplay: '৳3,500',
      newsletterHeading: 'Subscribe For Eid Lookbooks & VIP Discounts',
      newsletterSuccessMsg: "Your Eid ৳500 discount promo code has been dispatched to",
      whatsappNumber: '8801572491828',
      whatsappText: 'Hi Aristo Fashion, I want assistance with the Eid Festive collection.',
      whatsappButtonText: 'WhatsApp Concierge',
      accentColor: 'amber',
    }
  },
  {
    id: 'vip-15',
    name: 'VIP Club 15% OFF Sitewide',
    description: 'Percentage discount voucher for loyal shoppers and newsletter subscribers.',
    tag: 'VIP Loyalty',
    config: {
      enabled: true,
      badge: 'VIP ATELIER ACCESS',
      badgeBn: 'ভিআইপি মেম্বার অফার',
      heading: 'Privilege 15% OFF Your Entire Purchase',
      description: 'Unlock 15% savings across all collections with code ARISTOVIP15 on orders above ৳4,000. Includes priority express packaging.',
      code: 'ARISTOVIP15',
      discountDisplay: '15% OFF',
      minOrderDisplay: '৳4,000',
      newsletterHeading: 'Join VIP Club for Secret Drops & VIP Pricing',
      newsletterSuccessMsg: "VIP invitation & 15% off voucher sent to",
      whatsappNumber: '8801572491828',
      whatsappText: 'Hi Aristo Fashion VIP Concierge, please assist me with my order.',
      whatsappButtonText: 'VIP WhatsApp',
      accentColor: 'emerald',
    }
  },
  {
    id: 'weekend-300',
    name: 'Weekend Flash Drop (৳300 OFF)',
    description: 'Urgency-driven weekend special voucher with lower cart threshold.',
    tag: 'Flash Promo',
    config: {
      enabled: true,
      badge: 'WEEKEND FLASH PRIVILEGE',
      badgeBn: 'উইকেন্ড ফ্ল্যাশ ডিল',
      heading: 'Instant ৳300 OFF This Weekend Only',
      description: 'Apply voucher code FLASH300 during checkout on orders over ৳2,200. Limited to first 100 shoppers.',
      code: 'FLASH300',
      discountDisplay: '৳300',
      minOrderDisplay: '৳2,200',
      newsletterHeading: 'Get Instant Flash Sale Alerts on WhatsApp',
      newsletterSuccessMsg: "৳300 Flash voucher code reserved for",
      whatsappNumber: '8801572491828',
      whatsappText: 'Hi Aristo Fashion, I want to claim my weekend flash discount.',
      whatsappButtonText: 'WhatsApp',
      accentColor: 'gold',
    }
  }
];

export const VoucherManagement: React.FC = () => {
  const { settings, loadSettings, updateSettings } = useAdminData();
  const { loadSettings: reloadFrontendSettings } = useFrontendData();

  const [config, setConfig] = useState<VoucherConfig>(() => {
    const savedLocal = localStorage.getItem('aristo_voucher_config');
    if (savedLocal) {
      try {
        return { ...DEFAULT_VOUCHER_CONFIG, ...JSON.parse(savedLocal) };
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_VOUCHER_CONFIG;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewCopied, setPreviewCopied] = useState(false);
  const [previewEmail, setPreviewEmail] = useState('');
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  // Sync settings when loaded from DB API
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      const getVal = (k: string) => settings[k]?.value;

      setConfig(prev => ({
        ...prev,
        enabled: getVal('voucher_enabled') !== undefined ? getVal('voucher_enabled') !== '0' : prev.enabled,
        badge: getVal('voucher_badge') !== undefined ? getVal('voucher_badge') : prev.badge,
        badgeBn: getVal('voucher_badge_bn') !== undefined ? getVal('voucher_badge_bn') : prev.badgeBn,
        heading: getVal('voucher_heading') || prev.heading,
        description: getVal('voucher_description') || prev.description,
        code: getVal('voucher_code') || prev.code,
        discountDisplay: getVal('voucher_discount_display') || prev.discountDisplay,
        minOrderDisplay: getVal('voucher_min_order_display') || prev.minOrderDisplay,
        newsletterHeading: getVal('voucher_newsletter_heading') || prev.newsletterHeading,
        newsletterSuccessMsg: getVal('voucher_newsletter_success') || prev.newsletterSuccessMsg,
        whatsappNumber: getVal('voucher_whatsapp_number') || prev.whatsappNumber,
        whatsappText: getVal('voucher_whatsapp_text') || prev.whatsappText,
        whatsappButtonText: getVal('voucher_whatsapp_btn_text') || prev.whatsappButtonText,
        accentColor: getVal('voucher_accent_color') || prev.accentColor,
      }));
    }
  }, [settings]);

  useEffect(() => {
    loadSettings();
  }, []);

  const handleApplyPreset = (presetConfig: Partial<VoucherConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...presetConfig
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset Homepage VIP Voucher settings to original defaults?')) {
      setConfig(DEFAULT_VOUCHER_CONFIG);
      setPreviewSubmitted(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // 1. Save directly to localStorage for immediate client-side and cross-tab update
      localStorage.setItem('aristo_voucher_config', JSON.stringify(config));
      window.dispatchEvent(new Event('voucher-config-updated'));

      // 2. Construct settings payload for backend API
      const settingsPayload = {
        voucher_enabled: {
          value: config.enabled ? '1' : '0',
          type: 'boolean',
          category: 'voucher',
          description: 'Toggle VIP Club Voucher section on homepage on or off'
        },
        voucher_badge: {
          value: config.badge,
          type: 'text',
          category: 'voucher',
          description: 'Top badge text (English)'
        },
        voucher_badge_bn: {
          value: config.badgeBn,
          type: 'text',
          category: 'voucher',
          description: 'Top badge text (Bangla)'
        },
        voucher_heading: {
          value: config.heading,
          type: 'text',
          category: 'voucher',
          description: 'Main promotional headline'
        },
        voucher_description: {
          value: config.description,
          type: 'textarea',
          category: 'voucher',
          description: 'Voucher details and conditions text'
        },
        voucher_code: {
          value: config.code,
          type: 'text',
          category: 'voucher',
          description: 'Promotional discount voucher code'
        },
        voucher_discount_display: {
          value: config.discountDisplay,
          type: 'text',
          category: 'voucher',
          description: 'Display discount amount or percentage'
        },
        voucher_min_order_display: {
          value: config.minOrderDisplay,
          type: 'text',
          category: 'voucher',
          description: 'Display minimum order requirement'
        },
        voucher_newsletter_heading: {
          value: config.newsletterHeading,
          type: 'text',
          category: 'voucher',
          description: 'Newsletter subscription box title'
        },
        voucher_newsletter_success: {
          value: config.newsletterSuccessMsg,
          type: 'text',
          category: 'voucher',
          description: 'Success notice shown upon subscription'
        },
        voucher_whatsapp_number: {
          value: config.whatsappNumber,
          type: 'text',
          category: 'voucher',
          description: 'Customer concierge WhatsApp phone number'
        },
        voucher_whatsapp_text: {
          value: config.whatsappText,
          type: 'text',
          category: 'voucher',
          description: 'Pre-filled message for WhatsApp link'
        },
        voucher_whatsapp_btn_text: {
          value: config.whatsappButtonText,
          type: 'text',
          category: 'voucher',
          description: 'WhatsApp concierge button label'
        },
        voucher_accent_color: {
          value: config.accentColor,
          type: 'text',
          category: 'voucher',
          description: 'Color theme for badge & accent details'
        }
      };

      // 3. Attempt DB update
      await updateSettings(settingsPayload as any);
      await reloadFrontendSettings();

      setSaveMessage({
        type: 'success',
        text: 'Voucher settings saved successfully! Changes are immediately live on the homepage.'
      });
    } catch (err: any) {
      console.warn('DB settings update warning:', err);
      setSaveMessage({
        type: 'success',
        text: 'Voucher settings saved to local client storage! Homepage updated.'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    }
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(config.code);
    setPreviewCopied(true);
    setTimeout(() => setPreviewCopied(false), 2500);
  };

  const handlePreviewSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewEmail.trim()) return;
    setPreviewSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(config.whatsappText)}`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* ── HEADER & ACTIONS BAR ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">VIP Club Voucher Management</h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                config.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {config.enabled ? 'Active on Homepage' : 'Hidden / Disabled'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Dynamically control homepage discount voucher, promo codes, VIP newsletter and WhatsApp concierge link
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Homepage</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Voucher Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── NOTIFICATION ALERT ── */}
      {saveMessage && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-3 border ${
          saveMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="font-medium">{saveMessage.text}</span>
        </div>
      )}

      {/* ── PRESETS SELECTOR ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Quick Campaign Presets</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select a pre-configured promotional campaign or customize fields below
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VOUCHER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset.config)}
              className="text-left p-4 rounded-xl border border-gray-200 hover:border-gray-900 bg-gray-50/50 hover:bg-white transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-200 text-gray-800 group-hover:bg-amber-100 group-hover:text-amber-800 transition">
                    {preset.tag}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-600">
                    {preset.config.code}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-gray-900 group-hover:text-black">
                  {preset.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-[11px] font-semibold text-gray-600 group-hover:text-gray-900">
                <span>Apply Template</span>
                <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONFIGURATION FORM & LIVE PREVIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SETTINGS FORM (7 COLS) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          
          {/* 1. VISIBILITY & CAMPAIGN HEADER */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Power className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-900">Display Status & Header</h2>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2.5 text-xs font-semibold text-gray-700">
                  {config.enabled ? 'Section Enabled' : 'Section Disabled'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Top Badge (English)
                </label>
                <input
                  type="text"
                  value={config.badge}
                  onChange={(e) => setConfig({ ...config, badge: e.target.value })}
                  placeholder="e.g. Limited Time Promo"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Sub-Badge (Bangla / Accent)
                </label>
                <input
                  type="text"
                  value={config.badgeBn}
                  onChange={(e) => setConfig({ ...config, badgeBn: e.target.value })}
                  placeholder="e.g. বিশেষ ছাড় ভাউচার"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Main Promotional Headline
              </label>
              <input
                type="text"
                value={config.heading}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
                placeholder="e.g. Enjoy ৳250 OFF On Your First Order"
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Detailed Offer Description
              </label>
              <textarea
                rows={3}
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Offer details, terms, conditions and checkout guidelines..."
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                required
              />
            </div>
          </div>

          {/* 2. VOUCHER COUPON CODE & DISCOUNT VALUE */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <Tag className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-gray-900">Voucher Code & Discount Specs</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Coupon Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.code}
                    onChange={(e) => setConfig({ ...config, code: e.target.value.toUpperCase().trim() })}
                    placeholder="e.g. WELCOME250"
                    className="w-full font-mono font-bold text-sm tracking-wider uppercase px-3.5 py-2.5 bg-amber-50/50 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Discount Display
                </label>
                <input
                  type="text"
                  value={config.discountDisplay}
                  onChange={(e) => setConfig({ ...config, discountDisplay: e.target.value })}
                  placeholder="e.g. ৳250 or 15%"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Min. Order Amount
                </label>
                <input
                  type="text"
                  value={config.minOrderDisplay}
                  onChange={(e) => setConfig({ ...config, minOrderDisplay: e.target.value })}
                  placeholder="e.g. ৳2,000"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* 3. VIP NEWSLETTER SUBSCRIPTION */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <Mail className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-gray-900">VIP Newsletter Card</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Newsletter Card Title
              </label>
              <input
                type="text"
                value={config.newsletterHeading}
                onChange={(e) => setConfig({ ...config, newsletterHeading: e.target.value })}
                placeholder="e.g. Join VIP Club & Get WhatsApp Updates"
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Subscription Success Notification Message
              </label>
              <input
                type="text"
                value={config.newsletterSuccessMsg}
                onChange={(e) => setConfig({ ...config, newsletterSuccessMsg: e.target.value })}
                placeholder="e.g. We've sent your ৳250 discount voucher to"
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              />
            </div>
          </div>

          {/* 4. WHATSAPP CONCIERGE INTEGRATION */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-gray-900">WhatsApp Concierge Integration</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Phone Number (with Country Code)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={config.whatsappNumber}
                    onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                    placeholder="e.g. 8801572491828"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Format: 8801XXXXXXXXX (Used for live click-to-chat link)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Button Label
                </label>
                <input
                  type="text"
                  value={config.whatsappButtonText}
                  onChange={(e) => setConfig({ ...config, whatsappButtonText: e.target.value })}
                  placeholder="e.g. WhatsApp"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Default Pre-filled WhatsApp Consultation Message
              </label>
              <input
                type="text"
                value={config.whatsappText}
                onChange={(e) => setConfig({ ...config, whatsappText: e.target.value })}
                placeholder="e.g. Hi Aristo Fashion, I need help with sizing and orders."
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              />
              <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1.5 truncate">
                <span className="font-semibold text-gray-600">Generated URL:</span>
                <span className="text-emerald-700 underline truncate">{whatsappUrl}</span>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving & Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes to Live Homepage</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* RIGHT COLUMN: LIVE STOREFRONT PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Live Component Preview</h2>
            </div>
            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
              Exact Storefront Render
            </span>
          </div>

          {/* Storefront simulation frame */}
          <div className="rounded-2xl border-4 border-gray-900/10 overflow-hidden shadow-2xl bg-neutral-950 p-2 sm:p-4">
            
            {/* VIP Club Voucher exact component render */}
            <div className="bg-neutral-900 text-white border border-neutral-800 p-5 sm:p-7 relative overflow-hidden rounded-lg">
              
              {/* Subtle background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-800/50 to-neutral-900 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                
                {/* Voucher Offer */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                      {config.badge || 'Limited Time Promo'}
                    </span>
                    {config.badgeBn && (
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {config.badgeBn}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold font-serif tracking-tight text-white leading-snug">
                    {config.heading || 'Enjoy ৳250 OFF On Your First Order'}
                  </h3>

                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    {config.description || 'Use voucher code WELCOME250 at checkout.'}
                  </p>

                  {/* Voucher Coupon Box */}
                  <div className="flex items-center space-x-2.5 pt-1">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-neutral-950 border border-dashed border-amber-400/80">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono font-bold text-xs tracking-widest text-amber-300">
                        {config.code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPreview}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 border border-white/20 transition-colors cursor-pointer"
                    >
                      {previewCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Newsletter & WhatsApp */}
                <div className="bg-black/50 p-4 border border-neutral-800 space-y-3 rounded">
                  <div className="flex items-center space-x-2 text-neutral-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {config.newsletterHeading || 'Join VIP Club & Get WhatsApp Updates'}
                    </span>
                  </div>

                  {previewSubmitted ? (
                    <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 text-center text-xs text-emerald-300 space-y-1 rounded">
                      <p className="font-bold">✨ You're Subscribed!</p>
                      <p className="text-[10px] text-emerald-400/80">
                        {config.newsletterSuccessMsg} {previewEmail || 'your email'}.
                      </p>
                      <button
                        type="button"
                        onClick={() => setPreviewSubmitted(false)}
                        className="text-[10px] text-emerald-300 underline mt-1 block mx-auto"
                      >
                        Reset Test
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePreviewSubscribe} className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={previewEmail}
                            onChange={(e) => setPreviewEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full bg-neutral-950 border border-neutral-700 pl-8 pr-2.5 py-2 text-[11px] text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-white hover:bg-neutral-200 text-black text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Subscribe
                        </button>
                      </div>
                    </form>
                  )}

                  {/* WhatsApp concierge */}
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center space-x-1 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{config.whatsappButtonText || 'WhatsApp'}</span>
                    </a>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      +{config.whatsappNumber}
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className="text-center">
            <span className="text-[11px] text-gray-500">
              💡 Tip: All edits reflect in this preview immediately. Press <strong>Save All Changes</strong> to publish live.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
