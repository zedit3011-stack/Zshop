import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  ShieldCheck,
  Truck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  SlidersHorizontal,
  LogOut,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ZStoreLogo } from '../common/ZStoreLogo';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    totalCartItemsCount,
    setIsCartDrawerOpen,
    wishlist,
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    searchQuery,
    setSearchQuery,
    setFilters,
    categories,
    products,
    openProductDetails
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('all');

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      searchQuery: searchQuery.trim(),
      category: selectedSearchCategory
    }));
    setIsSearchFocused(false);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryName: string) => {
    setFilters((prev) => ({
      ...prev,
      category: categoryName
    }));
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Predictive search matching
  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm" id="zstore-main-header">
      {/* Top Banner Notice & Quick Utilities */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
              Cash on Delivery
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Cash on Delivery (COD) nationwide • Free delivery on orders over Rs. 5,000.
            </span>
            <span className="text-blue-400 font-semibold">Code: ZSTORE10 (10% OFF)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium ml-auto">
            <button
              onClick={() => {
                setCurrentView('order-tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              id="topbar-track-order"
            >
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 sm:gap-6">
        {/* Mobile menu hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
          id="mobile-menu-toggle-btn"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <ZStoreLogo
          size="md"
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Search Bar with Category Select & Autocomplete */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center bg-slate-100/90 border border-slate-300 rounded-xl overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all shadow-inner"
          >
            {/* Category selector inside search */}
            <div className="relative border-r border-slate-300 bg-slate-50">
              <select
                value={selectedSearchCategory}
                onChange={(e) => setSelectedSearchCategory(e.target.value)}
                className="appearance-none bg-transparent pl-3.5 pr-7 py-2.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
                id="search-category-select"
              >
                <option value="all">All Departments</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Input field */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="Search thousands of verified electronics, fashion, home essentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-3.5 pr-8 py-2.5 text-sm text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
                id="header-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors flex items-center gap-1.5"
              id="header-search-submit"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline">Search</span>
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Matching Products</span>
                <span className="text-blue-600">{searchSuggestions.length} found</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      openProductDetails(prod.id);
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{prod.title}</p>
                      <p className="text-[11px] text-slate-500">{prod.brand} • {prod.category}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600">${prod.price}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSearchSubmit()}
                className="w-full py-2.5 text-xs font-semibold text-center text-blue-600 bg-slate-50 hover:bg-blue-50 border-t border-slate-100 flex items-center justify-center gap-1"
              >
                <span>View all search results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Actions: Wishlist, Cart, Account */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Wishlist Button */}
          <button
            onClick={() => {
              setCurrentView('wishlist');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Wishlist"
            id="nav-wishlist-btn"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-3.5 py-2 rounded-xl transition-colors shadow-sm"
            id="nav-cart-btn"
          >
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            {totalCartItemsCount > 0 && (
              <span className="bg-blue-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                {totalCartItemsCount}
              </span>
            )}
          </button>

          {/* Account Dropdown */}
          <div ref={accountRef} className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
              id="nav-account-dropdown-btn"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
              )}
              <span className="hidden xl:inline text-xs font-semibold text-slate-800 max-w-[90px] truncate">
                {currentUser ? currentUser.name : 'Sign In'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
            </button>

            {/* Account Popover Menu */}
            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-blue-100 text-blue-700">
                          Customer
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          setCurrentView('order-tracking');
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>My Orders & Tracking</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          setCurrentView('wishlist');
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4 text-slate-500" />
                        <span>My Wishlist ({wishlist.length})</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-3">
                    <p className="text-xs text-slate-600 mb-3">
                      Sign in for fast checkout, order tracking, and exclusive discounts.
                    </p>
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-xl transition-colors mb-2"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setAuthModalMode('signup');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold py-2 rounded-xl transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Visible on mobile screens) */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products in ZStore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-semibold"
          >
            Search
          </button>
        </form>
      </div>

      {/* Quick Category Ribbon & Deals Strip */}
      <div className="hidden lg:block bg-slate-50 border-t border-slate-200 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-1 py-2">
            {/* All Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors mr-2"
                id="all-categories-menu-btn"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Departments</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Browse Categories
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center justify-between transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400">{cat.itemCount}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Flash Deals Pill */}
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, onSaleOnly: true, category: 'all' }));
                setCurrentView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-md hover:bg-rose-50 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-rose-500" />
              <span>Flash Deals</span>
              <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                HOT
              </span>
            </button>

            {/* Popular category shortcuts */}
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className="px-2.5 py-1 font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-md transition-colors"
              >
                {cat.name}
              </button>
            ))}

            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'all' }));
                setCurrentView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Explore All Products →
            </button>
          </div>

          <div className="flex items-center gap-3 py-2 text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              100% Authentic Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[115px] bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="bg-white w-4/5 max-w-sm h-full overflow-y-auto p-4 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="py-3 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                    currentView === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: 'all' }));
                    setCurrentView('catalog');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                    currentView === 'catalog' ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                  }`}
                >
                  All Products Catalog
                </button>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, onSaleOnly: true, category: 'all' }));
                    setCurrentView('catalog');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-current text-rose-500" />
                  Flash Deals
                </button>
                <button
                  onClick={() => {
                    setCurrentView('wishlist');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 flex items-center justify-between"
                >
                  <span>Wishlist</span>
                  <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('order-tracking');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 flex items-center gap-2"
                >
                  <Truck className="w-4 h-4 text-blue-500" />
                  Order Tracking
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Browse by Category
                </p>
                <div className="flex flex-col gap-1">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategorySelect(c.name)}
                      className="text-left text-xs font-medium text-slate-600 hover:text-blue-600 py-1.5 px-2 rounded hover:bg-slate-50 cursor-pointer"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
