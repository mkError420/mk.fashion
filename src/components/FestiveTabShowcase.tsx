import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useFrontendData } from '../context/FrontendDataContext';
import { ProductCard } from './ProductCard';
import { DEFAULT_FESTIVE_CONFIG, FestiveConfig } from './admin/FestiveManagement';

export const FestiveTabShowcase: React.FC = () => {
  const { products } = useShop();
  const { settings } = useFrontendData();

  // Compute active configuration combining Database settings and localStorage
  const activeConfig: FestiveConfig = useMemo(() => {
    const dbEnabled = settings['festive_enabled'];
    const dbBadge = settings['festive_badge'];
    const dbHeading = settings['festive_showcase_heading'];
    const dbFilter = settings['festive_products_filter'];
    const dbCount = settings['festive_products_count'];
    const dbExploreText = settings['festive_explore_text'];
    const dbExploreLink = settings['festive_explore_link'];

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
      bannerImage: settings['festive_banner_image'] || localConfig.bannerImage || DEFAULT_FESTIVE_CONFIG.bannerImage,
      badge: dbBadge !== undefined ? dbBadge : (localConfig.badge !== undefined ? localConfig.badge : DEFAULT_FESTIVE_CONFIG.badge),
      title: settings['festive_title'] || localConfig.title || DEFAULT_FESTIVE_CONFIG.title,
      subtitle: settings['festive_subtitle'] || localConfig.subtitle || DEFAULT_FESTIVE_CONFIG.subtitle,
      button1Text: settings['festive_btn1_text'] || localConfig.button1Text || DEFAULT_FESTIVE_CONFIG.button1Text,
      button1Link: settings['festive_btn1_link'] || localConfig.button1Link || DEFAULT_FESTIVE_CONFIG.button1Link,
      button2Text: settings['festive_btn2_text'] || localConfig.button2Text || DEFAULT_FESTIVE_CONFIG.button2Text,
      button2Link: settings['festive_btn2_link'] || localConfig.button2Link || DEFAULT_FESTIVE_CONFIG.button2Link,
      showcaseHeading: dbHeading !== undefined ? dbHeading : (localConfig.showcaseHeading !== undefined ? localConfig.showcaseHeading : DEFAULT_FESTIVE_CONFIG.showcaseHeading),
      productsFilter: dbFilter || localConfig.productsFilter || DEFAULT_FESTIVE_CONFIG.productsFilter,
      productsCount: dbCount ? parseInt(dbCount, 10) : (localConfig.productsCount || DEFAULT_FESTIVE_CONFIG.productsCount),
      exploreText: dbExploreText || localConfig.exploreText || DEFAULT_FESTIVE_CONFIG.exploreText,
      exploreLink: dbExploreLink || localConfig.exploreLink || DEFAULT_FESTIVE_CONFIG.exploreLink,
      overlayDarkness: (settings['festive_overlay_darkness'] as any) || localConfig.overlayDarkness || DEFAULT_FESTIVE_CONFIG.overlayDarkness,
    };
  }, [settings]);

  // If section is disabled in admin dashboard, hide product showcase
  if (!activeConfig.enabled) {
    return null;
  }

  // Filter products based on admin selection
  const filterKey = (activeConfig.productsFilter || 'all').toLowerCase();
  const filteredProducts = products.filter(p => {
    if (filterKey === 'men') {
      return p.gender === 'men' || p.category === 'men';
    }
    if (filterKey === 'women') {
      return p.gender === 'women' || p.category === 'women';
    }
    if (filterKey === 'belwari') {
      return p.category === 'belwari';
    }
    // 'all' or default: Curate high-impact festive items spanning Men's, Women's & Belwari
    return p.gender === 'men' || p.gender === 'women' || p.category === 'men' || p.category === 'women' || p.category === 'belwari';
  });

  const displayedProducts = (filteredProducts.length > 0 ? filteredProducts : products)
    .slice(0, activeConfig.productsCount || 12);

  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Optional Top Section Heading */}
      {activeConfig.showcaseHeading && (
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-neutral-300"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-neutral-500 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {activeConfig.badge || 'CURATED DROPS'}
            </span>
            <span className="w-8 h-[1px] bg-neutral-300"></span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-tight text-neutral-900">
            {activeConfig.showcaseHeading}
          </h2>
        </div>
      )}

      {/* Product Grid - Clicking any image redirects directly to the Shop page with its category and subcategory */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {displayedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            redirectToCategory={true} 
          />
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 text-center pt-6 border-t border-neutral-100">
        <Link
          to={activeConfig.exploreLink || '/shop'}
          className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold px-8 py-3.5 rounded-none uppercase tracking-widest transition-all shadow-xs"
        >
          <span>{activeConfig.exploreText || 'Explore More'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
