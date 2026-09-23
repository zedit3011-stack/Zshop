import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FlashDeals } from './components/home/FlashDeals';
import { ValueProps } from './components/home/ValueProps';
import { ProductCard } from './components/products/ProductCard';
import { ProductCatalog } from './components/products/ProductCatalog';
import { CartPage } from './components/cart/CartPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderTrackingPage } from './components/orders/OrderTrackingPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { ProtectedAdminRoute } from './components/admin/ProtectedAdminRoute';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { ProductDetails, ProductDetailsModal } from './components/products/ProductDetailsModal';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ArrowRight, Sparkles, Flame, Award, TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
  const { products, categories, setCurrentView, setFilters } = useStore();
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'deals' | 'new'>('featured');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const displayedProducts = products
    .filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (activeTab === 'featured') return p.isFeatured;
      if (activeTab === 'bestsellers') return p.rating >= 4.7;
      if (activeTab === 'deals') return p.discountPercentage > 0;
      return p.stock > 0;
    })
    .slice(0, 8);

  return (
    <div className="space-y-8 sm:space-y-12" id="zstore-home-page">
      {/* Hero Banner Section (Clean, Normal Compact Size) */}
      <HeroBanner />

      {/* Quick Category Quick-Select Pills */}
      <div className="-mt-3 mb-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.name)}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === c.name
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{c.name}</span>
            <span className="text-[10px] opacity-70">({c.itemCount})</span>
          </button>
        ))}
      </div>

      {/* Featured Products Showcase - DIRECTLY UNDER HERO BANNER */}
      <section className="max-w-7xl mx-auto" id="featured-products-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Marketplace Selections</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Recommended Products
            </h2>
          </div>

          {/* Filtering Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'featured'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'bestsellers'
                  ? 'bg-white text-amber-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Top Rated</span>
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'deals'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>On Sale</span>
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'new'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>In Stock</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid: 2 Columns on Mobile, 4 Columns on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Explore Full Catalog CTA */}
        <div className="mt-8 sm:mt-10 text-center">
          <button
            onClick={() => {
              setFilters((p) => ({ ...p, category: selectedCategory === 'all' ? 'all' : selectedCategory }));
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 sm:px-8 py-3 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl sm:rounded-2xl shadow-md transition-all inline-flex items-center gap-2 group"
          >
            <span>Explore Entire ZStore Catalog ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Flash Deals with Live Countdown */}
      <FlashDeals />

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* Trust & Value Assurance Bar */}
      <ValueProps />

      {/* Promotional Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Special Member Benefits
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Upgrade Your Experience with Free Express Delivery
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Join thousands of satisfied shoppers. Enjoy 2-day tracked delivery, verified authentic
              brands, and 30-day effortless returns.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setFilters((p) => ({ ...p, category: 'all' }));
                  setCurrentView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Shop Current Catalog
              </button>
              <button
                onClick={() => {
                  setCurrentView('order-tracking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all"
              >
                Track an Existing Order
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ZStoreApp: React.FC = () => {
  const { currentView, selectedProduct, closeProductDetails } = useStore();
  const isAdminView = currentView === 'admin' || currentView === 'admin-login';

  if (isAdminView) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
        <main className="flex-1">
          {currentView === 'admin' && <ProtectedAdminRoute />}
          {currentView === 'admin-login' && <AdminLoginPage />}
        </main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
      {/* Primary Sticky Navbar for Customer Website */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        {currentView === 'home' && <HomePage />}
        {currentView === 'catalog' && <ProductCatalog />}
        {currentView === 'product-details' && selectedProduct && (
          <div className="max-w-6xl mx-auto py-6">
            <ProductDetails
              product={selectedProduct}
              isModal={false}
              onClose={closeProductDetails}
            />
          </div>
        )}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-tracking' && <OrderTrackingPage />}
        {currentView === 'wishlist' && <WishlistPage />}
      </main>

      {/* Persistent Global Modals & Drawers */}
      <CartDrawer />
      <ProductDetailsModal />
      <AuthModal />
      <ToastContainer />

      {/* Customer Website Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <ZStoreApp />
    </StoreProvider>
  );
}
