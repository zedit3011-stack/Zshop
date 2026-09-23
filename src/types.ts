export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  flashDealEndsAt?: string;
  tags: string[];
  images: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  specs: Record<string, string>;
  highlights: string[];
  warranty?: string;
  shippingDays: number;
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'credit_card' | 'apple_pay' | 'paypal' | 'cash_on_delivery';
  paymentStatus: 'paid' | 'pending';
  shippingAddress: {
    fullName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber: string;
  courier: string;
  estimatedDelivery: string;
  createdAt: string;
  timeline: OrderTimelineStep[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phoneNumber?: string;
  addresses?: Array<{
    id: string;
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    isDefault: boolean;
  }>;
  totalOrders: number;
  totalSpent: number;
  memberSince: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  itemCount: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  brand?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
