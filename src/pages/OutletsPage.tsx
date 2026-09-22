import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Navigation, CheckCircle2, ChevronRight, Store } from 'lucide-react';

interface OutletInfo {
  name: string;
  bengaliName: string;
  address: string;
  landmark: string;
  phone: string;
  hours: string;
  features: string[];
  image: string;
}

const OUTLETS: OutletInfo[] = [
  {
    name: 'Blucheez Banani Flagship Atelier',
    bengaliName: 'বনানী ফ্ল্যাগশিপ শো-রুম',
    address: 'House 42, Road 11, Block D, Banani, Dhaka-1213',
    landmark: 'Opposite to Star Cineplex Banani',
    phone: '+880 1711-234567',
    hours: '10:00 AM – 10:00 PM (Open 7 Days)',
    features: ['Exclusive Belwari Handloom Section', 'Bespoke Suiting & Master Tailor', 'Instant 7-Day Exchange Hub', 'VIP Fitting Lounge'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Blucheez Dhanmondi Store',
    bengaliName: 'ধানমন্ডি এক্সপেরিয়েন্স সেন্টার',
    address: 'Plot 79, Satmasjid Road (Near Road 27), Dhanmondi, Dhaka-1209',
    landmark: 'Near Genetic Plaza & Star Kabab',
    phone: '+880 1711-234568',
    hours: '10:00 AM – 10:00 PM (Open 7 Days)',
    features: ['Full Panjabi & Kabli Showcase', 'Summer Knitwear Bar', 'Online Order Pickup & Exchange'],
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Blucheez Uttara Experience Center',
    bengaliName: 'উত্তরা ফ্ল্যাগশিপ আউটলেট',
    address: 'Sector 3, Rabindra Sarani, Uttara, Dhaka-1230',
    landmark: 'Beside North Tower & Mascot Plaza',
    phone: '+880 1711-234569',
    hours: '10:00 AM – 10:00 PM (Open 7 Days)',
    features: ['Eid Festive Special Gallery', 'On-Spot Alteration Service', 'Cash on Delivery Collection Point'],
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Blucheez Jamuna Future Park',
    bengaliName: 'যমুনা ফিউচার পার্ক আউটলেট',
    address: 'Shop 1A-024, Ground Floor, Jamuna Future Park, Kuril, Dhaka-1229',
    landmark: 'Near Central Atrium East Court',
    phone: '+880 1711-234570',
    hours: '11:00 AM – 09:30 PM (Closed Wednesdays)',
    features: ['Blucheez | Black Society Zone', 'Express Gift Packaging', 'Card & bKash Acceptance'],
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'
  }
];

export const OutletsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Breadcrumb */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-4 border-b border-neutral-100">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">Store Outlets</span>
        </nav>
      </div>

      {/* Hero Header */}
      <div className="bg-neutral-950 text-white py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-white text-black inline-block">
            Dhaka Experience Centers
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight">
            Visit Blucheez Outlets in Dhaka
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            Experience the tactile craftsmanship of fine mercerized cotton, authentic Belwari silk sarees, and custom tailoring consultations in person.
          </p>
        </div>
      </div>

      {/* Outlets Grid */}
      <div className="w-full max-w-7xl md:max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OUTLETS.map(outlet => (
            <div 
              key={outlet.name}
              className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-neutral-100 overflow-hidden">
                <img
                  src={outlet.image}
                  alt={outlet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-300 block">
                    {outlet.bengaliName}
                  </span>
                  <h3 className="text-lg font-bold font-serif">{outlet.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2 text-neutral-700">
                    <MapPin className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-900">{outlet.address}</p>
                      <p className="text-[11px] text-neutral-500">{outlet.landmark}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-neutral-700">
                    <Clock className="w-4 h-4 text-black flex-shrink-0" />
                    <span>{outlet.hours}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-neutral-700">
                    <Phone className="w-4 h-4 text-black flex-shrink-0" />
                    <a href={`tel:${outlet.phone}`} className="hover:underline font-mono">
                      {outlet.phone}
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <span className="font-bold text-neutral-900 block mb-2 uppercase tracking-wider text-[10px]">
                    In-Store Services
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {outlet.features.map((feat, i) => (
                      <span key={i} className="flex items-center text-[11px] text-neutral-600">
                        <CheckCircle2 className="w-3 h-3 text-black mr-1 flex-shrink-0" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(outlet.name + ' ' + outlet.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold py-2.5 px-4 rounded-xl text-center flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Google Maps Directions</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
