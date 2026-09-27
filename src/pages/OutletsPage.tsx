import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Navigation, CheckCircle2, ChevronRight, Store } from 'lucide-react';
import { useFrontendData } from '../context/FrontendDataContext';
import { getActiveOutletsConfig } from '../utils/outletsConfig';

export const OutletsPage: React.FC = () => {
  const { settings } = useFrontendData();

  const config = useMemo(() => getActiveOutletsConfig(
    Object.fromEntries(
      Object.entries(settings).map(([k, v]) => [k, { value: v, type: 'text', category: 'general', description: '' }])
    )
  ), [settings]);

  const activeOutlets = config.outlets
    .filter(o => o.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-4 border-b border-neutral-100">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">Store Outlets</span>
        </nav>
      </div>

      {/* Hero Header */}
      <div className="bg-neutral-950 text-white py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-white text-black inline-block">
            {config.pageBadge}
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight">
            {config.pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            {config.pageDescription}
          </p>
        </div>
      </div>

      {/* Outlets List */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-8 max-w-4xl">

        {/* Count badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {activeOutlets.length} Active {activeOutlets.length === 1 ? 'Location' : 'Locations'}
            </span>
          </div>
        </div>

        {activeOutlets.length > 0 ? (
          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden">
            {activeOutlets.map((outlet, index) => (
              <div
                key={outlet.id}
                className="flex flex-col sm:flex-row bg-white hover:bg-neutral-50 transition-colors"
              >
                {/* Left: Image */}
                <div className="sm:w-44 md:w-52 h-44 sm:h-auto flex-shrink-0 relative overflow-hidden bg-neutral-100">
                  <img
                    src={outlet.image}
                    alt={outlet.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Number badge */}
                  <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-extrabold shadow">
                    {index + 1}
                  </div>
                  {/* Tag badge */}
                  {outlet.tag && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                        {outlet.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    {/* Name */}
                    <div className="mb-3">
                      {outlet.bengaliName && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                          {outlet.bengaliName}
                        </p>
                      )}
                      <h2 className="text-base sm:text-lg font-bold font-serif text-neutral-900">
                        {outlet.name}
                      </h2>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-1.5 text-xs text-neutral-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-neutral-800">{outlet.address}</span>
                          {outlet.landmark && (
                            <span className="text-neutral-500"> — {outlet.landmark}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                        <span>{outlet.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                        <a href={`tel:${outlet.phone}`} className="hover:underline font-mono text-neutral-800 font-semibold">
                          {outlet.phone}
                        </a>
                      </div>
                    </div>

                    {/* Features */}
                    {outlet.features && outlet.features.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {outlet.features.map((feat, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Maps Button */}
                  <div className="mt-4">
                    <a
                      href={outlet.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(outlet.name + ' ' + outlet.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded-2xl">
            No active store outlets configured. Please check back later.
          </div>
        )}

      </div>
    </div>
  );
};
