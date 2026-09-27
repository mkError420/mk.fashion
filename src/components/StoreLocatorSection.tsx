import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Navigation, ArrowRight } from 'lucide-react';
import { useFrontendData } from '../context/FrontendDataContext';
import { getActiveOutletsConfig } from '../utils/outletsConfig';

export const StoreLocatorSection: React.FC = () => {
  const { settings } = useFrontendData();

  const config = useMemo(() => getActiveOutletsConfig(
    // wrap settings values in the shape getActiveOutletsConfig expects
    Object.fromEntries(
      Object.entries(settings).map(([k, v]) => [k, { value: v, type: 'text', category: 'general', description: '' }])
    )
  ), [settings]);

  // If admin has disabled the section, hide it
  if (!config.enabled) return null;

  const activeOutlets = config.outlets.filter(o => o.isActive).sort((a, b) => a.order - b.order);

  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">

      {/* Top Banner */}
      <div className="bg-neutral-100 border border-neutral-200 p-6 sm:p-10 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-black text-white inline-block mb-2">
              {config.sectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              {config.sectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              {config.sectionDescription}
            </p>
          </div>

          <Link
            to={config.buttonLink || '/outlets'}
            className="inline-flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3.5 rounded-none uppercase tracking-widest transition-all flex-shrink-0"
          >
            <span>{config.buttonText}</span>
            <Navigation className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Outlets Grid */}
      {activeOutlets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeOutlets.map((outlet) => (
            <div
              key={outlet.id}
              className="bg-white border border-neutral-200 hover:border-black p-5 flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                {outlet.tag && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200/60 inline-block mb-2">
                    {outlet.tag}
                  </span>
                )}
                <h3 className="font-bold text-base text-neutral-900 group-hover:text-black font-serif">
                  {outlet.name}
                </h3>
                <div className="mt-3 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                    <span>{outlet.area || outlet.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <span>{outlet.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-500">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <span>{outlet.hours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-900 transition-colors">
                  Directions & Hours
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded">
          No active outlets configured.
        </div>
      )}

    </section>
  );
};
