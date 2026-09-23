import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronLeft,
  Package,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    createOrder,
    currentUser,
    setCurrentView,
    setTrackingSearchId,
    formatPrice
  } = useStore();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: currentUser?.name || 'Marcus Bennett',
    email: currentUser?.email || 'marcus.b@example.com',
    phone: currentUser?.phoneNumber || '+92 300 1234567',
    street: 'House 42, Street 7, Sector F-8/2',
    apartment: 'Phase 2',
    city: 'Islamabad',
    state: 'Federal',
    postalCode: '44000',
    country: 'Pakistan'
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'priority'>('express');
  const [paymentMethod] = useState<'cash_on_delivery'>('cash_on_delivery');

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = createOrder({
        customerName: shippingAddress.fullName,
        customerEmail: shippingAddress.email,
        customerPhone: shippingAddress.phone,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          street: shippingAddress.street,
          apartment: shippingAddress.apartment,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country
        },
        paymentMethod
      });

      setIsProcessing(false);
      setConfirmedOrder(newOrder);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // If order was just placed, display the confirmation view
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center" id="order-confirmed-view">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Thank you for your order, {confirmedOrder.customerName}!
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          We've sent an order confirmation & receipt to{' '}
          <span className="font-semibold text-slate-800">{confirmedOrder.customerEmail}</span>.
        </p>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-left shadow-sm mb-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</p>
              <p className="text-lg font-black text-blue-600 font-mono">{confirmedOrder.id}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking Number</p>
              <p className="text-xs font-bold text-slate-800 font-mono">{confirmedOrder.trackingNumber}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Delivery</p>
              <p className="text-xs font-bold text-emerald-600">{confirmedOrder.estimatedDelivery}</p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Ordered Items
            </h4>
            <div className="space-y-3">
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-bold">
            <span className="text-slate-700">Total Payable (Cash on Delivery)</span>
            <span className="text-lg font-black text-slate-900">{formatPrice(confirmedOrder.total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              setTrackingSearchId(confirmedOrder.id);
              setCurrentView('order-tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            id="track-new-order-btn"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Status</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // If cart is empty and not confirmed, redirect back
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">No items in your cart to checkout</h2>
        <p className="text-xs text-slate-500 mb-6">Please add items to your cart before proceeding.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-16" id="zstore-checkout-page">
      {/* Top Header */}
      <div className="mb-8">
        <button
          onClick={() => setCurrentView('cart')}
          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-2"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Cart
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Express Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit encrypted end-to-end payment processing</span>
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Inputs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Customer & Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <h2 className="text-base font-black text-slate-900">Delivery Address & Contact</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={shippingAddress.email}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, email: e.target.value })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phone: e.target.value })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country / Region</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  placeholder="e.g. Pakistan, United States, United Kingdom..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Apartment, Suite, Unit
                </label>
                <input
                  type="text"
                  value={shippingAddress.apartment}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, apartment: e.target.value })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State / Province</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, state: e.target.value })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Method */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                2
              </div>
              <h2 className="text-base font-black text-slate-900">Delivery Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  deliveryMethod === 'express'
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'express'}
                  onChange={() => setDeliveryMethod('express')}
                  className="mt-1 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Standard Courier (TCS / Leopards)</span>
                    <span className="text-xs font-bold text-blue-600">
                      {cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Delivers across Pakistan in 2-3 working days</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  deliveryMethod === 'priority'
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'priority'}
                  onChange={() => setDeliveryMethod('priority')}
                  className="mt-1 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Express Priority Courier</span>
                    <span className="text-xs font-bold text-slate-900">+{formatPrice(350)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Fast-tracked door delivery within 24-48 hours</p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method - Cash on Delivery (COD) Only */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h2 className="text-base font-black text-slate-900">Payment Option</h2>
            </div>

            {/* Cash on Delivery (COD) Only Selection */}
            <div className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    COD
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>Cash on Delivery (COD)</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pay with cash when the courier delivers your parcel at your doorstep.
                    </p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-emerald-600 bg-emerald-600 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-200/60 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>No advance online payment required</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-6">
                  Please keep the exact amount ready upon delivery. Our logistics rider will provide an official physical printed invoice upon cash collection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Placement */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-28 space-y-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Review & Pay
            </h2>

            {/* Items Mini-list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-slate-900 truncate">{item.product.title}</p>
                      <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}</span>
              </div>
              {deliveryMethod === 'priority' && (
                <div className="flex justify-between text-slate-900">
                  <span>Priority Expedited Option</span>
                  <span>+{formatPrice(350)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-semibold text-emerald-600">Cash on Delivery</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
                <span>Total Payable at Doorstep</span>
                <span className="text-blue-600">
                  {formatPrice(cartTotal + (deliveryMethod === 'priority' ? 350 : 0))}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              id="checkout-place-order-btn"
            >
              {isProcessing ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  <span>Confirm Order (COD) • {formatPrice(cartTotal + (deliveryMethod === 'priority' ? 350 : 0))}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
