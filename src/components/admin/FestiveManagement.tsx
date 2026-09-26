import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useFrontendData } from '../../context/FrontendDataContext';
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  Eye, 
  Sliders, 
  Type, 
  Image as ImageIcon, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MediaUpload } from './MediaUpload';
import festiveDefaultBannerImg from '../../assets/images/festive_demi_couture_banner_1789977402137.jpg';

export interface FestiveConfig {
  enabled: boolean;
  bannerImage: string;
  badge: string;
  title: string;
  subtitle: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  showcaseHeading: string;
  productsFilter: 'all' | 'men' | 'women' | 'belwari' | string;
  productsCount: number;
  exploreText: string;
  exploreLink: string;
  overlayDarkness: '20' | '30' | '40' | '60' | string;
}

export const DEFAULT_FESTIVE_CONFIG: FestiveConfig = {
  enabled: true,
  bannerImage: '',
  badge: 'EID & FESTIVE 2026',
  title: 'Festive',
  subtitle: 'DEMI-COUTURE COLLECTION-26',
  button1Text: 'FOR HER',
  button1Link: '/shop/women',
  button2Text: 'FOR HIM',
  button2Link: '/shop/men?sub=Exclusive%20Panjabi',
  showcaseHeading: 'EID & FESTIVE 2026 CURATIONS',
  productsFilter: 'all',
  productsCount: 12,
  exploreText: 'Explore More',
  exploreLink: '/shop',
  overlayDarkness: '20',
};

export interface FestivePreset {
  id: string;
  name: string;
  description: string;
  tag: string;
  config: Partial<FestiveConfig>;
}

const FESTIVE_PRESETS: FestivePreset[] = [
  {
    id: 'demi-couture',
    name: 'Eid Demi-Couture Original',
    description: 'High luxury calligraphy card with for her & for him dual actions',
    tag: 'Default',
    config: {
      badge: 'EID & FESTIVE 2026',
      title: 'Festive',
      subtitle: 'DEMI-COUTURE COLLECTION-26',
      button1Text: 'FOR HER',
      button1Link: '/shop/women',
      button2Text: 'FOR HIM',
      button2Link: '/shop/men?sub=Exclusive%20Panjabi',
      showcaseHeading: 'EID & FESTIVE 2026 CURATIONS',
      productsFilter: 'all',
      productsCount: 12,
      overlayDarkness: '20',
    }
  },
  {
    id: 'royal-panjabi',
    name: 'Royal Panjabi & Men Edit',
    description: 'Spotlights bespoke Eid Panjabis, royal embroidery & raw silk fabrics',
    tag: 'Men Focus',
    config: {
      badge: 'ROYAL EID COLLECTION',
      title: 'Panjabi',
      subtitle: 'EXCLUSIVE EMBROIDERED & RAW SILK',
      button1Text: 'EXCLUSIVE PANJABI',
      button1Link: '/shop/men?sub=Exclusive%20Panjabi',
      button2Text: 'CASUAL PANJABI',
      button2Link: '/shop/men?sub=Casual%20Panjabi',
      showcaseHeading: 'MEN\'S FESTIVE DROP',
      productsFilter: 'men',
      productsCount: 12,
      overlayDarkness: '30',
    }
  },
  {
    id: 'heritage-belwari',
    name: 'Belwari Handloom Heritage',
    description: 'Authentic jamdani, muslin & heirloom festive sarees',
    tag: 'Heritage',
    config: {
      badge: 'HERITAGE ATELIER',
      title: 'Belwari',
      subtitle: 'HANDWOVEN SILK & HEIRLOOM WEAVES',
      button1Text: 'BELWARI SAREES',
      button1Link: '/shop/belwari',
      button2Text: 'EXPLORE ALL',
      button2Link: '/shop',
      showcaseHeading: 'BELWARI FESTIVE HEIRLOOMS',
      productsFilter: 'belwari',
      productsCount: 8,
      overlayDarkness: '30',
    }
  },
  {
    id: 'women-festive',
    name: 'Women Haute Demi-Couture',
    description: 'Curated luxury festive lawn, organza 3-piece & demi-couture',
    tag: 'Women Focus',
    config: {
      badge: 'WOMEN EDITORIAL 2026',
      title: 'Couture',
      subtitle: 'LUXURY LAWN & FESTIVE 3-PIECE',
      button1Text: 'SHOP FESTIVE',
      button1Link: '/shop/women',
      button2Text: 'NEW DROPS',
      button2Link: '/shop/women?sort=newest',
      showcaseHeading: 'WOMEN\'S FESTIVE ATELIER',
      productsFilter: 'women',
      productsCount: 12,
      overlayDarkness: '20',
    }
  }
];

