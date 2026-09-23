import React from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const {
    openProductDetails,
    addToCart,
    cart,
    isInWishlist,
    toggleWishlist,
    formatPrice
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 8;

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer">
        <img
          src={product.images[0]}
          alt={product.title}
          onClick={() => openProductDetails(product.id)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm tracking-wide">
            -{product.discountPercentage}% OFF
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-sm ring-1 ring-rose-200'
              : 'bg-white/85 text-slate-600 hover:text-rose-600 hover:bg-white shadow-sm'
          }`}
          id={`wishlist-toggle-${product.id}`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button (hover reveal on desktop) */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) {
                onQuickView(product);
              } else {
                openProductDetails(product.id);
              }
            }}
            className="w-full py-2 px-3 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg backdrop-blur-md flex items-center justify-center gap-1.5 transition-all"
            id={`quick-view-${product.id}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Metadata & Action Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Stock Tag */}
          <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
            <span className="font-semibold text-blue-600 uppercase tracking-wider truncate">
              {product.brand}
            </span>
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-emerald-700 font-medium text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => openProductDetails(product.id)}
            className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug cursor-pointer transition-colors mb-2"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1 text-xs mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-slate-800">{product.rating}</span>
            <span className="text-slate-500 text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price and Add to Cart Section */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Free express delivery</p>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`p-2.5 sm:px-3.5 sm:py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : cartItem
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
            }`}
            id={`add-to-cart-${product.id}`}
            title={cartItem ? `In Cart (${cartItem.quantity})` : 'Add to cart'}
          >
            {cartItem ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added ({cartItem.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
