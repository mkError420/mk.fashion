import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Navigation, ArrowRight } from 'lucide-react';

const OUTLETS = [
  {
    name: 'Banani Flagship Store',
    area: 'Road 11, Block D, Banani, Dhaka',
    phone: '+880 1700-000001',
    hours: '10:00 AM - 10:00 PM (Everyday)',
    tag: 'Flagship & Alteration Studio'
  },
  {
    name: 'Dhanmondi Experience Store',
    area: 'Road 27 (Old), Dhanmondi, Dhaka',
    phone: '+880 1700-000002',
    hours: '10:30 AM - 9:30 PM (Everyday)',
    tag: 'Belwari Atelier & Men’s Lounge'
  },
  {
    name: 'Uttara Sector 3 Store',
    area: 'Rabindra Sarani, Sector 3, Uttara, Dhaka',
    phone: '+880 1700-000003',
    hours: '10:00 AM - 9:30 PM (Everyday)',
    tag: 'Full Catalog & Fitting Suites'
  },
  {
    name: 'Jamuna Future Park (JFP)',
    area: 'Level 2, Block C, Kuril, Dhaka',
    phone: '+880 1700-000004',
    hours: '11:00 AM - 9:00 PM (Wed Closed)',
    tag: 'Mall Experience Center'
  }
];

export const StoreLocatorSection: React.FC = () => {
  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      
      {/* Top Banner */}
      <div className="bg-neutral-100 border border-neutral-200 p-6 sm:p-10 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-black text-white inline-block mb-2">
              Retail Experience Centers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Visit Blucheez Outlets in Dhaka & Chattogram
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              Step inside our boutique flagships to feel our Egyptian mercerized cottons, Jamdani handloom drapes, receive bespoke size measurements, or claim instant in-store exchanges.
            </p>
          </div>

          <Link
            to="/outlets"
            className="inline-flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3.5 rounded-none uppercase tracking-widest transition-all flex-shrink-0"
          >
            <span>View All Outlets on Map</span>
            <Navigation className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {OUTLETS.map((outlet, index) => (
          <div
            key={index}
            className="bg-white border border-neutral-200 hover:border-black p-5 flex flex-col justify-between transition-all duration-200 group"
          >
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200/60 inline-block mb-2">
                {outlet.tag}
              </span>
              <h3 className="font-bold text-base text-neutral-900 group-hover:text-black font-serif">
                {outlet.name}
              </h3>
              <div className="mt-3 space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                  <span>{outlet.area}</span>
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

    </section>
  );
};
