import React, { useState, useEffect } from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';

export const FlashDeals: React.FC = () => {
  const { products, setCurrentView, setFilters } = useStore();

  // Dynamic countdown timer (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const flashDealProducts = products.filter((p) => p.isFlashDeal).slice(0, 4);

  return (
    <section className="mb-10 sm:mb-14" id="zstore-flash-deals-section">
      {/* Header bar with live clock */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border border-rose-900/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30 shrink-0">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                Flash Deals of the Day
              </h2>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full border border-rose-500/30">
                LIMITED STOCK
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Deep price cuts on flagship audio, chronographs, and barista essentials.
            </p>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/70 border border-slate-800 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-semibold text-slate-400">Ends in:</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono font-bold text-xs sm:text-base">
            <div className="bg-slate-800 text-white px-2 py-1 rounded-lg border border-slate-700 min-w-[28px] sm:min-w-[32px] text-center">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-rose-400">:</span>
            <div className="bg-slate-800 text-white px-2 py-1 rounded-lg border border-slate-700 min-w-[28px] sm:min-w-[32px] text-center">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-rose-400">:</span>
            <div className="bg-slate-800 text-rose-400 px-2 py-1 rounded-lg border border-slate-700 min-w-[28px] sm:min-w-[32px] text-center">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {flashDealProducts.map((product) => (
          <div key={product.id} className="flex flex-col">
            <ProductCard product={product} />
            {/* Deal Stock Claimed Bar */}
            <div className="mt-2.5 px-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span>Claimed: 78%</span>
                <span className="text-rose-600 font-bold">{product.stock} items left</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom link */}
      <div className="text-center mt-6">
        <button
          onClick={() => {
            setFilters((prev) => ({ ...prev, onSaleOnly: true, category: 'all' }));
            setCurrentView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <span>View all discounted flash items</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
