import React from 'react';

interface ZStoreLogoProps {
  variant?: 'full' | 'icon' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const ZStoreLogo: React.FC<ZStoreLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 44, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 56, text: 'text-3xl', sub: 'text-sm' }
  };

  const { icon, text, sub } = sizeMap[size];
  const isWhite = variant === 'white';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      id="zstore-main-logo"
    >
      {/* Precision Geometric Z Monogram */}
      <div className="relative flex-shrink-0" style={{ width: icon, height: icon }}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Primary Deep Blue Gradient */}
            <linearGradient id="zGradientTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            {/* Vibrant Diagonal Bar Gradient */}
            <linearGradient id="zGradientDiag" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            {/* Deep Foundation Bottom Gradient */}
            <linearGradient id="zGradientBottom" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            {/* Subtle Inner Glow */}
            <radialGradient id="zGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Rounded Hexagonal / Shield Base Backdrop */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="22"
            fill={isWhite ? '#0F172A' : '#0B192C'}
            stroke={isWhite ? 'rgba(255,255,255,0.15)' : 'rgba(30, 58, 138, 0.3)'}
            strokeWidth="2"
          />

          {/* Subtle Ambient Radial Highlight */}
          <circle cx="50" cy="50" r="40" fill="url(#zGlow)" />

          {/* Upper Horizontal Bar of Z with Chamfer */}
          <path
            d="M24 26C24 24.8954 24.8954 24 26 24H72C74.2091 24 75.5 26.3 74.2 28.1L58 48H24V26Z"
            fill="url(#zGradientTop)"
          />

          {/* Powerful Dynamic Center Diagonal of Z */}
          <path
            d="M58 46L36.8 72H26C23.7909 72 22.5 69.7 23.8 67.9L46.2 38H68L58 46Z"
            fill="url(#zGradientDiag)"
          />

          {/* Lower Horizontal Bar of Z with Chamfer & Grounding */}
          <path
            d="M38 68L26 84H74C75.1046 84 76 83.1046 76 82V60H64L48 76H32L38 68Z"
            fill="url(#zGradientBottom)"
          />

          {/* Geometric Facet Accent / Speed Slice */}
          <polygon
            points="70,24 76,24 64,42 58,42"
            fill="#38BDF8"
            opacity="0.9"
          />

          {/* Small Precision Corner Dot */}
          <circle cx="74" cy="74" r="3.5" fill="#38BDF8" />
        </svg>
      </div>

      {/* Typography: Brand Name + Marketplace Badge */}
      {variant !== 'icon' && (
        <div className="flex flex-col">
          <div className="flex items-baseline tracking-tight font-extrabold leading-none">
            <span className="text-blue-500 font-black">Z</span>
            <span className={isWhite ? 'text-white' : 'text-slate-900'}>Store</span>
          </div>
          <span
            className={`font-semibold tracking-widest uppercase ${sub} ${
              isWhite ? 'text-blue-300/80' : 'text-slate-500'
            }`}
          >
            MARKETPLACE
          </span>
        </div>
      )}
    </div>
  );
};