export const FestiveManagement: React.FC = () => {
  const { settings, loadSettings, updateSettings } = useAdminData();
  const { loadSettings: reloadFrontendSettings } = useFrontendData();

  const [config, setConfig] = useState<FestiveConfig>(() => {
    const savedLocal = localStorage.getItem('aristo_festive_config');
    if (savedLocal) {
      try {
        return { ...DEFAULT_FESTIVE_CONFIG, ...JSON.parse(savedLocal) };
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_FESTIVE_CONFIG;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync settings when loaded from DB API
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      const getVal = (k: string) => settings[k]?.value;

      setConfig(prev => ({
        ...prev,
        enabled: getVal('festive_enabled') !== undefined ? getVal('festive_enabled') !== '0' : prev.enabled,
        bannerImage: getVal('festive_banner_image') || prev.bannerImage,
        badge: getVal('festive_badge') !== undefined ? (getVal('festive_badge') || '') : prev.badge,
        title: getVal('festive_title') || prev.title,
        subtitle: getVal('festive_subtitle') || prev.subtitle,
        button1Text: getVal('festive_btn1_text') || prev.button1Text,
        button1Link: getVal('festive_btn1_link') || prev.button1Link,
        button2Text: getVal('festive_btn2_text') || prev.button2Text,
        button2Link: getVal('festive_btn2_link') || prev.button2Link,
        showcaseHeading: getVal('festive_showcase_heading') !== undefined ? (getVal('festive_showcase_heading') || '') : prev.showcaseHeading,
        productsFilter: getVal('festive_products_filter') || prev.productsFilter,
        productsCount: getVal('festive_products_count') ? parseInt(getVal('festive_products_count'), 10) : prev.productsCount,
        exploreText: getVal('festive_explore_text') || prev.exploreText,
        exploreLink: getVal('festive_explore_link') || prev.exploreLink,
        overlayDarkness: (getVal('festive_overlay_darkness') as any) || prev.overlayDarkness,
      }));
    }
  }, [settings]);

  useEffect(() => {
    loadSettings();
  }, []);

  const handleApplyPreset = (presetConfig: Partial<FestiveConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...presetConfig
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset Festive section settings to original defaults?')) {
      setConfig(DEFAULT_FESTIVE_CONFIG);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsSaving(true);
    setSaveMessage(null);

    // Save directly to localStorage for instant client-side update
    localStorage.setItem('aristo_festive_config', JSON.stringify(config));

    // Construct settings payload for backend API
    const settingsPayload = {
      festive_enabled: {
        value: config.enabled ? '1' : '0',
        type: 'boolean',
        category: 'festive',
        description: 'Toggle Festive section on homepage on or off'
      },
      festive_banner_image: {
        value: config.bannerImage,
        type: 'text',
        category: 'festive',
        description: 'Background image URL for the festive demi-couture showcase'
      },
      festive_badge: {
        value: config.badge,
        type: 'text',
        category: 'festive',
        description: 'Optional badge / seasonal tag on festive banner'
      },
      festive_title: {
        value: config.title,
        type: 'text',
        category: 'festive',
        description: 'Primary title text on festive banner card'
      },
      festive_subtitle: {
        value: config.subtitle,
        type: 'text',
        category: 'festive',
        description: 'Subtitle text on festive banner card'
      },
      festive_btn1_text: {
        value: config.button1Text,
        type: 'text',
        category: 'festive',
        description: 'First CTA button label'
      },
      festive_btn1_link: {
        value: config.button1Link,
        type: 'text',
        category: 'festive',
        description: 'First CTA button destination URL'
      },
      festive_btn2_text: {
        value: config.button2Text,
        type: 'text',
        category: 'festive',
        description: 'Second CTA button label'
      },
      festive_btn2_link: {
        value: config.button2Link,
        type: 'text',
        category: 'festive',
        description: 'Second CTA button destination URL'
      },
      festive_showcase_heading: {
        value: config.showcaseHeading,
        type: 'text',
        category: 'festive',
        description: 'Section heading above product grid'
      },
      festive_products_filter: {
        value: config.productsFilter,
        type: 'text',
        category: 'festive',
        description: 'Filter products displayed in festive showcase (all, men, women, belwari)'
      },
      festive_products_count: {
        value: String(config.productsCount),
        type: 'number',
        category: 'festive',
        description: 'Number of products to display in festive showcase'
      },
      festive_explore_text: {
        value: config.exploreText,
        type: 'text',
        category: 'festive',
        description: 'Bottom explore button text'
      },
      festive_explore_link: {
        value: config.exploreLink,
        type: 'text',
        category: 'festive',
        description: 'Bottom explore button destination URL'
      },
      festive_overlay_darkness: {
        value: config.overlayDarkness,
        type: 'text',
        category: 'festive',
        description: 'Dark tint overlay percentage (20, 30, 40, 60)'
      },
    };

    try {
      const success = await updateSettings(settingsPayload as any);
      await reloadFrontendSettings();

      if (success) {
        setSaveMessage({ 
          type: 'success', 
          text: 'Festive section settings successfully saved & synchronized to database!' 
        });
      } else {
        setSaveMessage({ 
          type: 'success', 
          text: 'Saved locally for client preview. Ensure backend settings table is synced.' 
        });
      }
    } catch (err: any) {
      setSaveMessage({ 
        type: 'error', 
        text: err?.message || 'Error saving settings. Saved to local cache as fallback.' 
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 6000);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearSuffix = String(currentYear).slice(-2);
  const activeImage = config.bannerImage || festiveDefaultBannerImg;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-neutral-900 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </span>
            <h1 className="text-xl font-bold text-gray-900">Festive Section Management</h1>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              config.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {config.enabled ? 'Active on Homepage' : 'Hidden / Disabled'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Dynamically customize the homepage Festive demi-couture banner, calligraphy headline, buttons, and product showcase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Store
          </a>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-black rounded-lg transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-300" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in ${
          saveMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span className="flex-1 font-medium">{saveMessage.text}</span>
          <button 
            type="button" 
            onClick={() => setSaveMessage(null)}
            className="text-xs opacity-60 hover:opacity-100 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Master Enable/Disable Toggle */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${config.enabled ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-500'}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Enable Festive Section on Homepage</h3>
            <p className="text-xs text-gray-500">
              When toggled off, both the Festive Demi-Couture Banner and the Curated Product Showcase will be hidden from the home page.
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
        </label>
      </div>

      {/* Interactive Live Preview */}
      <div className="bg-neutral-950 rounded-2xl shadow-md border border-neutral-800 overflow-hidden text-white">
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-neutral-300">Live Preview</span>
            <span>— Homepage Banner Realtime Simulation</span>
          </div>
          <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[11px] font-mono">
            {config.enabled ? 'Visible on Home' : 'Section Disabled'}
          </span>
        </div>

        {/* Banner Preview Area */}
        <div className="relative w-full overflow-hidden bg-neutral-900 min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center select-none">
          <img
            src={activeImage}
            alt="Festive Preview"
            className="absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-center"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: parseInt(config.overlayDarkness, 10) / 100 }} />

          {/* Floating Luxury Demi-Couture Card Container */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 flex justify-end">
            <div className="w-full max-w-[280px] sm:max-w-[340px] bg-black/55 backdrop-blur-md border border-white/20 p-5 sm:p-7 text-center text-white shadow-2xl">
              
              {/* Optional Seasonal Badge */}
              {config.badge && (
                <div className="mb-2">
                  <span className="inline-block text-[9px] uppercase tracking-[0.25em] font-bold text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                    {config.badge}
                  </span>
                </div>
              )}

              {/* Elegant Calligraphic Brand Script */}
              <div className="flex flex-col items-center justify-center mb-4">
                <svg 
                  className="w-40 sm:w-48 h-auto text-white/95 drop-shadow-md filter" 
                  viewBox="0 0 300 100" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M30 45 C 50 15, 110 10, 160 30 C 190 40, 240 25, 270 15" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    opacity="0.85" 
                  />
                  <text 
                    x="150" 
                    y="62" 
                    textAnchor="middle" 
                    fontFamily="Playfair Display, Georgia, 'Great Vibes', cursive, serif" 
                    fontSize={config.title.length > 10 ? "32" : "44"} 
                    fontStyle="italic" 
                    fontWeight="400" 
                    fill="currentColor"
                    letterSpacing="1"
                  >
                    {config.title || 'Festive'}
                  </text>
                  <path 
                    d="M100 72 Q 150 85 200 72" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    opacity="0.7" 
                  />
                </svg>

                {/* Subtitle & Accent Line */}
                <div className="w-12 h-[1px] bg-white/40 my-2" />
                <p className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.25em] text-neutral-200 mt-0.5">
                  {config.subtitle || `DEMI-COUTURE COLLECTION-${yearSuffix}`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {config.button1Text && (
                  <div className="bg-neutral-800/85 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] py-2 px-2 border border-white/10 text-center truncate">
                    {config.button1Text}
                  </div>
                )}
                {config.button2Text && (
                  <div className="bg-neutral-800/85 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] py-2 px-2 border border-white/10 text-center truncate">
                    {config.button2Text}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Miniature Showcase Preview Underneath */}
        <div className="bg-neutral-900/60 p-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-neutral-200">Showcase Grid:</span>
            <span>Heading: "{config.showcaseHeading || 'None'}"</span>
            <span>• Filter: <strong className="text-white uppercase">{config.productsFilter}</strong></span>
            <span>• Limit: <strong className="text-white">{config.productsCount} items</strong></span>
          </div>
          <span className="text-[11px] text-neutral-400">
            CTA: "{config.exploreText}" &rarr; {config.exploreLink}
          </span>
        </div>
      </div>

      {/* Preset Curations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-700" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Quick Festive Presets</h2>
          </div>
          <span className="text-xs text-gray-400">Click any preset to apply curated settings instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FESTIVE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset.config)}
              className="text-left p-4 rounded-xl border border-gray-200 hover:border-black hover:bg-neutral-50/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900 group-hover:text-black">
                  {preset.name}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                  {preset.tag}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                {preset.description}
              </p>
              <span className="text-[11px] font-bold text-neutral-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Apply Preset &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form Columns */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Visual Media & Background */}
        <div className="space-y-6">

          {/* Media Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-4 h-4 text-neutral-700" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Banner Background Image</h2>
            </div>
            
            <MediaUpload
              value={config.bannerImage}
              onChange={(url) => setConfig({ ...config, bannerImage: url })}
              label="Festive Banner Background (Leave blank to use default demi-couture editorial image)"
              accept="image"
              placeholder="https://images.unsplash.com/... or upload directly (up to 50MB)"
            />

            {/* Quick Default Reset */}
            {config.bannerImage && (
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, bannerImage: '' })}
                  className="text-xs font-medium text-red-600 hover:underline cursor-pointer"
                >
                  Clear custom image & use default atelier photo
                </button>
              </div>
            )}

            {/* Darkness Overlay Slider */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Dark Tint Overlay
                </label>
                <span className="text-xs font-mono font-bold text-gray-800">{config.overlayDarkness}%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['20', '30', '40', '60'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setConfig({ ...config, overlayDarkness: val })}
                    className={`py-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                      config.overlayDarkness === val
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {val}% Tint
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Controls the subtle dark overlay to ensure maximum legibility for the white demi-couture text.
              </p>
            </div>
          </div>

          {/* Product Showcase Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-neutral-700" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Curated Product Grid Settings</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Section Heading (Above Grid)
              </label>
              <input
                type="text"
                value={config.showcaseHeading}
                onChange={(e) => setConfig({ ...config, showcaseHeading: e.target.value })}
                placeholder="EID & FESTIVE 2026 CURATIONS"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              />
              <p className="text-[11px] text-gray-400 mt-1">Leave blank if you prefer no heading text above the products.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Collection Filter
                </label>
                <select
                  value={config.productsFilter}
                  onChange={(e) => setConfig({ ...config, productsFilter: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black bg-white"
                >
                  <option value="all">All Curated (Men + Women + Belwari)</option>
                  <option value="men">Men's Festive Only</option>
                  <option value="women">Women's Festive Only</option>
                  <option value="belwari">Belwari Heritage Sarees Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Max Products Count
                </label>
                <select
                  value={config.productsCount}
                  onChange={(e) => setConfig({ ...config, productsCount: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black bg-white"
                >
                  <option value={6}>6 Items (1 Row)</option>
                  <option value={8}>8 Items</option>
                  <option value={12}>12 Items (Standard Curated)</option>
                  <option value={16}>16 Items</option>
                  <option value={24}>24 Items</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bottom Button Text
                </label>
                <input
                  type="text"
                  value={config.exploreText}
                  onChange={(e) => setConfig({ ...config, exploreText: e.target.value })}
                  placeholder="Explore More"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bottom Button Link
                </label>
                <input
                  type="text"
                  value={config.exploreLink}
                  onChange={(e) => setConfig({ ...config, exploreLink: e.target.value })}
                  placeholder="/shop"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Banner Text, Branding & Action Buttons */}
        <div className="space-y-6">

          {/* Typography & Branding */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-neutral-700" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Banner Typography & Badge</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Seasonal Badge / Tag
              </label>
              <input
                type="text"
                value={config.badge}
                onChange={(e) => setConfig({ ...config, badge: e.target.value })}
                placeholder="EID & FESTIVE 2026"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              />
              <p className="text-[11px] text-gray-400 mt-1">Displays above the calligraphy title as a golden pill tag.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Calligraphic Script Title
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                placeholder="Festive"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              />
              <p className="text-[11px] text-gray-400 mt-1">Rendered with elegant luxury flourish calligraphy script.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Collection Subtitle / Tagline
              </label>
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                placeholder="DEMI-COUTURE COLLECTION-26"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="w-4 h-4 text-neutral-700" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Call-to-Action Buttons</h2>
            </div>

            {/* Button 1 */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Button 1 (Left)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={config.button1Text}
                    onChange={(e) => setConfig({ ...config, button1Text: e.target.value })}
                    placeholder="FOR HER"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Destination Link</label>
                  <input
                    type="text"
                    value={config.button1Link}
                    onChange={(e) => setConfig({ ...config, button1Link: e.target.value })}
                    placeholder="/shop/women"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Button 2 */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Button 2 (Right)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={config.button2Text}
                    onChange={(e) => setConfig({ ...config, button2Text: e.target.value })}
                    placeholder="FOR HIM"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Destination Link</label>
                  <input
                    type="text"
                    value={config.button2Link}
                    onChange={(e) => setConfig({ ...config, button2Link: e.target.value })}
                    placeholder="/shop/men?sub=Exclusive%20Panjabi"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Save Bar inside Column */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 text-sm font-bold text-white bg-neutral-900 hover:bg-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Festive Settings to Database...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber-300" />
                  Save & Publish Festive Settings
                </>
              )}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};
