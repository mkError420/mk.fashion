import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { BigProductCard } from './BigProductCard';
import { HorizontalProductCard } from './HorizontalProductCard';

export const TopSellingSection: React.FC = () => {
  const { products } = useShop();

  const currentYear = new Date().getFullYear();

  // Get the top 8 selling / most popular products
  const topSellingProducts = [...products]
    .sort((a, b) => {
      const salesA = a.salesCount ?? (a.reviewCount * 2.5);
      const salesB = b.salesCount ?? (b.reviewCount * 2.5);
      return salesB - salesA;
    })
    .slice(0, 8);

  // Group into 2 clusters of 4 items each: [1 Big + 3 Small] = 8 items total
  const clusters = [
    {
      big: topSellingProducts[0],
      small: [topSellingProducts[1], topSellingProducts[2], topSellingProducts[3]],
      align: 'left',
      bigRank: 1,
    },
    {
      big: topSellingProducts[4],
      small: [topSellingProducts[5], topSellingProducts[6], topSellingProducts[7]],
      align: 'right',
      bigRank: 5,
    },
  ];

  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 bg-neutral-900 text-white flex items-center space-x-1">
              <Flame className="w-3 h-3 text-amber-400 mr-0.5" />
              <span>TOP SELLING</span>
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              সর্বাধিক বিক্রিত কালেকশন • Best of {currentYear}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
            Top 8 Best Sellers
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Editorial showcase curated in 1-Big & 3-Small display format.
          </p>
        </div>

        <Link
          to="/shop?sort=bestseller"
          className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors group flex-shrink-0"
        >
          <span>View All Top Sellers</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 1. MD & LG SCREEN LAYOUT: EDITORIAL "1 BIG & 3 SMALL" SYSTEM */}
      {/* ============================================================ */}
      <div className="hidden md:flex flex-col gap-10">
        {clusters.map((cluster, clusterIdx) => {
          if (!cluster.big || cluster.small.length < 3) return null;

          const bigCardElement = (
            <div className="h-[580px] w-full">
              <BigProductCard product={cluster.big} rank={cluster.bigRank} />
            </div>
          );

          const threeSmallCardsElement = (
            <div className="grid grid-rows-3 gap-4 h-[580px] w-full">
              {cluster.small.map((prod) => (
                <div key={prod.id} className="h-full w-full min-h-0">
                  <HorizontalProductCard product={prod} />
                </div>
              ))}
            </div>
          );

          return (
            <div key={`cluster-${clusterIdx}`} className="grid grid-cols-2 gap-6 items-stretch">
              {cluster.align === 'left' ? (
                <>
                  {bigCardElement}
                  {threeSmallCardsElement}
                </>
              ) : (
                <>
                  {threeSmallCardsElement}
                  {bigCardElement}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 2. MOBILE SCREEN LAYOUT (< MD): BALANCED 2-COLUMN GRID        */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:hidden">
        {topSellingProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA Action */}
      <div className="mt-10 text-center pt-6 border-t border-neutral-100">
        <Link
          to="/shop?sort=bestseller"
          className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold px-8 py-3.5 uppercase tracking-widest transition-all shadow-xs"
        >
          <span>Explore All {currentYear} Best Sellers</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
