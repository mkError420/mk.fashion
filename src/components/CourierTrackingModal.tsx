import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle,
  ExternalLink,
  Package
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SAMPLE_TRACKING_CODES } from '../data/mockCourierData';
import { CourierTrackingInfo } from '../types';

export const CourierTrackingModal: React.FC = () => {
  const { isTrackingOpen, closeTracking, trackingQueryCode, orders } = useShop();
  
  const [searchInput, setSearchInput] = useState(trackingQueryCode || '');
  const [trackingResult, setTrackingResult] = useState<CourierTrackingInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const performSearch = useCallback((query: string) => {
    const q = query.trim().toUpperCase();
    if (!q) return;

    setNotFound(false);

    // 1. Check direct sample codes (Steadfast, Pathao, RedX)
    if (SAMPLE_TRACKING_CODES[q]) {
      setTrackingResult(SAMPLE_TRACKING_CODES[q]);
      return;
    }

    // 2. Check if code matches an order in store
    const matchedOrder = orders.find(
      o => o.orderId.toUpperCase() === q || 
           o.tracking.trackingCode.toUpperCase() === q ||
           o.tracking.consignmentId.toUpperCase() === q
    );

    if (matchedOrder) {
      setTrackingResult(matchedOrder.tracking);
      return;
    }

    // 3. Fallback: If starts with ST-, PT-, RDX-, or AR-
    if (q.startsWith('ST-') || q.startsWith('PT-') || q.startsWith('RDX-') || q.startsWith('AR-')) {
      const courier = q.startsWith('ST-') ? 'Steadfast Courier' : q.startsWith('PT-') ? 'Pathao Logistics' : 'RedX Delivery';
      const syntheticResult: CourierTrackingInfo = {
        courier,
        trackingCode: q,
        consignmentId: `CNS-${q}`,
        status: 'In Sorting Hub',
        estimatedDelivery: 'Tomorrow afternoon',
        riderName: 'En route to local distribution hub',
        hubLocation: 'Dhaka Central Gateway Hub',
        checkpoints: [
          {
            date: 'Today',
            time: '01:45 PM',
            title: 'Processed at Gateway Hub',
            location: 'Tejgaon Central Hub',
            description: 'Barcode verified and sealed for regional transport.',
            completed: true,
            current: true
          },
          {
            date: 'Yesterday',
            time: '04:10 PM',
            title: 'Picked Up by Courier Agent',
            location: 'Aristo Dispatch Center',
            description: 'Order handed over by merchant for Cash on Delivery dispatch.',
            completed: true,
            current: false
          }
        ]
      };
      setTrackingResult(syntheticResult);
      return;
    }

    setNotFound(true);
    setTrackingResult(null);
  }, [orders]);

  // Auto-search if code was passed into modal or modal opens
  useEffect(() => {
    if (!isTrackingOpen) return;

    if (trackingQueryCode) {
      setSearchInput(trackingQueryCode);
      performSearch(trackingQueryCode);
    } else if (orders.length > 0 && !trackingResult) {
      // Default to latest order's tracking
      setSearchInput(orders[0].orderId);
      performSearch(orders[0].orderId);
    }
  }, [isTrackingOpen, trackingQueryCode, orders, trackingResult, performSearch]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isTrackingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-neutral-800 text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif">
                Third-Party Shipping Tracking
              </h3>
              <p className="text-xs text-neutral-300">
                Live consignment tracking for Steadfast, Pathao, RedX & Paperfly
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeTracking}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 border-b border-neutral-200 bg-neutral-50">
          <form 
            onSubmit={(e) => { e.preventDefault(); performSearch(searchInput); }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Consignment or Order ID (e.g. ST-9821415, AR-98214)"
                className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-mono"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            </div>
            <button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Track Now
            </button>
          </form>

          {/* Quick Click Samples */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-700">Sample Live Consignments:</span>
            <button
              type="button"
              onClick={() => { setSearchInput('ST-9821415'); performSearch('ST-9821415'); }}
              className="bg-white hover:bg-neutral-100 hover:text-black px-2.5 py-1 rounded-md border border-neutral-300 text-neutral-700 font-mono text-[11px] transition-colors"
            >
              Steadfast (ST-9821415)
            </button>
            <button
              type="button"
              onClick={() => { setSearchInput('PT-882194'); performSearch('PT-882194'); }}
              className="bg-white hover:bg-neutral-100 hover:text-black px-2.5 py-1 rounded-md border border-neutral-300 text-neutral-700 font-mono text-[11px] transition-colors"
            >
              Pathao (PT-882194)
            </button>
            <button
              type="button"
              onClick={() => { setSearchInput('RDX-472019'); performSearch('RDX-472019'); }}
              className="bg-white hover:bg-neutral-100 hover:text-black px-2.5 py-1 rounded-md border border-neutral-300 text-neutral-700 font-mono text-[11px] transition-colors"
            >
              RedX (RDX-472019)
            </button>
          </div>
        </div>

        {/* Tracking Details Container */}
        <div className="p-5">
          {notFound ? (
            <div className="text-center py-8 bg-neutral-50 rounded-xl border border-neutral-200 p-6">
              <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <h4 className="font-bold text-neutral-900 text-sm">Consignment Not Found</h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                No tracking record found for "{searchInput}". Please verify your Steadfast, Pathao, or Order ID.
              </p>
            </div>
          ) : trackingResult ? (
            <div className="space-y-6">
              
              {/* Courier Partner Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Carrier Partner</span>
                    <span className="bg-neutral-200 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mr-1" />
                      API Connected
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 font-serif mt-0.5">
                    {trackingResult.courier}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Consignment ID: <span className="font-mono font-bold text-neutral-700">{trackingResult.consignmentId}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-neutral-200 text-right">
                    <span className="text-[10px] text-neutral-400 uppercase block font-semibold">Tracking Code</span>
                    <div className="flex items-center space-x-1.5 font-mono font-bold text-neutral-900 text-sm">
                      <span>{trackingResult.trackingCode}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(trackingResult.trackingCode)}
                        className="text-neutral-400 hover:text-black p-0.5"
                        title="Copy code"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-100 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Status</span>
                  <span className="text-sm font-bold text-neutral-900 flex items-center mt-0.5">
                    <Clock className="w-3.5 h-3.5 mr-1 text-neutral-700" />
                    {trackingResult.status}
                  </span>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Estimated Arrival</span>
                  <span className="text-sm font-bold text-neutral-800 mt-0.5 block">
                    {trackingResult.estimatedDelivery}
                  </span>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Current Dispatch Hub</span>
                  <span className="text-xs font-semibold text-neutral-800 mt-0.5 block truncate" title={trackingResult.hubLocation}>
                    {trackingResult.hubLocation}
                  </span>
                </div>
              </div>

              {/* Courier Rider Information (If out for delivery) */}
              {trackingResult.riderName && (
                <div className="bg-neutral-100 p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{trackingResult.riderName}</p>
                      <p className="text-neutral-500 text-[11px]">Assigned Delivery Agent • Cash on Delivery Collection</p>
                    </div>
                  </div>
                  {trackingResult.riderPhone && (
                    <a
                      href={`tel:${trackingResult.riderPhone}`}
                      className="inline-flex items-center space-x-1 bg-black hover:bg-neutral-800 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{trackingResult.riderPhone}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Progress Stepper Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">
                  Courier Transit History
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                  {trackingResult.checkpoints.map((cp, idx) => (
                    <div key={idx} className="relative group">
                      {/* Bullet circle */}
                      <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white ${
                        cp.current 
                          ? 'border-black text-black ring-4 ring-neutral-200' 
                          : cp.completed 
                          ? 'border-neutral-900 bg-neutral-900 text-white' 
                          : 'border-neutral-300 text-neutral-300'
                      }`}>
                        {cp.completed && !cp.current ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full ${cp.current ? 'bg-black' : 'bg-transparent'}`} />
                        )}
                      </div>

                      {/* Checkpoint Details */}
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h5 className={`text-sm font-bold ${cp.current ? 'text-black' : 'text-neutral-900'}`}>
                            {cp.title}
                          </h5>
                          <span className="text-[11px] font-medium text-neutral-400 whitespace-nowrap">
                            {cp.date} • {cp.time}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-neutral-500 mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 text-neutral-400 flex-shrink-0" />
                          <span>{cp.location}</span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                          {cp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COD Notice */}
              <div className="bg-neutral-100 p-3 rounded-xl border border-neutral-200 text-xs text-neutral-800 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-neutral-700 flex-shrink-0" />
                <span>
                  <strong>Reminder:</strong> Please verify your parcel before paying exact cash to the delivery rider. For any issues, call our helpline immediately.
                </span>
              </div>

            </div>
          ) : (
            <div className="text-center py-10">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-neutral-700">Enter a Tracking Code to View Live Status</p>
              <p className="text-xs text-neutral-400 mt-0.5">Try testing with ST-9821415 or PT-882194 above</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
