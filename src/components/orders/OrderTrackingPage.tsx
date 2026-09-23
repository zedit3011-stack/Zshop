import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const { orders, getOrderById, trackingSearchId, setTrackingSearchId, formatPrice } = useStore();
  const [searchInput, setSearchInput] = useState(trackingSearchId || 'ZS-89420');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (searchInput.trim()) {
      const found = getOrderById(searchInput.trim());
      if (found) {
        setActiveOrder(found);
        setNotFound(false);
      } else {
        setActiveOrder(null);
        setNotFound(true);
      }
    }
  }, [searchInput, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = getOrderById(searchInput.trim());
    if (found) {
      setActiveOrder(found);
      setNotFound(false);
      setTrackingSearchId(found.id);
    } else {
      setActiveOrder(null);
      setNotFound(true);
    }
  };

  const sampleOrderIds = orders.map((o) => o.id);

  return (
    <div className="max-w-5xl mx-auto pb-16" id="zstore-order-tracking-page">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Track Your Package
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Enter your ZStore Order ID (e.g. ZS-89420) or Carrier Tracking Code to view real-time
          logistics updates.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. ZS-89420 or ZS-TRK-..."
              className="w-full text-xs font-semibold pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 shadow-sm"
              id="order-tracking-input"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            id="order-tracking-submit-btn"
          >
            Track
          </button>
        </form>

        {/* Quick Demo Links */}
        <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-400 flex-wrap">
          <span>Try recent demo orders:</span>
          {sampleOrderIds.slice(0, 3).map((id) => (
            <button
              key={id}
              onClick={() => setSearchInput(id)}
              className="font-bold text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {notFound ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Order Not Found</h3>
          <p className="text-xs text-slate-500">
            We couldn't locate an order matching "{searchInput}". Please double check your order ID.
          </p>
        </div>
      ) : activeOrder ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Main Status Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Order ID
                  </span>
                  <span className="font-mono text-base font-black text-blue-600">
                    {activeOrder.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      activeOrder.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeOrder.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {activeOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Placed on {new Date(activeOrder.createdAt).toLocaleDateString()} • Carrier:{' '}
                  <span className="font-semibold text-slate-800">{activeOrder.courier}</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-right sm:text-right">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Estimated Delivery Date
                </p>
                <p className="text-sm font-black text-slate-900">{activeOrder.estimatedDelivery}</p>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Tracking #: {activeOrder.trackingNumber}
                </p>
              </div>
            </div>

            {/* Visual Step-by-Step Logistics Timeline */}
            <div className="pt-8">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
                Shipment Milestones
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-100 -z-0">
                  <div
                    className="bg-blue-600 h-full transition-all duration-500"
                    style={{
                      width:
                        activeOrder.status === 'delivered'
                          ? '100%'
                          : activeOrder.status === 'out_for_delivery'
                          ? '80%'
                          : activeOrder.status === 'shipped'
                          ? '50%'
                          : '20%'
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                  {activeOrder.timeline.map((step, idx) => (
                    <div key={idx} className="flex md:flex-col items-start gap-3 md:text-center">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                          step.completed
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : step.current
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-4 ring-amber-100'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <div className="md:mt-2">
                        <p
                          className={`text-xs font-bold ${
                            step.completed || step.current ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.timestamp && (
                          <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
                            {step.timestamp}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Package Items & Delivery Address Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Address & Customer */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Shipping Destination
              </h3>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900 text-sm">
                  {activeOrder.shippingAddress.fullName}
                </p>
                <p>
                  {activeOrder.shippingAddress.street}
                  {activeOrder.shippingAddress.apartment && `, ${activeOrder.shippingAddress.apartment}`}
                </p>
                <p>
                  {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state}{' '}
                  {activeOrder.shippingAddress.postalCode}
                </p>
                <p>{activeOrder.shippingAddress.country}</p>
                <p className="pt-2 text-slate-500">Contact: {activeOrder.customerPhone}</p>
              </div>
            </div>

            {/* Order Items & Invoice Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Items In This Shipment ({activeOrder.items.length})
              </h3>
              <div className="space-y-3">
                {activeOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="truncate max-w-[200px]">
                        <p className="font-bold text-slate-900 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity}{' '}
                          {item.selectedColor && `• ${item.selectedColor}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Total (Cash on Delivery)</span>
                  <span className="text-sm font-black text-blue-600">
                    {formatPrice(activeOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
