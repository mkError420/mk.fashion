import React from 'react';
import { HeroVideo } from '../components/HeroVideo';
import { StoryCategoryBar } from '../components/StoryCategoryBar';
import { NewArrivalsSection } from '../components/NewArrivalsSection';
import { TopSellingSection } from '../components/TopSellingSection';
import { FestivalBanner } from '../components/FestivalBanner';
import { FestiveTabShowcase } from '../components/FestiveTabShowcase';
import { StoreLocatorSection } from '../components/StoreLocatorSection';
import { VipClubVoucher } from '../components/VipClubVoucher';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* 1. EDITORIAL HERO VIDEO CAMPAIGN */}
      <HeroVideo />

      {/* 2. SPOTLIGHT STORY / CATEGORY TICKER */}
      <StoryCategoryBar />

      {/* 3. NEW ARRIVALS (LAST 12 ITEMS) */}
      <NewArrivalsSection />

      {/* 4. TOP SELLING (TOP 16 ITEMS) */}
      <TopSellingSection />

      {/* 5. EID FESTIVAL DEMI-COUTURE BANNER */}
      <FestivalBanner />

      {/* 6. EID & FESTIVE 2026 CURATIONS & NEW DROPS */}
      <FestiveTabShowcase />

      {/* 7. FLAGSHIP EXPERIENCE CENTERS & OUTLET LOCATOR */}
      <StoreLocatorSection />

      {/* 8. VIP CLUB PROMO VOUCHER & WHATSAPP CONCIERGE */}
      <VipClubVoucher />

    </div>
  );
};
