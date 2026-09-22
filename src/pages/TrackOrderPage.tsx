import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SAMPLE_TRACKING_LIST, generateMockTrackingForOrder } from '../data/mockCourierData';
import { CourierTrackingInfo } from '../types';

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders } = useShop();

  const codeFromUrl = searchParams.get('code') || '';
  const [queryInput, setQueryInput] = useState(codeFromUrl);
  const [activeTracking, setActiveTracking] = useState<CourierTrackingInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const lookupTracking = (query: string) => {
    setErrorMessage('');
    const clean = query.trim();
    if (!clean) return;

    // 1. Check if it matches existing orders in state
    const matchedOrder = orders.find(
      o => (o.tracking && o.tracking.trackingCode.toLowerCase() === clean.toLowerCase()) ||
           o.orderId.toLowerCase() === clean.toLowerCase() ||
           o.customer.phone.includes(clean)
    );

    if (matchedOrder && matchedOrder.tracking) {
      setActiveTracking(matchedOrder.tracking);
      return;
    }

    // 2. Check sample tracking codes from data
    const matchedSample = SAMPLE_TRACKING_LIST.find(
      t => t.trackingCode.toLowerCase() === clean.toLowerCase()
    );

    if (matchedSample) {
      setActiveTracking(matchedSample);
      return;
    }

    // 3. Fallback: dynamically simulate tracking for any valid tracking format (ST-, PT-, RX-)
    if (clean.length >= 4) {
      const simulated = generateMockTrackingForOrder(
        clean.toUpperCase().startsWith('BC-') ? clean.toUpperCase() : `BC-${Math.floor(10000 + Math.random() * 90000)}`,
        clean.toUpperCase().startsWith('PT-') ? 'Pathao Logistics' :
        clean.toUpperCase().startsWith('RDX-') ? 'RedX Delivery' : 'Steadfast Courier',
        'Dhaka'
      );
      simulated.trackingCode = clean.toUpperCase();
      setActiveTracking(simulated);
      return;
    }

    setErrorMessage('No shipment found with this tracking ID or phone number. Try one of our sample IDs below.');
    setActiveTracking(null);
  };

  useEffect(() => {
    if (codeFromUrl) {
      setQueryInput(codeFromUrl);
      lookupTracking(codeFromUrl);
    } else {
      // Default to first sample tracking code
      setActiveTracking(SAMPLE_TRACKING_LIST[0] || null);
    }
  }, [codeFromUrl]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    setSearchParams({ code: queryInput.trim() });
    lookupTracking(queryInput);
  };

  const handleSampleClick = (code: string) => {
    setQueryInput(code);
    setSearchParams({ code });
    lookupTracking(code);
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-20">
      
      {/* Top Hero Banner */}
      <div className="bg-neutral-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-xs text-neutral-300">
            <Truck className="w-3.5 h-3.5 text-white" />
            <span>Real-Time Courier Integration (Steadfast, Pathao, RedX, Paperfly)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight">
            Track Your Consignment Live
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Enter your Courier Consignment ID (e.g., ST-9821415), Blucheez Order Number, or 11-digit mobile phone number to trace your parcel.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="pt-4 max-w-xl mx-auto">
            <div className="flex bg-white rounded-2xl p-1.5 shadow-xl border border-neutral-200">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter Consignment ID (e.g. ST-9821415 or Order ID)..."
                className="flex-1 text-xs sm:text-sm px-4 py-2.5 text-neutral-900 focus:outline-none uppercase font-mono"
              />
              <button
                type="submit"
                className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
            </div>
          </form>

          {/* Sample Pills */}
          <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-xs text-neutral-400">
            <span>Try sample tracking IDs:</span>
            {SAMPLE_TRACKING_LIST.map(sample => (
              <button
                key={sample.trackingCode}
                type="button"
                onClick={() => handleSampleClick(sample.trackingCode)}
                className="font-mono font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 px-2.5 py-1 rounded-lg cursor-pointer transition-colors text-[11px]"
              >
                {sample.trackingCode} ({sample.courier.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tracking Results Area */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-700 flex items-center space-x-2 mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {activeTracking && (
          <div className="space-y-6">
            
            {/* Status Summary Card */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-black text-white">
                      {activeTracking.courier}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-900">
                      ID: {activeTracking.trackingCode}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-neutral-900 mt-1">
                    Hub: {activeTracking.hubLocation}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Status: <strong className="text-neutral-900 font-semibold">{activeTracking.status}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-neutral-400 block">Estimated Arrival</span>
                  <span className="text-xs font-bold text-neutral-900">
                    {activeTracking.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Courier Rider Contact */}
              {activeTracking.riderPhone && (
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-black" />
                    <span className="text-neutral-700">Delivery Rider Contact:</span>
                    <strong className="font-mono text-neutral-900">{activeTracking.riderPhone}</strong>
                  </div>
                  <a
                    href={`tel:${activeTracking.riderPhone}`}
                    className="bg-black text-white px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800"
                  >
                    Call Rider
                  </a>
                </div>
              )}
            </div>

            {/* Checkpoints Timeline */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-6">
                Shipment Transit History
              </h3>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-neutral-200 before:top-2 before:bottom-2">
                {activeTracking.checkpoints.map((cp, idx) => {
                  const isLatest = idx === 0 || cp.current;
                  return (
                    <div key={idx} className="relative flex items-start space-x-4 pl-1">
                      {/* Checkpoint Dot */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                        isLatest 
                          ? 'bg-black border-black text-white ring-4 ring-neutral-100' 
                          : 'bg-white border-neutral-300 text-neutral-400'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>

                      {/* Checkpoint Info */}
                      <div className="flex-1 bg-neutral-50/70 border border-neutral-100 p-3.5 rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                          <span className={`font-bold ${isLatest ? 'text-neutral-900 text-sm' : 'text-neutral-700'}`}>
                            {cp.title}
                          </span>
                          <span className="text-neutral-400 text-[11px]">{cp.date} • {cp.time}</span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
                          {cp.location}
                        </p>
                        {cp.description && (
                          <p className="text-[11px] text-neutral-600 mt-1.5">
                            {cp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-neutral-100 border border-neutral-200 rounded-2xl p-5 text-xs text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-neutral-900">Need Delivery Assistance?</h4>
                <p className="text-neutral-500 mt-0.5">
                  Our Dhaka dispatch atelier coordinates directly with Steadfast and Pathao riders.
                </p>
              </div>
              <a
                href="tel:09612008008"
                className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Hotline: 09612-008008
              </a>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

