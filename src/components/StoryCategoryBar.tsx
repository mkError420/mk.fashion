import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFrontendData } from '../context/FrontendDataContext';

interface TickerItem {
  id: string;
  name: string;
  bengali: string;
  badge?: string;
  categoryId: string;
}

export const StoryCategoryBar: React.FC = () => {
  const navigate = useNavigate();
  const { categories: dynamicCategories, isLoading } = useFrontendData();
  const [isPaused, setIsPaused] = useState(false);

  const tickerItems = useMemo<TickerItem[]>(() => {
    if (!dynamicCategories || dynamicCategories.length === 0) return [];
    return dynamicCategories
      .filter(
        c =>
          (c.parent_id === null || c.parent_id === 0) &&
          c.show_in_ticker !== 0 &&
          c.show_in_ticker !== false
      )
      .map(c => ({
        id: c.slug || `cat-${c.id}`,
        name: c.name,
        bengali: c.bengali_name || '',
        badge: c.badge,
        categoryId: c.slug || c.id.toString(),
      }));
  }, [dynamicCategories]);

  if (isLoading && tickerItems.length === 0) {
    return (
      <div className="w-full flex items-center overflow-hidden bg-neutral-900" style={{ height: '38px' }}>
        <div className="shrink-0 flex items-center justify-center px-4 bg-red-600 h-full" style={{ minWidth: '110px' }}>
          <span className="text-white text-[11px] font-extrabold tracking-widest uppercase">● SHOP NOW</span>
        </div>
        <div className="flex-1 flex items-center gap-8 px-6 animate-pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-3 w-20 bg-neutral-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (tickerItems.length === 0) return null;

  const loopItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-neutral-900 flex items-stretch overflow-hidden select-none" style={{ height: '38px' }}>

      {/* LEFT BADGE */}
      <div
        className="shrink-0 flex items-center justify-center px-4 bg-red-600 z-10"
        style={{ minWidth: '110px' }}
      >
        <span className="text-white text-[11px] font-extrabold tracking-[0.18em] uppercase whitespace-nowrap">
          ● SHOP NOW
        </span>
      </div>

      <div className="w-px bg-red-400 shrink-0" />

      {/* SCROLLING CONTENT */}
      <div
        className="flex-1 relative overflow-hidden flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none" />

        <div
          className="flex items-center whitespace-nowrap"
          style={{
            animation: 'news-ticker 35s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
            willChange: 'transform',
          }}
        >
          {loopItems.map((item, index) => (
            <React.Fragment key={`${item.id}-${index}`}>
              <button
                type="button"
                onClick={() => navigate(`/shop/${item.categoryId}`)}
                className="inline-flex items-center gap-2 px-1 cursor-pointer group focus:outline-none"
              >
                <span className="text-white text-[12px] font-semibold tracking-wide uppercase group-hover:text-red-400 transition-colors duration-200 whitespace-nowrap">
                  {item.name}
                </span>
                {item.bengali && (
                  <>
                    <span className="text-neutral-600 text-[10px]">|</span>
                    <span
                      className="text-neutral-300 text-[11px] font-normal whitespace-nowrap group-hover:text-red-300 transition-colors duration-200"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {item.bengali}
                    </span>
                  </>
                )}
                {item.badge && (
                  <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
              <span className="text-red-500 mx-5 text-[9px] font-bold shrink-0 select-none">◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
