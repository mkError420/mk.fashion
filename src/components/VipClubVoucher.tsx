import React, { useState } from 'react';
import { Mail, MessageCircle, Copy, Check, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const VipClubVoucher: React.FC = () => {
  const { addToast } = useShop();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const promoCode = 'WELCOME250';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    addToast('Coupon WELCOME250 copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please provide a valid email address', 'error');
      return;
    }
    setIsSubmitted(true);
    addToast('Welcome to Blucheez VIP Club! ৳250 discount voucher activated.', 'success');
  };

  return (
    <section className="w-full max-w-7xl md:max-w-none mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="bg-neutral-900 text-white border border-neutral-800 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-800/50 to-neutral-900 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Voucher Offer */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5">
                Limited Time Promo
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                বিশেষ ছাড় ভাউচার
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white">
              Enjoy ৳250 OFF On Your First Order
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              Use voucher code <span className="text-amber-300 font-bold font-mono">WELCOME250</span> at checkout on orders above ৳2,000. Plus receive early private sale invites and festive lookbooks.
            </p>

            {/* Voucher Coupon Box */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="flex items-center space-x-2 px-3.5 py-2 bg-neutral-950 border border-dashed border-amber-400/80">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="font-mono font-bold text-sm tracking-widest text-amber-300">
                  {promoCode}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 border border-white/20 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Newsletter Input & WhatsApp Concierge */}
          <div className="lg:col-span-5 bg-black/50 p-5 sm:p-6 border border-neutral-800 space-y-4">
            <div className="flex items-center space-x-2 text-neutral-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Join VIP Club & Get WhatsApp Updates
              </span>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 text-center text-xs text-emerald-300 space-y-1">
                <p className="font-bold">✨ You're Subscribed!</p>
                <p className="text-[11px] text-emerald-400/80">
                  We've sent your ৳250 discount voucher to {email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-neutral-950 border border-neutral-700 pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}

            {/* Quick WhatsApp Concierge Link */}
            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-[11px]">Instant size consultation available</span>
              </div>
              <a
                href="https://wa.me/8801700000000?text=Hi%20Blucheez%20Concierge,%20I%20need%20help%20with%20sizing%20and%20orders."
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center space-x-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
