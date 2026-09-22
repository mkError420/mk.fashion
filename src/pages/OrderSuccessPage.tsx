import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  Calendar, 
  Printer, 
  ArrowRight, 
  Copy, 
  ShieldCheck, 
  Package,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, confirmedOrder, addToast } = useShop();

  const order = orders.find(o => o.orderId === orderId) || confirmedOrder;

  const handleCopyTracking = () => {
    if (order?.tracking?.trackingCode) {
      navigator.clipboard.writeText(order.tracking.trackingCode);
      addToast('Tracking Code Copied', `${order.tracking.trackingCode} copied to clipboard.`, 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">Order Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6 max-w-sm">
          We couldn't locate this order invoice. It may have expired or been placed in another session.
        </p>
        <Link
          to="/"
          className="bg-black text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 py-8 sm:py-12 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Banner Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded bg-black text-white inline-block">
            Cash on Delivery Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। We have sent an SMS notification to <strong>{order.customer.phone}</strong> with tracking updates.
          </p>

          {/* Quick Tracking Ribbon */}
          {order.tracking && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Courier Partner: {order.tracking.courier}
                </span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-sm font-mono font-bold text-neutral-900">
                    Consignment ID: {order.tracking.trackingCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    className="p-1 text-neutral-400 hover:text-black cursor-pointer rounded"
                    title="Copy Consignment ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <Link
                to={`/track?code=${order.tracking.trackingCode}`}
                className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all uppercase tracking-wider whitespace-nowrap"
              >
                Track Parcel Live
              </Link>
            </div>
          )}
        </div>

        {/* Invoice Container for Print/View */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:shadow-none">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-neutral-200 pb-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-neutral-900">BLUCHEEZ ATELIER</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Modern Craftsmanship • 100% Cash on Delivery
              </p>
              <p className="text-[11px] text-neutral-400">
                Dhaka Outlets: Banani, Dhanmondi, Uttara & JFP
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-500 block">Order Number</span>
              <span className="text-sm font-bold font-mono text-neutral-900">{order.orderId}</span>
              <span className="text-xs text-neutral-400 block mt-0.5">{order.date}</span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50/70 p-4 rounded-2xl border border-neutral-100 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] block mb-1">
                Recipient Details
              </span>
              <h4 className="font-bold text-neutral-900">{order.customer.fullName}</h4>
              <p className="text-neutral-600 mt-0.5">{order.customer.phone}</p>
              {order.customer.email && <p className="text-neutral-500">{order.customer.email}</p>}
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] block mb-1">
                Shipping Destination ({order.deliveryZone})
              </span>
              <p className="text-neutral-800 font-medium">{order.customer.address}</p>
              <p className="text-neutral-600 mt-0.5">{order.customer.district}</p>
              {order.customer.notes && (
                <p className="text-[11px] text-neutral-500 mt-1 italic">
                  Note: "{order.customer.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <div className="bg-neutral-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 grid grid-cols-12">
              <span className="col-span-7">Item Description</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-3 text-right">Total</span>
            </div>

            <div className="divide-y divide-neutral-100 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 grid grid-cols-12 items-center">
                  <div className="col-span-7 flex items-center space-x-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-16 rounded object-cover object-top border border-neutral-200 flex-shrink-0"
                    />
                    <div>
                      <h5 className="font-bold text-neutral-900">{item.product.name}</h5>
                      <p className="text-[11px] text-neutral-500">
                        Size: {item.selectedSize} | Color: {item.selectedColor}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        SKU: {item.product.sku}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-bold text-neutral-900">
                    {item.quantity}
                  </div>

                  <div className="col-span-3 text-right font-black text-neutral-900">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation breakdown */}
          <div className="space-y-2 text-xs max-w-xs ml-auto pt-2">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-neutral-900">৳{order.subtotal.toLocaleString()}</span>
            </div>

            {order.discountAmount && (
              <div className="flex justify-between text-neutral-900 font-semibold">
                <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
                <span>-৳{order.discountAmount.toLocaleString()}</span>
              </div>
            )}

            {order.giftPackaging && (
              <div className="flex justify-between text-neutral-600">
                <span>Gift Atelier Box:</span>
                <span className="font-semibold text-neutral-900">+৳150</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600">
              <span>Courier Delivery ({order.deliveryZone}):</span>
              <span className="font-semibold text-neutral-900">
                {order.deliveryFee === 0 ? 'FREE' : `৳${order.deliveryFee}`}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="font-bold text-sm text-neutral-900">Cash Due on Delivery:</span>
              <span className="text-xl font-black text-neutral-900">৳{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-neutral-200 flex flex-wrap gap-3 justify-between items-center print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 text-xs font-bold text-neutral-700 hover:text-black border border-neutral-300 hover:bg-neutral-50 px-4 py-2.5 rounded-xl cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Receipt</span>
            </button>

            <Link
              to="/collections/all"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
