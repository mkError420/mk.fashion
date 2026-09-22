import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryType } from '../types';

interface Slide {
  id: number;
  tagline: string;
  title: string;
  bengaliTitle: string;
  description: string;
  ctaText: string;
  category: CategoryType;
  subcategory?: string;
  image: string;
  badge: string;
  highlightText: string;
}

export const HeroSlider: React.FC = () => {
  const navigate = useNavigate();
  const { updateFilter } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      tagline: 'Eid & Festive Drop 2026',
      title: 'Men’s Essential & Exclusive Panjabi',
      bengaliTitle: 'ব্লুচিজ এক্সক্লুসিভ পাঞ্জাবি কালেকশন',
      description: 'Crafted with fine mercerized Egyptian cotton, contemporary plackets, and custom crest buttons. Designed for modern Bangladeshi gentlemen.',
      ctaText: 'Shop Panjabi Collection',
      category: 'men',
      subcategory: 'Exclusive Panjabi',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85',
      badge: 'Cash on Delivery Available',
      highlightText: 'Starting from ৳3,450'
    },
    {
      id: 2,
      tagline: 'The Monochrome Atelier',
      title: 'Blucheez | Black Society',
      bengaliTitle: 'ব্লুচিজ ব্ল্যাক লাক্সারি এডিশন',
      description: 'The pinnacle of dark elegance. Signature matte black panjabis, executive wool blazers, and dramatic flared anarkalis.',
      ctaText: 'Explore Blucheez Black',
      category: 'blucheez-black',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85',
      badge: 'Black Label Exclusive',
      highlightText: 'Pure Tailored Monochrome'
    },
    {
      id: 3,
      tagline: 'Belwari Atelier Heritage',
      title: 'Handcrafted Jamdani & Resham Silk',
      bengaliTitle: 'বেলওয়ারী হেরিটেজ জামদানি ও থ্রি-পিস',
      description: 'Handwoven by master artisans with antique zari borders and ethereal geometric motifs celebrating authentic royal Bengali heritage.',
      ctaText: 'Discover Belwari',
      category: 'belwari',
      image: 'https://images.unsplash.com/photo-1610030469668-936ce4489b4f?auto=format&fit=crop&w=1800&q=85',
      badge: 'Belwari Royal Heritage',
      highlightText: '100% Handloom Certified'
    },
    {
      id: 4,
      tagline: 'Summer Breeze Drop',
      title: 'Sweater Polos & Drop-Shoulder Tees',
      bengaliTitle: 'সামার নিট সোয়েটার পোলো',
      description: 'Airy open-gauge cotton knits, button-through retro collars, and boxy drop-shoulder proportions designed for tropical ease.',
      ctaText: 'Shop Summer Polos',
      category: 'summer',
      subcategory: 'Sweater Polos',
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1800&q=85',
      badge: 'Summer 2026 Trending',
      highlightText: 'Lightweight Breathable'
    }
  ];

  // Auto slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleCtaClick = (category: CategoryType, subcategory?: string) => {
    updateFilter('category', category);
    updateFilter('subcategory', subcategory);
    if (category === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${category}${subcategory ? `?sub=${encodeURIComponent(subcategory)}` : ''}`);
    }
  };

  const active = slides[currentSlide];

  return (
    <div className="relative bg-neutral-950 text-white overflow-hidden select-none">
      
      {/* Background Slides */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[580px] w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center brightness-60 scale-105 transition-transform duration-10000"
            />
            
            {/* Sophisticated Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center w-full">
          <div className="max-w-2xl py-8 sm:py-12 pr-6 sm:pr-0">
            
            {/* Tagline / Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-4">
              <span className="text-[9px] sm:text-xs uppercase tracking-widest font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white text-black">
                {active.badge}
              </span>
              <span className="text-[11px] sm:text-sm text-neutral-300 font-semibold tracking-wide">
                {active.tagline}
              </span>
            </div>

            {/* Bengali Accent Title */}
            <span className="text-[11px] sm:text-sm text-neutral-300 block mb-1 font-medium">
              {active.bengaliTitle}
            </span>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight text-white leading-tight mb-3 sm:mb-4 break-words">
              {active.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base text-neutral-300 mb-4 sm:mb-8 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
              {active.description}
            </p>

            {/* CTA & Highlights */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => handleCtaClick(active.category, active.subcategory)}
                className="bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full transition-all flex items-center space-x-2 shadow-lg cursor-pointer active:scale-95 uppercase tracking-wider"
              >
                <span>{active.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div className="text-[11px] sm:text-sm text-neutral-300 pl-2 border-l border-neutral-700">
                <span className="block text-white font-bold">{active.highlightText}</span>
                <span className="text-[10px] sm:text-[11px] text-neutral-400">Zero advance COD</span>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 transition-colors backdrop-blur-xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 transition-colors backdrop-blur-xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
