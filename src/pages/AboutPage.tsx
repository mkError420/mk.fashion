import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, ArrowRight, ChevronRight } from 'lucide-react';
import { useFrontendData } from '../context/FrontendDataContext';
import { getActiveAboutConfig } from '../components/admin/PagesManagement';

export const AboutPage: React.FC = () => {
  const { settings } = useFrontendData();

  const config = useMemo(() => getActiveAboutConfig(
    Object.fromEntries(
      Object.entries(settings).map(([k, v]) => [k, { value: v, type: 'text', category: 'pages', description: '' }])
    )
  ), [settings]);

  const PILLAR_ICONS: Record<string, React.ReactNode> = {
    shield: <ShieldCheck className="w-6 h-6 text-black" />,
    heart:  <Heart className="w-6 h-6 text-black" />,
    sparkles: <Sparkles className="w-6 h-6 text-black" />,
  };

  const pillars = [
    { icon: config.pillar1Icon, title: config.pillar1Title, text: config.pillar1Text },
    { icon: config.pillar2Icon, title: config.pillar2Title, text: config.pillar2Text },
    { icon: config.pillar3Icon, title: config.pillar3Title, text: config.pillar3Text },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* Breadcrumb */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-4 border-b border-neutral-100">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">About Us</span>
        </nav>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-neutral-950 text-white py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden">
        {config.heroImage && (
          <div className="absolute inset-0 opacity-30">
            <img
              src={config.heroImage}
              alt="About Hero"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative max-w-3xl mx-auto text-center space-y-4">
          {config.badge && (
            <span className="text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded bg-white text-black inline-block">
              {config.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
            {config.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            {config.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Story Sections */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-16 space-y-16">

        {/* Block 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              {config.block1Label}
            </span>
            <h2 className="text-2xl font-serif font-bold text-neutral-900">
              {config.block1Title}
            </h2>
            {config.block1Para1 && <p>{config.block1Para1}</p>}
            {config.block1Para2 && <p>{config.block1Para2}</p>}
          </div>
          {config.block1Image && (
            <div className="rounded-2xl overflow-hidden border border-neutral-200 aspect-4/3">
              <img src={config.block1Image} alt={config.block1Title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Block 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {config.block2Image && (
            <div className="rounded-2xl overflow-hidden border border-neutral-200 aspect-4/3 order-2 md:order-1">
              <img src={config.block2Image} alt={config.block2Title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed order-1 md:order-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              {config.block2Label}
            </span>
            <h2 className="text-2xl font-serif font-bold text-neutral-900">
              {config.block2Title}
            </h2>
            {config.block2Para1 && <p>{config.block2Para1}</p>}
            {config.block2Para2 && <p>{config.block2Para2}</p>}
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-200">
          {pillars.map((pillar, i) => (
            <div key={i} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
              {PILLAR_ICONS[pillar.icon] || <ShieldCheck className="w-6 h-6 text-black" />}
              <h3 className="text-sm font-bold text-neutral-900">{pillar.title}</h3>
              <p className="text-neutral-600">{pillar.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {config.ctaText && (
          <div className="text-center pt-8">
            <Link
              to={config.ctaLink || '/collections/all'}
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-8 py-3.5 rounded-full uppercase tracking-wider transition-all inline-flex items-center space-x-2"
            >
              <span>{config.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>

    </div>
  );
};
