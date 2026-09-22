import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  Banknote, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Printer, 
  ShoppingBag 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderSuccessModal: React.FC = () => {
  const { confirmedOrder, setConfirmedOrder, openTracking } = useShop();
  const [copiedCode, setCopiedCode] = useState(false);

  if (!confirmedOrder) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTrackNow = () => {
    const code = confirmedOrder.tracking.trackingCode;
    setConfirmedOrder(null);
    openTracking(code);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 my-auto text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Header */}
        <div className="bg-black text-white p-6 text-center relative">
          <button
            type="button"
            onClick={() => setConfirmedOrder(null)}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-10 h-10 text-black" />
          </div>

          <span className="text-xs uppercase tracking-widest font-bold text-neutral-300">
            Order Confirmed (অর্ডার সফল হয়েছে)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif mt-0.5">
            Thank You, {confirmedOrder.customer.fullName}!
          </h3>
          <p className="text-xs text-neutral-300 mt-1">
            Order Reference: <strong className="font-mono text-white text-sm">{confirmedOrder.orderId}</strong>
          </p>
        </div>

        {/* Courier Partner & Third-Party Tracking Box */}
        <div className="p-5 bg-neutral-50 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-black" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Third-Party Courier Assigned
              </span>
            </div>
            <span className="text-xs font-bold text-neutral-900 bg-neutral-200 px-2 py-0.5 rounded border border-neutral-300">
              {confirmedOrder.tracking.courier}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 font-semibold block uppercase">Consignment Tracking Code</span>
              <span className="font-mono font-extrabold text-sm text-neutral-900">
                {confirmedOrder.tracking.trackingCode}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleCopy(confirmedOrder.tracking.trackingCode)}
                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs flex items-center space-x-1"
                title="Copy tracking code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleTrackNow}
                className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
              >
                <span>Track Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 mt-2">
            Estimated Delivery: <strong>{confirmedOrder.tracking.estimatedDelivery}</strong> to <strong>{confirmedOrder.customer.district}</strong>.
          </p>
        </div>

        {/* Order Details Breakdown */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <span className="font-bold uppercase tracking-wider text-neutral-500 block mb-2">
              Ordered Garments ({confirmedOrder.items.length})
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-neutral-100 last:border-none">
                  <div className="flex items-center space-x-2 min-w-0 pr-2">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-8 h-10 object-cover rounded border border-neutral-200" />
                    <div className="truncate">
                      <p className="font-semibold text-neutral-800 truncate">{item.product.name}</p>
                      <p className="text-neutral-400 text-[10px]">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900 whitespace-nowrap">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Address */}
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1">
            <p className="text-neutral-700">
              <strong className="text-neutral-900">Delivery Address:</strong> {confirmedOrder.customer.address}, {confirmedOrder.customer.district}
            </p>
            <p className="text-neutral-700">
              <strong className="text-neutral-900">Mobile Phone:</strong> {confirmedOrder.customer.phone}
            </p>
            {confirmedOrder.customer.notes && (
              <p className="text-neutral-500 italic">
                <strong>Note:</strong> "{confirmedOrder.customer.notes}"
              </p>
            )}
          </div>

          {/* Payment Method & Total */}
          <div className="bg-neutral-100 p-3 rounded-xl space-y-1.5">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span>৳{confirmedOrder.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Fee ({confirmedOrder.deliveryZone}):</span>
              <span>৳{confirmedOrder.deliveryFee}</span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline font-bold text-neutral-900">
              <span className="flex items-center text-sm">
                <Banknote className="w-4 h-4 mr-1 text-black" />
                Pay on Delivery (ক্যাশ অন ডেলিভারি):
              </span>
              <span className="text-lg text-neutral-900">
                ৳{confirmedOrder.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="p-5 border-t border-neutral-200 flex gap-3">
          <button
            type="button"
            onClick={() => setConfirmedOrder(null)}
            className="flex-1 bg-white hover:bg-neutral-100 text-neutral-900 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-colors text-center cursor-pointer border border-neutral-300"
          >
            Continue Shopping
          </button>

          <button
            type="button"
            onClick={handleTrackNow}
            className="flex-1 bg-black hover:bg-neutral-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>Track Parcel</span>
          </button>
        </div>

      </div>
    </div>
  );
};
