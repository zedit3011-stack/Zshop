import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  Star,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Grid,
  ListFilter
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { FilterState } from '../../types';

export const ProductCatalog: React.FC = () => {
  const { products, categories, filters, setFilters, resetFilters, formatPrice } = useStore();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique brands from catalog
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => brands.add(p.brand));
    return Array.from(brands);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (
          filters.searchQuery &&
          !p.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !p.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !p.brand.toLowerCase().includes(filters.searchQuery.toLowerCase())
        ) {
          return false;
        }

        // Category
        if (filters.category && filters.category !== 'all' && p.category !== filters.category) {
          return false;
        }

        // Price
        if (p.price < filters.minPrice || p.price > filters.maxPrice) {
          return false;
        }

        // Min rating
        if (filters.minRating > 0 && p.rating < filters.minRating) {
          return false;
        }

        // In-stock only
        if (filters.inStockOnly && p.stock <= 0) {
          return false;
        }

        // On-sale only
        if (filters.onSaleOnly && p.discountPercentage <= 0) {
          return false;
        }

        // Brand filter
        if (filters.brand && p.brand !== filters.brand) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low') return a.price - b.price;
        if (filters.sortBy === 'price-high') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'newest') return b.id.localeCompare(a.id);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, filters]);

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.searchQuery !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.onSaleOnly ||
    filters.brand !== undefined;

  return (
    <div className="max-w-7xl mx-auto pb-16" id="zstore-catalog-page">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ZStore Marketplace Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {filters.category !== 'all' ? filters.category : 'Explore All Products'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredProducts.length} of {products.length} products with guaranteed
              authenticity.
            </p>
          </div>

          {/* Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Sort By:</span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as FilterState['sortBy']
                    }))
                  }
                  className="appearance-none bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl pl-3.5 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-blue-600 shadow-sm"
                  id="catalog-sort-select"
                >
                  <option value="featured">Featured & Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated (4.5+)</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Active Filters:</span>

            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg">
                Category: {filters.category}
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-blue-900"
                  onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                />
              </span>
            )}

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg">
                Keyword: "{filters.searchQuery}"
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-slate-900"
                  onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))}
                />
              </span>
            )}

            {filters.brand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg">
                Brand: {filters.brand}
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-indigo-900"
                  onClick={() => setFilters((p) => ({ ...p, brand: undefined }))}
                />
              </span>
            )}

            {filters.onSaleOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 font-semibold rounded-lg">
                On Sale Only
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-rose-900"
                  onClick={() => setFilters((p) => ({ ...p, onSaleOnly: false }))}
                />
              </span>
            )}

            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg">
                In Stock Only
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-900"
                  onClick={() => setFilters((p) => ({ ...p, inStockOnly: false }))}
                />
              </span>
            )}

            {filters.minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 font-semibold rounded-lg">
                {filters.minRating}★ & Up
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-amber-950"
                  onClick={() => setFilters((p) => ({ ...p, minRating: 0 }))}
                />
              </span>
            )}

            {(filters.minPrice > 0 || filters.maxPrice < 300000) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg">
                {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-slate-900"
                  onClick={() => setFilters((p) => ({ ...p, minPrice: 0, maxPrice: 300000 }))}
                />
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 ml-2 underline"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Left Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-28 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Department / Category Filter */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
                Department
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
                    filters.category === 'all'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Departments ({products.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFilters((p) => ({ ...p, category: c.name }))}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                      filters.category === c.name
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] text-slate-400">
                      {products.filter((p) => p.category === c.name).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Price Range
                </label>
                <span className="text-xs font-bold text-blue-600">
                  {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="300000"
                step="2500"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(150000)}</span>
                <span>{formatPrice(300000)}</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
                Brand
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        brand: p.brand === brand ? undefined : brand
                      }))
                    }
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      filters.brand === brand
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Rating */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
                Minimum Rating
              </label>
              <div className="space-y-1.5">
                {[4.5, 4.0, 3.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        minRating: p.minRating === rating ? 0 : rating
                      }))
                    }
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg flex items-center gap-2 transition-colors ${
                      filters.minRating === rating
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span>{rating} Stars & Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onSaleOnly}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, onSaleOnly: e.target.checked }))
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Discounted Deals Only</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, inStockOnly: e.target.checked }))
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try clearing your search terms or expanding your price and category filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-in Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Department */}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Department
                </p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-lg ${
                      filters.category === 'all'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600'
                    }`}
                  >
                    All Departments
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFilters((p) => ({ ...p, category: c.name }))}
                      className={`w-full text-left text-xs py-1.5 px-2 rounded-lg ${
                        filters.category === c.name
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Max Price: {formatPrice(filters.maxPrice)}
                </p>
                <input
                  type="range"
                  min="0"
                  max="300000"
                  step="2500"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 mb-6">
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={filters.onSaleOnly}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, onSaleOnly: e.target.checked }))
                    }
                  />
                  <span>On Sale Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, inStockOnly: e.target.checked }))
                    }
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
