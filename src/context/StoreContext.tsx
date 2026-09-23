import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  DEMO_USERS
} from '../data/initialData';
import {
  CartItem,
  Category,
  FilterState,
  Order,
  OrderStatus,
  Product,
  ProductReview,
  ToastMessage,
  User
} from '../types';

export type ActiveView =
  | 'home'
  | 'catalog'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'wishlist'
  | 'admin'
  | 'admin-login'
  | 'account';

interface AdminSessionUser {
  name: string;
  email: string;
  role: 'admin';
}

interface StoreContextType {
  // Navigation & Views
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  selectedProductId: string | null;
  selectedProduct: Product | null;
  openProductDetails: (productId: string) => void;
  closeProductDetails: () => void;
  trackingSearchId: string | null;
  setTrackingSearchId: (id: string | null) => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (productData: Omit<Product, 'id' | 'slug' | 'reviews'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (id: string, newStock: number) => void;
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  totalCartItemsCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveWishlistToCart: () => void;

  // Customer Auth & User
  currentUser: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;

  // Admin Dedicated Authentication & Protection
  isAdminAuthenticated: boolean;
  adminSessionUser: AdminSessionUser | null;
  adminAuthLoading: boolean;
  adminAuthError: string | null;
  adminLogin: (identifier: string, password: string) => Promise<boolean>;
  adminLogout: () => Promise<void>;
  verifyAdminSession: () => Promise<boolean>;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (id: string) => Order | undefined;

  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast notifications
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;

  // Utilities
  formatPrice: (amount: number) => string;

  // Firebase status
  isFirebaseConnected: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'zstore_state_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage caching if available
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_wishlist`);
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    // Ensure currentUser is strictly a customer, never an admin bypass
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, role: 'customer' };
      } catch {
        return DEMO_USERS[0];
      }
    }
    return DEMO_USERS[0];
  });

  // Dedicated Admin Authentication State
  const ADMIN_SESSION_STORAGE_KEY = 'zstore_admin_token_v1';
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
  });
  const [adminSessionUser, setAdminSessionUser] = useState<AdminSessionUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminAuthLoading, setAdminAuthLoading] = useState<boolean>(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // Initialize view from URL if requested (/admin strictly protected)
  const [currentView, setCurrentView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin') {
        const token = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
        return token ? 'admin' : 'admin-login';
      }
      if (path === '/admin/login' || path === '/admin-login') return 'admin-login';
    }
    return 'home';
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackingSearchId, setTrackingSearchId] = useState<string | null>(null);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Search & Filter state
  const initialFilterState: FilterState = {
    searchQuery: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 300000,
    minRating: 0,
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'featured'
  };
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist important data
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
    } catch {
      // Ignore quota errors
    }
  }, [products]);

  // Firestore Real-time Listeners and Database Hydration
  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribeOrders: (() => void) | undefined;

    const setupFirestore = async () => {
      try {
        const productsCol = collection(db, 'products');
        const ordersCol = collection(db, 'orders');

        // Check if products collection is empty; if so, seed it with INITIAL_PRODUCTS
        const productsSnapshot = await getDocs(productsCol);
        if (productsSnapshot.empty) {
          const batch = writeBatch(db);
          INITIAL_PRODUCTS.forEach((prod) => {
            const docRef = doc(productsCol, prod.id);
            batch.set(docRef, prod);
          });
          INITIAL_ORDERS.forEach((ord) => {
            const ordRef = doc(ordersCol, ord.id);
            batch.set(ordRef, ord);
          });
          await batch.commit();
        }

        // Realtime listener for Products
        unsubscribeProducts = onSnapshot(
          productsCol,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedProducts: Product[] = [];
              snapshot.forEach((d) => {
                loadedProducts.push(d.data() as Product);
              });
              setProducts(loadedProducts);
              setIsFirebaseConnected(true);
            }
          },
          (err) => {
            console.warn('Firestore products listener fallback to local state:', err);
          }
        );

        // Realtime listener for Orders
        unsubscribeOrders = onSnapshot(
          ordersCol,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedOrders: Order[] = [];
              snapshot.forEach((d) => {
                loadedOrders.push(d.data() as Order);
              });
              // Sort newest first
              loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setOrders(loadedOrders);
              setIsFirebaseConnected(true);
            }
          },
          (err) => {
            console.warn('Firestore orders listener fallback to local state:', err);
          }
        );

        setIsFirebaseConnected(true);
      } catch (err) {
        console.warn('Firestore connection initialized with offline support:', err);
      }
    };

    setupFirestore();

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_cart`, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_wishlist`, JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(currentUser));
    } catch {
      // Ignore
    }
  }, [currentUser]);

  // Toast Helper
  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, 4200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Selected product object
  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  // Open product details
  const openProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProductDetails = () => {
    setSelectedProductId(null);
    if (currentView === 'product-details') {
      setCurrentView('catalog');
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const itemColor = color || (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    const itemSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === itemColor &&
          item.selectedSize === itemSize
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        const newQty = newCart[existingIndex].quantity + quantity;
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: Math.min(newQty, product.stock)
        };
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity: Math.min(quantity, product.stock),
            selectedColor: itemColor,
            selectedSize: itemSize
          }
        ];
      }
    });

    showToast('success', 'Added to Cart', `${product.title} has been added to your shopping cart.`);
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          return {
            ...item,
            quantity: Math.min(quantity, item.product.stock)
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    showToast('info', 'Item Removed', 'The item was removed from your cart.');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string): boolean => {
    const sanitized = code.trim().toUpperCase();
    if (sanitized === 'ZSTORE10') {
      setAppliedCoupon('ZSTORE10');
      showToast('success', '10% Discount Applied!', 'Coupon ZSTORE10 saved you 10% on your entire order.');
      return true;
    } else if (sanitized === 'WELCOME20') {
      setAppliedCoupon('WELCOME20');
      showToast('success', '20% Welcome Discount!', 'Coupon WELCOME20 saved you 20% on your order.');
      return true;
    } else if (sanitized === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      showToast('success', 'Free Shipping Applied!', 'Shipping charges have been waived.');
      return true;
    } else {
      showToast('error', 'Invalid Coupon', 'The code entered is invalid or expired. Try ZSTORE10 or WELCOME20.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('info', 'Coupon Removed', 'Discount coupon was removed.');
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon === 'ZSTORE10') {
    cartDiscount = Math.round(cartSubtotal * 0.1);
  } else if (appliedCoupon === 'WELCOME20') {
    cartDiscount = Math.round(cartSubtotal * 0.2);
  }

  // Free delivery threshold at Rs. 5,000 or with FREESHIP coupon (standard Rs. 250 delivery fee)
  const cartShipping = cartSubtotal === 0 || cartSubtotal >= 5000 || appliedCoupon === 'FREESHIP' ? 0 : 250;
  const cartTax = 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);
  const totalCartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const targetProduct = products.find((p) => p.id === productId);
      if (exists) {
        showToast('info', 'Removed from Wishlist', `${targetProduct?.title || 'Item'} removed.`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast('success', 'Saved to Wishlist', `${targetProduct?.title || 'Item'} added to your wishlist.`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveWishlistToCart = () => {
    let addedCount = 0;
    wishlist.forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product && product.stock > 0) {
        addToCart(product, 1);
        addedCount++;
      }
    });
    setWishlist([]);
    showToast('success', 'Wishlist Transferred', `Moved ${addedCount} items directly to your shopping cart.`);
  };

  // Customer Auth
  const login = (email: string) => {
    const existing = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser({ ...existing, role: 'customer' });
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'customer',
        memberSince: 'Today',
        totalOrders: 0,
        totalSpent: 0
      };
      setCurrentUser(newUser);
    }
    setIsAuthModalOpen(false);
    showToast('success', 'Signed In', `Welcome back, ${currentUser?.name || email}!`);
  };

  const signup = (name: string, email: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'customer',
      memberSince: 'Today',
      totalOrders: 0,
      totalSpent: 0
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast('success', 'Account Created', `Welcome to ZStore, ${name}!`);
  };

  const logout = () => {
    setCurrentUser(null);
    if (currentView === 'account') {
      setCurrentView('home');
    }
    showToast('info', 'Signed Out', 'You have been safely signed out.');
  };

  // Dedicated Admin Authentication Methods
  const verifyAdminSession = async (): Promise<boolean> => {
    const token = adminToken || sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!token) {
      setIsAdminAuthenticated(false);
      setAdminSessionUser(null);
      return false;
    }

    try {
      const res = await fetch('/api/admin/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAdminAuthenticated(true);
        setAdminSessionUser(data.admin);
        return true;
      } else {
        sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
        setAdminToken(null);
        setIsAdminAuthenticated(false);
        setAdminSessionUser(null);
        return false;
      }
    } catch (err) {
      // In case server is offline or restarting, check token validity safely
      console.warn('Admin session verification check failed:', err);
      return false;
    }
  };

  const adminLogin = async (identifier: string, password: string): Promise<boolean> => {
    setAdminAuthLoading(true);
    setAdminAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || 'Invalid administrator credentials. Access denied.';
        setAdminAuthError(errorMsg);
        setAdminAuthLoading(false);
        return false;
      }

      // Successful authentication
      const token = data.token;
      sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, token);
      setAdminToken(token);
      setIsAdminAuthenticated(true);
      setAdminSessionUser(data.admin);
      setAdminAuthLoading(false);
      setAdminAuthError(null);

      // Navigate to admin dashboard and push state
      setCurrentView('admin');
      if (typeof window !== 'undefined') {
        window.history.pushState({ view: 'admin' }, '', '/admin');
      }

      showToast('success', 'Admin Authenticated', 'Secure access granted to Executive Management Portal.');
      return true;
    } catch (err) {
      const errorMsg = 'Authentication service unavailable. Please check server connection.';
      setAdminAuthError(errorMsg);
      setAdminAuthLoading(false);
      return false;
    }
  };

  const adminLogout = async () => {
    const token = adminToken || sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    try {
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch {
      // Ignore network errors on logout
    }

    // Invalidate session immediately
    sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    setAdminSessionUser(null);
    setAdminAuthError(null);

    // Redirect to login and replace history to keep route on /admin
    setCurrentView('admin-login');
    if (typeof window !== 'undefined') {
      window.history.replaceState({ view: 'admin-login' }, '', '/admin');
    }

    showToast('info', 'Logged Out', 'Administrator session terminated.');
  };

  // Check admin session on initial mount or when adminToken changes
  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (token) {
      verifyAdminSession();
    }
  }, []);

  // Strict route protection: If currentView is 'admin' but not authenticated, redirect to 'admin-login'
  useEffect(() => {
    if (currentView === 'admin' && !isAdminAuthenticated) {
      // Check if session token exists
      const token = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
      if (!token) {
        setCurrentView('admin-login');
        if (typeof window !== 'undefined') {
          window.history.replaceState({ view: 'admin-login' }, '', '/admin');
        }
      }
    }
  }, [currentView, isAdminAuthenticated]);

  // Handle browser back/forward buttons with authentication protection
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin') {
        const token = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
        if (!token) {
          setCurrentView('admin-login');
          window.history.replaceState({ view: 'admin-login' }, '', '/admin');
        } else {
          setCurrentView('admin');
        }
      } else if (path === '/admin/login' || path === '/admin-login') {
        setCurrentView('admin-login');
      } else if (path === '/' || path === '') {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Orders
  const createOrder = (orderData: {
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `ZS-${randomSuffix}`;
    const now = new Date();

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      title: item.product.title,
      image: item.product.images[0],
      price: item.product.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((p) => {
        const boughtItem = cart.find((c) => c.product.id === p.id);
        if (boughtItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - boughtItem.quantity)
          };
        }
        return p;
      })
    );

    const newOrder: Order = {
      id: newId,
      userId: currentUser?.id || 'guest-user',
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      discountCode: appliedCoupon || undefined,
      shippingFee: cartShipping,
      tax: cartTax,
      total: cartTotal,
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'pending',
      shippingAddress: orderData.shippingAddress,
      trackingNumber: `ZS-PK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courier: 'TCS Courier COD Express',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: now.toISOString(),
      timeline: [
        {
          status: 'pending',
          label: 'Order Verified',
          description: 'Cash on Delivery order confirmed and queued for fulfillment.',
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          status: 'processing',
          label: 'Processing & Packaging',
          description: 'Item being picked, wrapped in eco-packaging, and quality verified.',
          completed: false
        },
        {
          status: 'shipped',
          label: 'Dispatched to Carrier',
          description: 'Carrier collection from ZStore fulfillment warehouse.',
          completed: false
        },
        {
          status: 'out_for_delivery',
          label: 'Out for Delivery',
          description: 'Courier en route to shipping address.',
          completed: false
        },
        {
          status: 'delivered',
          label: 'Delivered',
          description: 'Package delivered to recipient.',
          completed: false
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setTrackingSearchId(newOrder.id);
    showToast('success', 'Order Confirmed!', `Your order ${newOrder.id} has been placed successfully.`);

    // Persist order to Firestore
    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err) => {
        console.warn('Could not persist order to Firestore:', err);
      });
    } catch (err) {
      console.warn('Firestore write error:', err);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    let updatedOrderObj: Order | undefined;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = order.timeline.map((step) => {
          const stepOrder: OrderStatus[] = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
          const targetIndex = stepOrder.indexOf(newStatus);
          const stepIndex = stepOrder.indexOf(step.status);

          return {
            ...step,
            completed: stepIndex <= targetIndex,
            current: stepIndex === targetIndex,
            timestamp: stepIndex === targetIndex ? 'Updated recently' : step.timestamp
          };
        });

        const updated = {
          ...order,
          status: newStatus,
          timeline: updatedTimeline
        };
        updatedOrderObj = updated;
        return updated;
      })
    );

    if (updatedOrderObj) {
      try {
        setDoc(doc(db, 'orders', orderId), updatedOrderObj, { merge: true }).catch((err) => {
          console.warn('Could not update order status in Firestore:', err);
        });
      } catch (err) {
        console.warn('Firestore update error:', err);
      }
    }

    showToast('success', 'Order Updated', `Order ${orderId} marked as ${newStatus}.`);
  };

  const getOrderById = (id: string) => {
    return orders.find(
      (o) =>
        o.id.toLowerCase() === id.trim().toLowerCase() ||
        o.trackingNumber.toLowerCase() === id.trim().toLowerCase()
    );
  };

  // Product Management (Admin)
  const addProduct = (productData: Omit<Product, 'id' | 'slug' | 'reviews'>) => {
    const newId = `prod-${Date.now()}`;
    const slug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      ...productData,
      id: newId,
      slug,
      reviews: []
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Save to Firestore
    try {
      setDoc(doc(db, 'products', newId), newProduct).catch((err) => {
        console.warn('Could not save product to Firestore:', err);
      });
    } catch (err) {
      console.warn('Firestore write error:', err);
    }

    showToast('success', 'Product Added', `${productData.title} was created in the marketplace.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let updatedProductObj: Product | undefined;
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const updated = { ...prod, ...updates };
          updatedProductObj = updated;
          return updated;
        }
        return prod;
      })
    );

    if (updatedProductObj) {
      try {
        setDoc(doc(db, 'products', id), updatedProductObj, { merge: true }).catch((err) => {
          console.warn('Could not update product in Firestore:', err);
        });
      } catch (err) {
        console.warn('Firestore write error:', err);
      }
    }

    showToast('success', 'Product Updated', 'Product details saved successfully.');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((prod) => prod.id !== id));

    // Delete from Firestore
    try {
      deleteDoc(doc(db, 'products', id)).catch((err) => {
        console.warn('Could not delete product in Firestore:', err);
      });
    } catch (err) {
      console.warn('Firestore delete error:', err);
    }

    showToast('info', 'Product Deleted', `${target?.title || 'Product'} has been deleted.`);
  };

  const restockProduct = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, stock: newStock };
          try {
            setDoc(doc(db, 'products', id), { stock: newStock }, { merge: true }).catch((err) => {
              console.warn('Could not update product stock in Firestore:', err);
            });
          } catch (err) {
            console.warn('Firestore write error:', err);
          }
          return updated;
        }
        return p;
      })
    );
    showToast('success', 'Inventory Updated', `Stock quantity updated to ${newStock}.`);
  };

  const addProductReview = (productId: string, reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const newAvgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: Math.round(newAvgRating * 10) / 10
          };
        }
        return p;
      })
    );
    showToast('success', 'Review Published', 'Thank you for rating this product!');
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
    setSearchQuery('');
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        selectedProduct,
        openProductDetails,
        closeProductDetails,
        trackingSearchId,
        setTrackingSearchId,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        addProductReview,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartShipping,
        cartTax,
        cartTotal,
        totalCartItemsCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveWishlistToCart,
        currentUser,
        login,
        signup,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isAdminAuthenticated,
        adminSessionUser,
        adminAuthLoading,
        adminAuthError,
        adminLogin,
        adminLogout,
        verifyAdminSession,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        filters,
        setFilters,
        resetFilters,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        dismissToast,
        formatPrice,
        isFirebaseConnected
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
