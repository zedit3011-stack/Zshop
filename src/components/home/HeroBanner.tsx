import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  discount: string;
  category: string;
  bgGradient: string;
  image: string;
  buttonText: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'NEW ARRIVAL • 2026 COLLECTION',
    title: 'Acoustic Precision Reimagined',
    subtitle: 'Studio-grade wireless ANC headphones featuring custom beryllium drivers and 50-hour playback.',
    discount: 'UP TO 25% OFF',
    category: 'Electronics & Audio',
    bgGradient: 'from-slate-950 via-slate-900 to-blue-950',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Shop Audio Collection'
  },
  {
    id: 2,
    tag: 'LIMITED RUN HOROLOGY',
    title: 'Swiss Calibrated Sapphire Heritage',
    subtitle: 'Surgical 316L stainless steel casing with Italian vegetable-tanned leather and 100m water resistance.',
    discount: 'SPECIAL LAUNCH PRICE',
    category: 'Watches & Accessories',
    bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Discover Timepieces'
  },
  {
    id: 3,
    tag: 'PRO WORKSPACE ESSENTIALS',
    title: 'Ergonomic Excellence & Speed',
    subtitle: 'Supercritical running footwear, mechanical keyboards, and orthopedic mesh executive chairs.',
    discount: 'SAVE UP TO RS. 40,000',
    category: 'Workspace & Ergonomics',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Upgrade Workspace'
  }
];

export const HeroBanner: React.FC = () => {
  const { setCurrentView, setFilters } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleCtaClick = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === 'all' ? 'all' : category
    }));
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 text-white shadow-xl mb-6 sm:mb-8" id="zstore-hero-banner">
      {/* Background Graphic & Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-5 sm:py-7 lg:py-8 flex flex-col justify-center min-h-[190px] sm:min-h-[220px] md:min-h-[240px]">
        <div className="max-w-xl pr-2 sm:pr-0">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-2.5 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>{slide.tag}</span>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug mb-1.5 sm:mb-2">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300 mb-3.5 sm:mb-4 leading-relaxed font-normal max-w-lg line-clamp-2 sm:line-clamp-none">
            {slide.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              onClick={() => handleCtaClick(slide.category)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center gap-1.5 group"
              id="hero-cta-primary-btn"
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, onSaleOnly: true, category: 'all' }));
                setCurrentView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5"
              id="hero-cta-secondary-btn"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Flash Deals</span>
            </button>
          </div>
        </div>

        {/* Floating Discount Tag on large screens */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-base">
            %
          </div>
          <div>
            <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
              Limited Promotional Offer
            </p>
            <p className="text-base font-black text-white">{slide.discount}</p>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-3 right-4 sm:right-8 z-20 flex items-center gap-2">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
