import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFrontendData } from '../context/FrontendDataContext';
import { DEFAULT_FESTIVE_CONFIG, FestiveConfig } from './admin/FestiveManagement';
import festiveBannerFallbackImg from '../assets/images/festive_demi_couture_banner_1789977402137.jpg';

export const FestivalBanner: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useFrontendData();

  const currentYear = new Date().getFullYear();
  const yearSuffix = String(currentYear).slice(-2);

  // Compute active configuration combining Database settings and localStorage
  const activeConfig: FestiveConfig = useMemo(() => {
    // 1. Database settings
    const dbEnabled = settings['festive_enabled'];
    const dbBannerImage = settings['festive_banner_image'];
    const dbBadge = settings['festive_badge'];
    const dbTitle = settings['festive_title'];
    const dbSubtitle = settings['festive_subtitle'];
    const dbBtn1Text = settings['festive_btn1_text'];
    const dbBtn1Link = settings['festive_btn1_link'];
    const dbBtn2Text = settings['festive_btn2_text'];
    const dbBtn2Link = settings['festive_btn2_link'];
    const dbOverlay = settings['festive_overlay_darkness'];

    // 2. localStorage fallback (for instant preview without waiting for cache)
    let localConfig: Partial<FestiveConfig> = {};
    const savedLocal = localStorage.getItem('aristo_festive_config');
    if (savedLocal) {
      try {
        localConfig = JSON.parse(savedLocal);
      } catch (e) {
        // ignore
      }
    }

    return {
      enabled: dbEnabled !== undefined ? dbEnabled !== '0' : (localConfig.enabled !== undefined ? localConfig.enabled : DEFAULT_FESTIVE_CONFIG.enabled),
      bannerImage: dbBannerImage || localConfig.bannerImage || DEFAULT_FESTIVE_CONFIG.bannerImage,
      badge: dbBadge !== undefined ? dbBadge : (localConfig.badge !== undefined ? localConfig.badge : DEFAULT_FESTIVE_CONFIG.badge),
      title: dbTitle !== undefined ? dbTitle : (localConfig.title !== undefined ? localConfig.title : DEFAULT_FESTIVE_CONFIG.title),
      subtitle: dbSubtitle !== undefined ? dbSubtitle : (localConfig.subtitle !== undefined ? localConfig.subtitle : `DEMI-COUTURE COLLECTION-${yearSuffix}`),
      button1Text: dbBtn1Text !== undefined ? dbBtn1Text : (localConfig.button1Text !== undefined ? localConfig.button1Text : DEFAULT_FESTIVE_CONFIG.button1Text),
      button1Link: dbBtn1Link !== undefined ? dbBtn1Link : (localConfig.button1Link !== undefined ? localConfig.button1Link : DEFAULT_FESTIVE_CONFIG.button1Link),
      button2Text: dbBtn2Text !== undefined ? dbBtn2Text : (localConfig.button2Text !== undefined ? localConfig.button2Text : DEFAULT_FESTIVE_CONFIG.button2Text),
      button2Link: dbBtn2Link !== undefined ? dbBtn2Link : (localConfig.button2Link !== undefined ? localConfig.button2Link : DEFAULT_FESTIVE_CONFIG.button2Link),
      showcaseHeading: settings['festive_showcase_heading'] || localConfig.showcaseHeading || DEFAULT_FESTIVE_CONFIG.showcaseHeading,
      productsFilter: settings['festive_products_filter'] || localConfig.productsFilter || DEFAULT_FESTIVE_CONFIG.productsFilter,
      productsCount: settings['festive_products_count'] ? parseInt(settings['festive_products_count'], 10) : (localConfig.productsCount || DEFAULT_FESTIVE_CONFIG.productsCount),
      exploreText: settings['festive_explore_text'] || localConfig.exploreText || DEFAULT_FESTIVE_CONFIG.exploreText,
      exploreLink: settings['festive_explore_link'] || localConfig.exploreLink || DEFAULT_FESTIVE_CONFIG.exploreLink,
      overlayDarkness: (dbOverlay as any) || localConfig.overlayDarkness || DEFAULT_FESTIVE_CONFIG.overlayDarkness,
    };
  }, [settings, yearSuffix]);

  // If disabled by admin, hide completely
  if (!activeConfig.enabled) {
    return null;
  }

  const bgImage = activeConfig.bannerImage || festiveBannerFallbackImg;
  const overlayOpacity = parseInt(activeConfig.overlayDarkness, 10) / 100;

  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-0 lg:px-0 py-2 md:py-0 select-none">
      <div className="relative w-full overflow-hidden bg-neutral-900 border border-neutral-200/60 md:border-x-0 md:border-y shadow-lg min-h-[380px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[640px] xl:min-h-[700px] flex items-center">
        
        {/* Full-Width Editorial Background Image */}
        <img
          src={bgImage}
          alt={activeConfig.title ? `${activeConfig.title} Demi-Couture Collection` : 'Festive Demi-Couture Collection'}
          className="absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-center select-none"
        />

        {/* Ambient Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 sm:hidden pointer-events-none" />
        <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: overlayOpacity }} />

        {/* Floating Luxury Demi-Couture Card Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 flex justify-end">
          <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] bg-black/45 backdrop-blur-md border border-white/20 p-6 sm:p-8 text-center text-white shadow-2xl transition-all duration-300 hover:bg-black/55">
            
            {/* Optional Seasonal Badge */}
            {activeConfig.badge && (
              <div className="mb-2">
                <span className="inline-block text-[9px] uppercase tracking-[0.25em] font-bold text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                  {activeConfig.badge}
                </span>
              </div>
            )}

            {/* Elegant Calligraphic Brand Script */}
            <div className="flex flex-col items-center justify-center mb-6">
              <svg 
                className="w-48 sm:w-56 h-auto text-white/95 drop-shadow-md filter" 
                viewBox="0 0 300 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Decorative Calligraphy Flourish */}
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
                  fontSize={activeConfig.title.length > 10 ? "32" : "46"} 
                  fontStyle="italic" 
                  fontWeight="400" 
                  fill="currentColor"
                  letterSpacing="1"
                >
                  {activeConfig.title || 'Festive'}
                </text>
                {/* Flourish loop */}
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
              <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.3em] text-neutral-200 mt-0.5">
                {activeConfig.subtitle}
              </p>
            </div>

            {/* Action Buttons: Dynamically rendered */}
            <div className={`grid ${activeConfig.button1Text && activeConfig.button2Text ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5 sm:gap-3 pt-2`}>
              {activeConfig.button1Text && (
                <button
                  type="button"
                  onClick={() => navigate(activeConfig.button1Link || '/shop/women')}
                  className="bg-neutral-800/85 hover:bg-neutral-700/90 active:bg-white active:text-black text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] py-3 px-3 transition-all duration-200 border border-white/10 hover:border-white/30 cursor-pointer shadow-sm truncate"
                >
                  {activeConfig.button1Text}
                </button>
              )}

              {activeConfig.button2Text && (
                <button
                  type="button"
                  onClick={() => navigate(activeConfig.button2Link || '/shop/men')}
                  className="bg-neutral-800/85 hover:bg-neutral-700/90 active:bg-white active:text-black text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] py-3 px-3 transition-all duration-200 border border-white/10 hover:border-white/30 cursor-pointer shadow-sm truncate"
                >
                  {activeConfig.button2Text}
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
