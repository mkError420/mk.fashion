import React from 'react';
import { Banknote, Truck, RefreshCw, Award } from 'lucide-react';

export const BrandHighlights: React.FC = () => {
  const highlights = [
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      bengali: 'ক্যাশ অন ডেলিভারি',
      desc: 'Pay cash to courier upon inspecting your parcel at your doorstep across all 64 districts.'
    },
    {
      icon: Truck,
      title: 'Live Courier Tracking',
      bengali: 'লাইভ পার্সেল ট্র্যাকিং',
      desc: 'Real-time transit updates powered by Steadfast, Pathao Logistics & RedX.'
    },
    {
      icon: Award,
      title: '100% Authentic Fabric',
      bengali: 'শতভাগ প্রিমিয়াম ফেব্রিক',
      desc: 'Mercerized Egyptian cotton, Sonargaon Jamdani & Super 120s wool blends.'
    },
    {
      icon: RefreshCw,
      title: '7 Days Easy Exchange',
      bengali: 'সহজ এক্সচেঞ্জ পলিসি',
      desc: 'Hassle-free size and product exchanges within 7 business days.'
    }
  ];

  return (
    <section className="bg-neutral-50 border-y border-neutral-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start space-x-3.5 bg-white p-5 rounded-none border border-neutral-200 shadow-xs hover:border-black transition-colors"
              >
                <div className="p-2.5 rounded-none bg-neutral-100 text-black border border-neutral-200 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 tracking-tight font-serif">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-medium text-neutral-500 mb-1">
                    {item.bengali}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

