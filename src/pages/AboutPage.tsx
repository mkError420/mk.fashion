import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, ShieldCheck, Heart, ArrowRight, ChevronRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Breadcrumb */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-4 border-b border-neutral-100">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">About Blucheez</span>
        </nav>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-neutral-950 text-white py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80"
            alt="Blucheez Atelier"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded bg-white text-black inline-block">
            Modern Bengali Sartorial Craft
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
            Redefining Bangladeshi Luxury Menswear & Heritage
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Blucheez was founded with a singular conviction: to create world-class garments celebrating Bangladesh's rich textile heritage while adhering to international standards of precision cut and contemporary tailoring.
          </p>
        </div>
      </div>

      {/* Story Sections */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-16 space-y-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              The Philosophy
            </span>
            <h2 className="text-2xl font-serif font-bold text-neutral-900">
              Uncompromising Quality in Every Seam
            </h2>
            <p>
              From our signature 100% fine mercerized cotton Panjabis to our executive non-iron formal shirting, every Blucheez garment undergoes rigorous stress tests, colorfast treatments, and precision pattern cutting.
            </p>
            <p>
              We believe in honest luxury: genuine Egyptian Giza cottons, mother-of-pearl and crested metal buttons, structured plackets, and bespoke fits designed specifically for Bangladeshi silhouettes.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-neutral-200 aspect-4/3">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
          <div className="rounded-2xl overflow-hidden border border-neutral-200 aspect-4/3 order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1610030469668-936ce4489b4f?auto=format&fit=crop&w=800&q=80"
              alt="Belwari Handloom"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed order-1 md:order-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              Belwari Atelier
            </span>
            <h2 className="text-2xl font-serif font-bold text-neutral-900">
              Empowering Bengali Master Weavers
            </h2>
            <p>
              Through our dedicated <strong>Belwari</strong> sub-brand, we champion traditional handloom artisans in Tangail and Narayanganj. By weaving antique metallic zari and authentic Jamdani patterns on wooden shuttle looms, we keep ancestral craft alive.
            </p>
            <p>
              Each Belwari piece is an heirloom — taking up to 30 days of meticulous manual weaving, carrying the artistic soul of Bengal.
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-200">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
            <ShieldCheck className="w-6 h-6 text-black" />
            <h3 className="text-sm font-bold text-neutral-900">100% Cash on Delivery</h3>
            <p className="text-neutral-600">
              Zero advance payment needed across all 64 districts in Bangladesh. Trust is earned at your doorstep.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
            <Heart className="w-6 h-6 text-black" />
            <h3 className="text-sm font-bold text-neutral-900">7-Day Free Exchanges</h3>
            <p className="text-neutral-600">
              Swap sizes or styles at our flagship stores in Banani, Dhanmondi, and Uttara or via door-to-door courier.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
            <Sparkles className="w-6 h-6 text-black" />
            <h3 className="text-sm font-bold text-neutral-900">Luxury Experience Stores</h3>
            <p className="text-neutral-600">
              Spacious fitting lounges, dedicated stylists, and master alteration specialists to ensure your flawless look.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            to="/collections/all"
            className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-8 py-3.5 rounded-full uppercase tracking-wider transition-all inline-flex items-center space-x-2"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
};
