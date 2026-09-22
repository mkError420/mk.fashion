import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  Truck, 
  Banknote,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-neutral-400 pt-16 pb-24 md:pb-12 border-t border-neutral-800 w-full">
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto">
        
        {/* Top Courier Partners Banner */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-none p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-3 rounded-none bg-white text-black">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-sans uppercase tracking-wider font-extrabold text-sm sm:text-base">
                Doorstep Cash on Delivery Nationwide
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Fast shipping across all 64 districts of Bangladesh powered by leading logistics partners
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1.5 rounded-none bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
              Steadfast Courier
            </span>
            <span className="px-3 py-1.5 rounded-none bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
              Pathao Logistics
            </span>
            <span className="px-3 py-1.5 rounded-none bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
              RedX Delivery
            </span>
            <span className="px-3 py-1.5 rounded-none bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
              Paperfly
            </span>
            
            <Link
              to="/track"
              className="bg-white hover:bg-neutral-200 text-black text-xs font-bold px-4 py-2 rounded-none transition-colors cursor-pointer uppercase tracking-wider"
            >
              Track Any Parcel
            </Link>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Link to="/" className="inline-flex items-center space-x-1.5 group">
                <span className="text-2xl font-black text-white tracking-widest font-sans uppercase">
                  BLUCHEEZ
                </span>
                <span className="bg-white text-black text-[10px] px-1.5 py-0.5 rounded-none font-sans uppercase font-bold">
                  .FASHION
                </span>
              </Link>
              <p className="text-xs text-neutral-400 font-medium mt-1 uppercase tracking-wider">
                Modern Lifestyle & Heritage Atelier
              </p>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Blucheez is a premium lifestyle fashion brand offering comfortable, high-street and artisan-crafted apparel tailored for Bangladesh. From our signature <strong>Blucheez | Black</strong> society label to the regal handlooms of <strong>Belwari</strong> and contemporary summer knitwear.
            </p>

            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-neutral-300" />
                <span>Customer Care: <strong className="text-neutral-200">09613-258248</strong> (10:00 AM - 10:00 PM)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-neutral-300" />
                <span>Email: support@blucheez.fashion</span>
              </div>
              <div className="flex items-center space-x-2">
                <Banknote className="w-3.5 h-3.5 text-neutral-300" />
                <span>Payment: 100% Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-white font-sans uppercase tracking-wider font-bold text-xs mb-4">
              Categories
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop/new-in" className="hover:text-white transition-colors">
                  NEW IN (Eid & Festive)
                </Link>
              </li>
              <li>
                <Link to="/shop/summer" className="hover:text-white transition-colors">
                  SUMMER 2026 Collection
                </Link>
              </li>
              <li>
                <Link to="/shop/blucheez-black" className="hover:text-white transition-colors">
                  BLUCHEEZ | BLACK
                </Link>
              </li>
              <li>
                <Link to="/shop/belwari" className="hover:text-white transition-colors">
                  BELWARI Heritage Handloom
                </Link>
              </li>
              <li>
                <Link to="/shop/men?sub=Exclusive+Panjabi" className="hover:text-white transition-colors">
                  Men's Panjabi & Kabli
                </Link>
              </li>
              <li>
                <Link to="/shop/men?sub=Sweater+Polos" className="hover:text-white transition-colors">
                  Sweater Polos & Boxy Tees
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Dhaka Experience Centers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-white font-sans uppercase tracking-wider font-bold text-xs">
                Blucheez Outlets
              </h5>
              <Link to="/outlets" className="text-[10px] text-neutral-400 hover:text-white underline">
                View All
              </Link>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/outlets" className="hover:text-white block">
                  <strong className="text-neutral-200 block">Banani Experience Center</strong>
                  House 42, Road 11, Block D, Banani
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="hover:text-white block">
                  <strong className="text-neutral-200 block">Dhanmondi Flagship</strong>
                  Satmasjid Road (Near Road 27)
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="hover:text-white block">
                  <strong className="text-neutral-200 block">Uttara Outlet</strong>
                  Sector 3, Rabindra Sarani
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="hover:text-white block">
                  <strong className="text-neutral-200 block">Jamuna Future Park</strong>
                  Ground Floor, Kuril, Dhaka
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Policies */}
          <div>
            <h5 className="text-white font-sans uppercase tracking-wider font-bold text-xs mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/track" className="hover:text-white transition-colors flex items-center">
                  <Truck className="w-3.5 h-3.5 mr-1 text-neutral-300" />
                  Track Live Consignment
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-white transition-colors">
                  Cash on Delivery Checkout
                </Link>
              </li>
              <li>
                <Link to="/exchange-policy" className="hover:text-white transition-colors">
                  7-Day Hassle-Free Size Exchange
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Blucheez Atelier
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="hover:text-white transition-colors">
                  Store Hours & Locations
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Blucheez.fashion. Modern Lifestyle & Heritage Atelier. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Nationwide Fast Dispatch</span>
            <span>•</span>
            <span>Zero Advance Payment</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
