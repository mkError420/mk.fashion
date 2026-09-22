import React from 'react';
import { useNavigate } from 'react-router-dom';
import festiveBannerImg from '../assets/images/festive_demi_couture_banner_1789977402137.jpg';

export const FestivalBanner: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const yearSuffix = String(currentYear).slice(-2);

  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-0 lg:px-0 py-2 md:py-0 select-none">
      <div className="relative w-full overflow-hidden bg-neutral-900 border border-neutral-200/60 md:border-x-0 md:border-y shadow-lg min-h-[380px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[640px] xl:min-h-[700px] flex items-center">
        
        {/* Full-Width Editorial Background Image */}
        <img
          src={festiveBannerImg}
          alt="Festive Demi-Couture Collection"
          className="absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-center select-none"
        />

        {/* Ambient Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 sm:hidden pointer-events-none" />

        {/* Floating Luxury Demi-Couture Card Container (Aligned in standard container width) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 flex justify-end">
          <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] bg-black/45 backdrop-blur-md border border-white/20 p-6 sm:p-8 text-center text-white shadow-2xl transition-all duration-300 hover:bg-black/55">
            
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
                  fontSize="46" 
                  fontStyle="italic" 
                  fontWeight="400" 
                  fill="currentColor"
                  letterSpacing="1"
                >
                  Festive
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
                DEMI-COUTURE COLLECTION-{yearSuffix}
              </p>
            </div>

            {/* Gender Action Buttons: FOR HER & FOR HIM */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/shop/women')}
                className="bg-neutral-800/85 hover:bg-neutral-700/90 active:bg-white active:text-black text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] py-3 px-3 transition-all duration-200 border border-white/10 hover:border-white/30 cursor-pointer shadow-sm"
              >
                FOR HER
              </button>

              <button
                type="button"
                onClick={() => navigate('/shop/men?sub=Exclusive%20Panjabi')}
                className="bg-neutral-800/85 hover:bg-neutral-700/90 active:bg-white active:text-black text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] py-3 px-3 transition-all duration-200 border border-white/10 hover:border-white/30 cursor-pointer shadow-sm"
              >
                FOR HIM
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
