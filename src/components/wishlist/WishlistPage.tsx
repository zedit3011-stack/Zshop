import React from 'react';
import { Heart, ShoppingBag, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, moveWishlistToCart, setCurrentView } = useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto pb-16" id="zstore-wishlist-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Saved Wishlist ({wishlist.length})
            </h1>
          </div>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={moveWishlistToCart}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            id="move-wishlist-to-cart-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Move All Items to Cart</span>
          </button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-1">Your wishlist is empty</h2>
          <p className="text-xs text-slate-500 mb-6">
            Tap the heart icon on any product card or details page to save items for later.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <span>Explore Marketplace Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
