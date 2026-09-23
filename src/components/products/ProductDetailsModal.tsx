import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Zap,
  Check,
  Share2,
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  isModal?: boolean;
  onClose?: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  isModal = false,
  onClose
}) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentView,
    addProductReview,
    formatPrice,
    products,
    showToast
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : undefined
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'shipping'>('specs');

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');

  // Postal code estimator
  const [zipcode, setZipcode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipcode.trim()) {
      setDeliveryEstimate(`Cash on Delivery available to ${zipcode.trim()} in 2-3 business days via TCS / Leopards`);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim() || !newName.trim()) {
      showToast('error', 'Missing Information', 'Please fill in all review fields.');
      return;
    }

    addProductReview(product.id, {
      userName: newName.trim(),
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      verifiedPurchase: true,
      helpfulCount: 1
    });

    setShowReviewForm(false);
    setNewTitle('');
    setNewComment('');
    setNewName('');
  };

  // Related products from same category or brand
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className={`bg-white ${isModal ? 'p-6 rounded-3xl max-h-[90vh] overflow-y-auto' : 'pb-16'}`} id="product-details-container">
      {/* Breadcrumb Navigation (when full page) */}
      {!isModal && (
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            onClick={() => setCurrentView('catalog')}
            className="hover:text-blue-600 transition-colors"
          >
            Catalog
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-semibold truncate">{product.title}</span>
        </div>
      )}

      {/* Modal Close Button */}
      {isModal && onClose && (
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Showcase: Gallery & Details Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left Column: Multi-Angle Image Gallery */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    idx === activeImageIndex
                      ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm'
                      : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Primary Viewport Image */}
          <div className="flex-1 relative aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-md">
                -{product.discountPercentage}% OFF
              </div>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-all ${
                isFavorited
                  ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                  : 'bg-white/90 text-slate-700 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Column: Information, Pricing, Options, CTAs */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Brand, Category & SKU */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-blue-600 uppercase tracking-wider">{product.brand}</span>
            <span>SKU: {product.sku}</span>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
            {product.title}
          </h1>

          {/* Ratings and Stock Bar */}
          <div className="flex items-center gap-4 text-xs pb-4 border-b border-slate-200 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-current" />
              <span>{product.rating}</span>
            </div>
            <span className="text-slate-500 font-medium">
              {product.reviewCount} Verified Ratings
            </span>
            <span className="text-slate-300">|</span>
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                Out of Stock
              </span>
            ) : product.stock <= 8 ? (
              <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                Hurry, only {product.stock} left in stock!
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> In Stock ({product.stock} units ready to dispatch)
              </span>
            )}
          </div>

          {/* Price Banner */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-6 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Inclusive of all sales taxes • Fast 2-day delivery
              </p>
            </div>
            {product.discountPercentage > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-xl">
                Save {formatPrice(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Color: <span className="text-blue-600 capitalize">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`group relative flex items-center gap-2 p-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedColor === color.name
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-lg border border-black/10 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-slate-800 pr-1">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size / Capacity Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Select Option / Size: <span className="text-blue-600">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls & Purchase Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-300 rounded-xl p-1 bg-slate-50 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg disabled:opacity-30 text-base font-bold transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-bold text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
                className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg disabled:opacity-30 text-base font-bold transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 w-full py-3.5 px-6 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              id="details-add-to-cart-btn"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            {/* Buy Now CTA */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              id="details-buy-now-btn"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Delivery & Assurance Box */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
            <form onSubmit={handleCheckDelivery} className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter city or postal code (e.g. Lahore, 54000)"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2 py-1.5"
              >
                Estimate
              </button>
            </form>
            {deliveryEstimate && (
              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                {deliveryEstimate}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Genuine Product
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-4 h-4 text-blue-600" /> 30-Day Returns
              </span>
              <span>{product.warranty || '2-Year Warranty'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications, Reviews, Shipping & Warranty */}
      <div className="border-t border-slate-200 pt-10">
        <div className="flex items-center gap-6 border-b border-slate-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
              {product.reviews.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Shipping, Guarantee & Policy
          </button>
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between p-3.5 bg-slate-50 rounded-xl text-xs border border-slate-200/80"
                >
                  <span className="font-semibold text-slate-500">{key}</span>
                  <span className="font-bold text-slate-900 text-right">{val}</span>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
                  Product Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Verified Customer Feedback</h3>
                <p className="text-xs text-slate-500">
                  Real reviews from verified purchasers of {product.title}.
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                id="write-review-btn"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Product Review'}
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 max-w-xl space-y-4"
              >
                <h4 className="text-sm font-bold text-slate-900">Share your experience</h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-slate-300 hover:text-amber-400"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? 'text-amber-400 fill-current' : ''
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Jordan Hayes"
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Flawless audio fidelity & superb battery"
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detailed Review
                  </label>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe build quality, real-world performance, and comfort..."
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Submit Verified Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            {product.reviews.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl">
                <p className="text-sm font-semibold text-slate-700">No reviews yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Be the first verified customer to review this product!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mb-1">{rev.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Shipping & Guarantee */}
        {activeTab === 'shipping' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Shipping & COD Policies
              </h4>
              <p className="leading-relaxed">
                Orders placed before 2:00 PM are packaged and dispatched on the same business day.
                Cash on Delivery (COD) is supported across all major cities of Pakistan via TCS, Leopards,
                and Trax within 2-4 business days. Tracking details are automatically updated upon pickup.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                30-Day Return Guarantee
              </h4>
              <p className="leading-relaxed">
                If you are not completely satisfied, return the item within 30 days of delivery in
                its original packaging for a full refund or exchange. We provide complimentary
                prepaid shipping return labels.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Warranty & Protection
              </h4>
              <p className="leading-relaxed">
                {product.warranty || '2-Year International Manufacturer Warranty'}. Covered against
                factory defects, internal mechanical or electrical failures with genuine replacement
                parts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Frequently Bought Together
              </h3>
              <p className="text-xs text-slate-500">
                Customers who viewed this item also purchased these recommendations.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductDetailsModal: React.FC = () => {
  return null;
};

