import React, { useState } from 'react';
import {
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Check,
  ChevronRight,
  Send,
  Lock,
  Database
} from 'lucide-react';
import { ZStoreLogo } from '../common/ZStoreLogo';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setFilters, categories, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      showToast('success', 'Subscribed!', 'You have joined the ZStore VIP newsletter list.');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800" id="zstore-footer">
      {/* Top Value Assurance Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">On orders over Rs. 5,000 across Pakistan</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Genuine Guarantee</h4>
                <p className="text-xs text-slate-400 mt-0.5">Direct manufacturer warranty certified</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">30-Day Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Free return shipping & instant credit</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Priority Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Dedicated concierge agent support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <ZStoreLogo size="lg" variant="white" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              ZStore is a modern, curated online marketplace delivering authentic consumer
              electronics, horology, footwear, and modern lifestyle essentials with high-speed
              logistics.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cash on Delivery (COD) Available Nationwide</span>
              </div>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, category: 'all' }));
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, onSaleOnly: true }));
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1 text-rose-400 font-semibold"
                >
                  <span>Flash Deals</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">Hot</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('wishlist');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  My Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('order-tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-blue-400 font-semibold"
                >
                  Track Order Status
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Departments */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Top Departments</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setFilters((p) => ({ ...p, category: cat.name }));
                      setCurrentView('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors flex items-center justify-between w-full text-left"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Stay in the Loop
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to unlock flash sales, private coupons, and restock notifications.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Subscribe</span>
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> You're on the VIP list!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Badges */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ZStore Inc. All rights reserved. Built for modern commerce.</p>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cloud Firestore Connected</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Payment Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
