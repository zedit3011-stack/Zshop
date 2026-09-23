import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check,
  ChevronLeft
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
    formatPrice
  } = useStore();

  const [couponCode, setCouponCode] = useState('');

  const freeShippingThreshold = 5000;
  const freeShippingLeft = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore our featured deals and
          top-rated audio, timepieces, and apparel.
        </p>
        <button
          onClick={() => {
            setCurrentView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2"
        >
          <span>Browse Marketplace Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-16" id="zstore-full-cart-page">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Continue Shopping
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Notice */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              {freeShippingLeft === 0 ? (
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Congratulations! You unlocked Free Express Shipping!
                </span>
              ) : (
                <span className="text-slate-700">
                  Add <span className="text-blue-600 font-extrabold">{formatPrice(freeShippingLeft)}</span> more for Free Delivery
                </span>
              )}
              <span className="text-slate-400">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 truncate sm:whitespace-normal">
                      {item.product.title}
                    </h3>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-xs text-slate-500 mt-1">
                        Variant: {item.selectedColor} {item.selectedSize && `(${item.selectedSize})`}
                      </p>
                    )}
                    <p className="text-xs font-bold text-slate-900 mt-1 sm:hidden">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg text-xs font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.quantity + 1,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      disabled={item.quantity >= item.product.stock}
                      className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg text-xs font-bold transition-colors disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[90px]">
                    <p className="text-base font-black text-slate-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[11px] text-slate-400">
                        {formatPrice(item.product.price)} / unit
                      </p>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() =>
                      removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                    }
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">256-Bit SSL Checkout</h4>
                <p className="text-[11px] text-slate-500">Encrypted payment gateway</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
              <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Tracked Express</h4>
                <p className="text-[11px] text-slate-500">Live delivery timeline</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">30-Day Guarantee</h4>
                <p className="text-[11px] text-slate-500">Free prepaid returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-28 space-y-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Promo Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. ZSTORE10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Try codes: <span className="font-semibold text-blue-600">ZSTORE10</span> (10% off) or{' '}
                <span className="font-semibold text-blue-600">WELCOME20</span> (20% off)
              </p>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200">
                <span className="font-bold">Active Coupon: {appliedCoupon}</span>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-900 underline font-semibold hover:text-emerald-950"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-900">
                  {cartShipping === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    formatPrice(cartShipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-bold text-slate-900">{formatPrice(cartTax)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                <span>Payment Mode</span>
                <span>Cash on Delivery (COD)</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-950">
                <span>Total Amount</span>
                <span className="text-blue-600">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setCurrentView('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              id="cart-page-checkout-btn"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
