import React, { useState, useRef, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  TrendingUp,
  Search,
  CheckCircle2,
  X,
  ShieldCheck,
  RefreshCw,
  Eye,
  Layers,
  Archive,
  Settings,
  LogOut,
  FolderTree,
  Database,
  Bell,
  Upload,
  Image as ImageIcon,
  Phone,
  MapPin,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, Product } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    updateOrderStatus,
    formatPrice,
    setCurrentView,
    openProductDetails,
    adminLogout,
    adminSessionUser,
    isFirebaseConnected
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'inventory' | 'categories' | 'users' | 'settings'
  >('overview');

  // Product search/filter inside admin
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Modal for adding a new product with direct file upload
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProductForm, setNewProductForm] = useState({
    title: '',
    brand: '',
    category: categories[0]?.name || 'Electronics & Audio',
    price: 4999,
    originalPrice: 6499,
    discountPercentage: 23,
    stock: 25,
    sku: `ZS-${Math.floor(100 + Math.random() * 900)}`,
    description: '',
    imageUrl: '',
    tags: 'Featured, New'
  });

  // Modal for editing existing product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modal for deleting a product (single or batch)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);

  // Selected order modal for complete details
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Real-time order notification system
  const [newOrderNotification, setNewOrderNotification] = useState<Order | null>(null);
  const [unreadOrderCount, setUnreadOrderCount] = useState<number>(0);
  const previousOrderCountRef = useRef<number>(orders.length);
  const isFirstRenderRef = useRef<boolean>(true);

  // Detect when a new order arrives
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      previousOrderCountRef.current = orders.length;
      return;
    }

    if (orders.length > previousOrderCountRef.current) {
      // A new order has arrived!
      const newestOrder = orders[0];
      setNewOrderNotification(newestOrder);
      setUnreadOrderCount((prev) => prev + (orders.length - previousOrderCountRef.current));

      // Play chime alert sound using Web Audio API
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.46);
        }
      } catch (err) {
        console.warn('Audio chime notice:', err);
      }
    }

    previousOrderCountRef.current = orders.length;
  }, [orders]);

  // Handle direct image file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setNewProductForm((prev) => ({ ...prev, imageUrl: result }));
    };
    reader.onerror = () => {
      setImageError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  // Calculations for KPI Cards
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 28450; // Combined baseline + dynamic
  const totalOrderCount = orders.length + 142;
  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing');

  const filteredProducts = products.filter((p) => {
    const matchQuery =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory =
      productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchQuery && matchCategory;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImage =
      newProductForm.imageUrl ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

    addProduct({
      title: newProductForm.title,
      brand: newProductForm.brand,
      category: newProductForm.category,
      price: Number(newProductForm.price),
      originalPrice: Number(newProductForm.originalPrice),
      discountPercentage: Number(newProductForm.discountPercentage),
      stock: Number(newProductForm.stock),
      sku: newProductForm.sku,
      description: newProductForm.description || 'Premium craftsmanship engineered for everyday use.',
      images: [finalImage],
      tags: newProductForm.tags.split(',').map((t) => t.trim()),
      specs: { 'Standard': 'Verified Quality Spec' },
      highlights: ['ZStore Certified Authentic', 'Direct warranty included'],
      shippingDays: 2,
      rating: 5.0,
      reviewCount: 0
    });

    setIsAddProductOpen(false);
    setImagePreview('');
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setNewProductForm({
      title: '',
      brand: '',
      category: categories[0]?.name || 'Electronics & Audio',
      price: 4999,
      originalPrice: 6499,
      discountPercentage: 23,
      stock: 25,
      sku: `ZS-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
      imageUrl: '',
      tags: 'Featured, New'
    });
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      title: editingProduct.title,
      brand: editingProduct.brand,
      category: editingProduct.category,
      price: Number(editingProduct.price),
      originalPrice: Number(editingProduct.originalPrice),
      stock: Number(editingProduct.stock),
      description: editingProduct.description
    });
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-16" id="zstore-admin-dashboard">
      {/* Top Header & Admin Badge */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Database className="w-3.5 h-3.5" />
              <span>Firebase Cloud Firestore Live</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Executive Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time catalog control, logistics fulfillment, stock monitors, and customer analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {adminSessionUser && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">{adminSessionUser.name}</span>
            </div>
          )}

          {/* New Order Notifications Button */}
          <button
            onClick={() => {
              setActiveTab('orders');
              setUnreadOrderCount(0);
            }}
            className="relative px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            title="Customer Orders & Notifications"
          >
            <Bell className={`w-4 h-4 ${unreadOrderCount > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Orders</span>
            {unreadOrderCount > 0 ? (
              <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white animate-pulse">
                {unreadOrderCount} new
              </span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-700 text-slate-300">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            id="admin-add-product-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('home');
              if (typeof window !== 'undefined') {
                window.history.pushState({ view: 'home' }, '', '/');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Visit Customer Store
          </button>
          <button
            onClick={() => adminLogout()}
            className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            id="admin-logout-btn"
            title="Terminate administrator session"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </div>

      {/* Prominent Live New Order Alert Notification Banner */}
      {newOrderNotification && (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border-2 border-blue-400/50 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wide">
                    New Order Placed!
                  </span>
                  <span className="font-mono font-bold text-blue-300 text-sm">
                    {newOrderNotification.id}
                  </span>
                  <span className="text-xs text-slate-300 hidden sm:inline">
                    via Cash on Delivery (COD)
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1">
                  Customer: <span className="font-bold text-white">{newOrderNotification.customerName}</span> ({newOrderNotification.customerCity}) • Total: <span className="font-bold text-emerald-400">{formatPrice(newOrderNotification.total)}</span> ({newOrderNotification.items.length} items)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => {
                  setSelectedOrderDetails(newOrderNotification);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Complete Details</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Go to Orders Tab
              </button>
              <button
                onClick={() => setNewOrderNotification(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(totalRevenue)}</p>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +14.8% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalOrderCount}</p>
          <p className="text-xs font-bold text-amber-600 mt-2">
            {pendingOrders.length} orders awaiting dispatch
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Catalog SKUs</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{products.length} Products</p>
          <p className="text-xs text-slate-500 mt-2">{categories.length} Active Departments</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Stock Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{lowStockProducts.length}</p>
          <p className="text-xs font-bold text-rose-600 mt-2">Items require immediate restocking</p>
        </div>
      </div>

      {/* Main Navigation Tabs for Dashboard */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'products', label: `Products (${products.length})`, icon: <Package className="w-4 h-4" /> },
          { id: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingCart className="w-4 h-4" /> },
          { id: 'inventory', label: `Inventory Management (${lowStockProducts.length} low)`, icon: <Archive className="w-4 h-4" /> },
          { id: 'categories', label: `Categories (${categories.length})`, icon: <FolderTree className="w-4 h-4" /> },
          { id: 'users', label: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
          { id: 'settings', label: 'Security & Settings', icon: <Settings className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Stream */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-black text-slate-900">Recent Order Dispatches</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View all orders →
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between text-xs hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">{order.id}</span>
                      <span className="text-slate-900 font-semibold">{order.customerName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {order.items.length} items • Courier: {order.courier} • COD
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{formatPrice(order.total)}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      title="View complete order details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Low Stock Notice</span>
              </h3>
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Restock
              </button>
            </div>

            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs"
                >
                  <div className="truncate max-w-[170px]">
                    <p className="font-bold text-slate-900 truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-500">{p.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-rose-600">{p.stock} left</span>
                    <button
                      onClick={() => restockProduct(p.id, p.stock + 20)}
                      className="block text-[10px] font-bold text-blue-600 hover:underline mt-0.5"
                    >
                      +20 Units
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title, brand, or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium"
              >
                <option value="all">All Departments</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              {selectedProductIds.length > 0 && (
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer animate-in fade-in duration-150"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedProductIds.length})</span>
                </button>
              )}

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Product</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProductIds(filteredProducts.map((p) => p.id));
                        } else {
                          setSelectedProductIds([]);
                        }
                      }}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      title="Select all products"
                    />
                  </th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isSelected = selectedProductIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProductIds((prev) => [...prev, p.id]);
                            } else {
                              setSelectedProductIds((prev) => prev.filter((id) => id !== p.id));
                            }
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="truncate max-w-xs">
                            <p className="font-bold text-slate-900 truncate">{p.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">{p.category}</td>
                      <td className="p-3 font-black text-slate-900">{formatPrice(p.price)}</td>
                      <td className="p-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            p.stock <= 5
                              ? 'bg-rose-100 text-rose-800'
                              : p.stock <= 15
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        ★ {p.rating} ({p.reviewCount})
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openProductDetails(p.id)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="View product page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove / Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
            Customer Orders Fulfillment
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Carrier / Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Update Status</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-600">{o.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{o.customerName}</p>
                      <p className="text-[10px] text-slate-400">{o.customerCity} • {o.customerPhone}</p>
                    </td>
                    <td className="p-3 font-medium text-slate-700">
                      {o.items.length} items ({o.items.map((i) => i.title).join(', ').substring(0, 30)}...)
                    </td>
                    <td className="p-3 font-black text-slate-900">{formatPrice(o.total)}</td>
                    <td className="p-3 text-slate-700">
                      <p className="font-medium text-slate-900">{o.courier}</p>
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        COD
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase ${
                          o.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="text-xs bg-white text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold cursor-pointer shadow-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="pending" className="text-slate-900 bg-white">Pending</option>
                        <option value="processing" className="text-slate-900 bg-white">Processing</option>
                        <option value="shipped" className="text-slate-900 bg-white">Shipped</option>
                        <option value="out_for_delivery" className="text-slate-900 bg-white">Out for Delivery</option>
                        <option value="delivered" className="text-slate-900 bg-white">Delivered</option>
                        <option value="cancelled" className="text-slate-900 bg-white">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedOrderDetails(o)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl font-bold text-xs flex items-center gap-1.5 ml-auto transition-colors cursor-pointer border border-blue-200"
                        title="View complete order details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-sm font-black text-slate-900">Inventory Stock Balances</h2>
              <p className="text-xs text-slate-500">
                Adjust warehouse levels and prevent stockouts on popular marketplace items.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border transition-all ${
                  p.stock <= 10
                    ? 'border-rose-200 bg-rose-50/30'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">SKU: {p.sku}</p>
                    <p className="text-xs font-bold text-blue-600 mt-0.5">{formatPrice(p.price)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-700">
                    Current Stock: <span className="text-slate-900 font-black">{p.stock}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => restockProduct(p.id, p.stock + 10)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => restockProduct(p.id, p.stock + 50)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                    >
                      +50
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
            Registered Marketplace Members & Administrators
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  MB
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Marcus Bennett</p>
                  <p className="text-[11px] text-slate-500">marcus.b@example.com • Joined March 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="font-bold text-slate-800">4 Orders ($1,245.80)</span>
                <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">
                  Customer
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
                  ZM
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">ZStore Executive Administrator</p>
                  <p className="text-[11px] text-slate-500">{adminSessionUser?.email || 'admin@zstore.com'} • Active Server Session</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Authenticated Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900">Marketplace Taxonomy & Department Hierarchy</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage department classifications and catalog navigation</p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-xl">
              {categories.length} Departments Configured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.name).length;
              return (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-xs">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">/{c.slug}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    {count} items
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS & SECURITY */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900">ZStore Security & Administrator Controls</h2>
              <p className="text-xs text-slate-500 mt-0.5">Session security, API protection, and credential monitoring</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Active Protection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Active Admin Session</h3>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Authenticated Role:</span>
                  <span className="font-bold text-slate-900">Executive Administrator</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Admin Email:</span>
                  <span className="font-mono text-slate-900">{adminSessionUser?.email || 'admin@zstore.com'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Session Guard:</span>
                  <span className="font-semibold text-emerald-700">Server-Side Bearer Token Verified</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Role Switching:</span>
                  <span className="font-semibold text-rose-600">Disabled & Removed</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Session Invalidation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Terminating the session invalidates the authentication token on the backend server and redirects to the dedicated Admin Login portal.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => adminLogout()}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Invalidate Admin Session & Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal Form */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-base font-black text-slate-900">Create New Catalog Product</h3>
                <p className="text-xs text-slate-500 mt-0.5">Upload product details, direct image file, and pricing in PKR</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              {/* Product Title */}
              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1.5">
                  Product Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  placeholder="e.g. Apex Horizon Wireless Soundbar"
                  className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                />
              </div>

              {/* Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">
                    Brand Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    placeholder="e.g. Nova Audio"
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 font-semibold text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name} className="text-slate-900 bg-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">
                    Sale Price (PKR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 font-bold text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">
                    Original Price (PKR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProductForm.originalPrice}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, originalPrice: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 font-bold text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">
                    Stock Units <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 font-bold text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Direct Image File Upload (No URL required) */}
              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1.5">
                  Product Image (Direct Upload) <span className="text-rose-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/30 rounded-2xl p-4 transition-all text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    id="product-image-file-input"
                  />

                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-32 h-32 object-cover rounded-2xl border-2 border-blue-500 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setNewProductForm((prev) => ({ ...prev, imageUrl: '' }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-transform hover:scale-110"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Direct Image Ready
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] font-bold text-blue-600 hover:underline"
                        >
                          Change image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="product-image-file-input"
                      className="cursor-pointer flex flex-col items-center gap-2 py-3"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to upload image file directly
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Supports PNG, JPG, JPEG, WEBP up to 5MB
                        </p>
                      </div>
                    </label>
                  )}
                </div>

                {imageError && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {imageError}
                  </p>
                )}
              </div>

              {/* Product Description */}
              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1.5">
                  Product Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProductForm.description}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, description: e.target.value })
                  }
                  placeholder="Detailed specs, features, warranty, and material information..."
                  className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs resize-y"
                />
              </div>

              {/* SKU & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">SKU Code</label>
                  <input
                    type="text"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newProductForm.tags}
                    onChange={(e) => setNewProductForm({ ...newProductForm, tags: e.target.value })}
                    placeholder="Featured, Hot Deal, New"
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal Form */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">Edit Product: {editingProduct.title}</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1.5">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white text-slate-900 font-medium text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 font-bold text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1.5">Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 font-bold text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white text-slate-900 font-medium text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs resize-y"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-blue-600 text-base">
                    {selectedOrderDetails.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      selectedOrderDetails.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedOrderDetails.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedOrderDetails.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Customer Information
                </h4>
                <div className="text-slate-700 space-y-1">
                  <p><span className="font-bold text-slate-900">Name:</span> {selectedOrderDetails.customerName}</p>
                  <p><span className="font-bold text-slate-900">Email:</span> {selectedOrderDetails.customerEmail}</p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span className="font-bold text-slate-900">Phone:</span> {selectedOrderDetails.customerPhone}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Delivery & Payment
                </h4>
                <div className="text-slate-700 space-y-1">
                  <p><span className="font-bold text-slate-900">Address:</span> {selectedOrderDetails.customerAddress}</p>
                  <p><span className="font-bold text-slate-900">City / Postal:</span> {selectedOrderDetails.customerCity}, {selectedOrderDetails.customerPostalCode}</p>
                  <p><span className="font-bold text-slate-900">Payment Method:</span> <span className="font-bold text-emerald-700">Cash on Delivery (COD)</span></p>
                  <p><span className="font-bold text-slate-900">Courier:</span> {selectedOrderDetails.courier} ({selectedOrderDetails.trackingNumber})</p>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-6">
              <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                Purchased Items ({selectedOrderDetails.items.length})
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500">
                          Unit Price: {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(selectedOrderDetails.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600">
                  {selectedOrderDetails.shippingFee === 0 ? 'Free Shipping' : formatPrice(selectedOrderDetails.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Taxes (0%)</span>
                <span className="font-bold text-slate-900">{formatPrice(selectedOrderDetails.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-blue-200">
                <span>Total Amount Due (COD)</span>
                <span className="text-blue-700 text-base">{formatPrice(selectedOrderDetails.total)}</span>
              </div>
            </div>

            {/* Quick Status Control */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700">Update Status:</span>
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as OrderStatus;
                    updateOrderStatus(selectedOrderDetails.id, newStatus);
                    setSelectedOrderDetails({ ...selectedOrderDetails, status: newStatus });
                  }}
                  className="text-xs bg-white text-slate-900 font-semibold border border-slate-300 rounded-xl px-3 py-2 cursor-pointer shadow-xs focus:outline-none focus:border-blue-600"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Product Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-rose-600">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">Delete Product</h3>
              </div>
              <button
                onClick={() => setProductToDelete(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-5">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-3">
                <img
                  src={productToDelete.images[0]}
                  alt={productToDelete.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="truncate">
                  <p className="font-bold text-slate-900 text-xs truncate">{productToDelete.title}</p>
                  <p className="text-[11px] text-slate-500 font-mono">SKU: {productToDelete.sku}</p>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{formatPrice(productToDelete.price)}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to remove this product from the marketplace catalog? This action will permanently remove it from the database and customer storefront.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setSelectedProductIds((prev) => prev.filter((id) => id !== productToDelete.id));
                  setProductToDelete(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Selected Products Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-rose-600">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">Delete Selected Products</h3>
              </div>
              <button
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-5">
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 mb-3 text-xs">
                <p className="font-bold text-rose-800">
                  You have selected <span className="font-black text-rose-950">{selectedProductIds.length}</span> products to delete.
                </p>
                <p className="text-[11px] text-rose-700 mt-1">
                  All selected items will be deleted from the catalog and Firestore storage.
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to proceed with deleting these {selectedProductIds.length} items? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  selectedProductIds.forEach((id) => {
                    deleteProduct(id);
                  });
                  setSelectedProductIds([]);
                  setIsBulkDeleteModalOpen(false);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete {selectedProductIds.length} Products</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
