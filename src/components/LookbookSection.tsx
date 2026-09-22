import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ShoppingBag, ArrowUpRight } from 'lucide-react';

interface LookbookItem {
  id: string;
  image: string;
  author: string;
  productName: string;
  price: number;
  category: string;
  sub: string;
}

const LOOKS: LookbookItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    author: '@blucheez.men',
    productName: 'Royal Obsidian Panjabi with Metal Crest',
    price: 3450,
    category: 'men',
    sub: 'Exclusive Panjabi'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    author: '@belwari.heritage',
    productName: 'Sonargaon Golden Zari Jamdani Saree',
    price: 8950,
    category: 'belwari',
    sub: 'Belwari Jamdani Saree'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    author: '@summer.breeze',
    productName: 'Retro Open-Knit Sweater Polo - Sage',
    price: 2450,
    category: 'summer',
    sub: 'Sweater Polos'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    author: '@blacksociety.bd',
    productName: 'Double Breasted Structured Wool Blazer',
    price: 7950,
    category: 'blucheez-black',
    sub: 'Executive Wool Blazers'
  }
];

export const LookbookSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-4 mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Instagram className="w-4 h-4 text-black" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">
              #BlucheezStyle & #BelwariStories
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif mt-1">
            Shop The Look & Community Editorial
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Tag @blucheez.fashion on Instagram to be featured on our official global lookbook.
          </p>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors group"
        >
          <span>Follow @blucheez.fashion</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* Grid of Looks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {LOOKS.map((look) => (
          <div
            key={look.id}
            className="group relative bg-neutral-900 overflow-hidden border border-neutral-200 hover:border-black transition-all"
          >
            {/* Image */}
            <div className="relative aspect-3/4 overflow-hidden">
              <img
                src={look.image}
                alt={look.productName}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>

            {/* Top Author Tag */}
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 border border-white/20">
                {look.author}
              </span>
            </div>

            {/* Bottom Product Overlay Card */}
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 text-black border border-neutral-200 backdrop-blur-xs transition-all">
              <p className="text-xs font-bold font-sans uppercase line-clamp-1">
                {look.productName}
              </p>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-neutral-100">
                <span className="text-xs font-extrabold">৳{look.price.toLocaleString()}</span>
                <Link
                  to={`/shop/${look.category}?sub=${encodeURIComponent(look.sub)}`}
                  className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider text-black hover:underline"
                >
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  <span>Shop Item</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
