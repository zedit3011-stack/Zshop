import { Category, Order, Product, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics & Audio',
    slug: 'electronics',
    description: 'Noise-cancelling headphones, smart speakers, high-fidelity sound, and gaming gear.',
    iconName: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    itemCount: 42
  },
  {
    id: 'smartphones-tablets',
    name: 'Phones & Computing',
    slug: 'phones-computing',
    description: 'Ultra-thin laptops, flagship smartphones, productivity tablets and accessories.',
    iconName: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    itemCount: 38
  },
  {
    id: 'smart-home',
    name: 'Smart Home & Living',
    slug: 'smart-home',
    description: 'Ambient lighting, robotic assistants, smart climate controls and home security.',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    itemCount: 29
  },
  {
    id: 'fashion',
    name: 'Modern Apparel & Wear',
    slug: 'fashion',
    description: 'Minimalist outerwear, tailored essentials, organic cotton tees and tech-fabrics.',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    itemCount: 56
  },
  {
    id: 'watches-accessories',
    name: 'Watches & Accessories',
    slug: 'watches-accessories',
    description: 'Precision horology, sapphire smartwatches, leather goods and polarized shades.',
    iconName: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    itemCount: 31
  },
  {
    id: 'footwear',
    name: 'Footwear & Sneakers',
    slug: 'footwear',
    description: 'Performance running shoes, lifestyle low-tops, waterproof trail hikers.',
    iconName: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    itemCount: 24
  },
  {
    id: 'kitchen-coffee',
    name: 'Espresso & Kitchen',
    slug: 'kitchen-coffee',
    description: 'Precision burr grinders, dual-boiler espresso machines and culinary tools.',
    iconName: 'Coffee',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80',
    itemCount: 19
  },
  {
    id: 'workplace-desk',
    name: 'Workspace & Ergonomics',
    slug: 'workplace-desk',
    description: 'Standing desks, ergonomic chairs, mechanical keyboards and studio monitors.',
    iconName: 'Armchair',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    itemCount: 35
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Z-Acoustics Studio Pro Wireless ANC Headphones',
    slug: 'z-acoustics-studio-pro-wireless-anc',
    description: 'Engineered for audiophiles and remote executives. Features hybrid adaptive noise cancellation, custom 45mm beryllium drivers, 50-hour battery life, and plush memory-foam ear cushions wrapped in breathable protein leather.',
    brand: 'Z-Audio',
    category: 'Electronics & Audio',
    price: 34999,
    originalPrice: 42999,
    discountPercentage: 19,
    rating: 4.9,
    reviewCount: 328,
    stock: 24,
    sku: 'ZS-AUD-019',
    isFeatured: true,
    isFlashDeal: true,
    flashDealEndsAt: '2026-09-22T23:59:59Z',
    tags: ['Headphones', 'Wireless', 'ANC', 'Bestseller', 'Audio'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Midnight Navy', hex: '#0F172A' },
      { name: 'Titanium Silver', hex: '#94A3B8' },
      { name: 'Obsidian Black', hex: '#18181B' }
    ],
    specs: {
      'Driver Size': '45mm Custom Beryllium',
      'Battery Life': 'Up to 50 Hours (ANC On)',
      'Connectivity': 'Bluetooth 5.4, Multipoint & 3.5mm AUX',
      'Fast Charge': '15 mins = 8 hours playback',
      'Weight': '258g'
    },
    highlights: [
      'Industry-leading 4-mic hybrid active noise cancellation',
      'Spatial audio tracking with dynamic head orientation',
      'Ultra-low latency gaming and conference mode',
      'Aircraft-grade aluminum headband slider'
    ],
    warranty: '2-Year International Manufacturer Warranty',
    shippingDays: 2,
    reviews: [
      {
        id: 'rev-1',
        userName: 'Alexander M.',
        rating: 5,
        date: '2026-08-14',
        title: 'Remarkable soundstage and premium materials',
        comment: 'These rival headphones costing twice as much. The noise cancellation creates instant silence in crowded coffee shops.',
        verifiedPurchase: true,
        helpfulCount: 42
      },
      {
        id: 'rev-2',
        userName: 'Elena Rostova',
        rating: 5,
        date: '2026-09-02',
        title: 'Battery lasts for days of long video calls',
        comment: 'Crisp microphone clarity for Zoom calls and unbelievable comfort over long 8-hour work sessions.',
        verifiedPurchase: true,
        helpfulCount: 19
      }
    ]
  },
  {
    id: 'prod-2',
    title: 'AeroBook Pro 15 M-Silicon Ultralight Laptop',
    slug: 'aerobook-pro-15-m-silicon-ultralight',
    description: 'Precision-milled unibody chassis weighing only 1.2kg. Powered by next-gen 12-core silicon with a breathtaking 3.2K 120Hz Liquid Retina display, 32GB unified RAM, and 1TB NVMe PCIe 5.0 SSD.',
    brand: 'NovaTech',
    category: 'Phones & Computing',
    price: 289999,
    originalPrice: 325000,
    discountPercentage: 11,
    rating: 4.8,
    reviewCount: 184,
    stock: 12,
    sku: 'ZS-CMP-104',
    isFeatured: true,
    tags: ['Laptop', 'Ultralight', 'Computing', 'High Performance'],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Space Gray', hex: '#334155' },
      { name: 'Silver Frost', hex: '#CBD5E1' }
    ],
    sizes: ['16GB / 512GB', '32GB / 1TB', '64GB / 2TB'],
    specs: {
      'Processor': '12-Core Silicon SoC',
      'Display': '15.3" 3.2K 120Hz TrueColor (500 nits)',
      'Memory': '32GB Unified LPDDR5X',
      'Storage': '1TB NVMe Gen 5 SSD',
      'Battery': '78Whr (up to 21 hours web browsing)'
    },
    highlights: [
      'Magnesium-aluminum unibody construction',
      'Dual Thunderbolt 4 and MagCharge connectors',
      'Six-speaker sound system with force-cancelling woofers',
      '1080p Studio WebCam with hardware privacy shutter'
    ],
    warranty: '1-Year Limited Warranty + 90 Days Tech Support',
    shippingDays: 1,
    reviews: [
      {
        id: 'rev-3',
        userName: 'David Vance',
        rating: 5,
        date: '2026-07-28',
        title: 'The best machine I have coded on',
        comment: 'Zero thermal throttling, silent operation, and the screen is exceptionally vibrant.',
        verifiedPurchase: true,
        helpfulCount: 31
      }
    ]
  },
  {
    id: 'prod-3',
    title: 'Chronos Sapphire Heritage Automatic Watch',
    slug: 'chronos-sapphire-heritage-automatic',
    description: 'Swiss-calibrated 28,800 vph automatic movement housed in surgical-grade 316L stainless steel. Anti-reflective dual-domed sapphire crystal with 100m water resistance and hand-stitched Italian calfskin strap.',
    brand: 'Chronos Geneve',
    category: 'Watches & Accessories',
    price: 64999,
    originalPrice: 79999,
    discountPercentage: 19,
    rating: 4.9,
    reviewCount: 96,
    stock: 8,
    sku: 'ZS-WTC-042',
    isFeatured: true,
    isFlashDeal: true,
    flashDealEndsAt: '2026-09-22T23:59:59Z',
    tags: ['Watch', 'Automatic', 'Luxury', 'Accessories'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Sunburst Navy', hex: '#1E3A8A' },
      { name: 'Emerald Forest', hex: '#065F46' },
      { name: 'Slate Anthracite', hex: '#1F2937' }
    ],
    specs: {
      'Movement': 'Automatic Caliber 4R36 (41h reserve)',
      'Case Diameter': '40mm (Lug-to-lug 47mm)',
      'Crystal': 'Sapphire with triple anti-reflective coating',
      'Water Resistance': '10 ATM / 100 Meters',
      'Strap': 'Full-grain Vegetable Tanned Italian Leather'
    },
    highlights: [
      'Exhibition sapphire caseback revealing rotor',
      'Super-LumiNova BGW9 luminous hands and indices',
      'Quick-release interchangeable spring bars',
      'Individually numbered numbered limited batch'
    ],
    warranty: '5-Year International Movement Warranty',
    shippingDays: 2,
    reviews: [
      {
        id: 'rev-4',
        userName: 'Julian Thorne',
        rating: 5,
        date: '2026-08-30',
        title: 'Masterpiece on the wrist',
        comment: 'Subtle elegance without screaming for attention. Keeps time within +3 seconds per day.',
        verifiedPurchase: true,
        helpfulCount: 22
      }
    ]
  },
  {
    id: 'prod-4',
    title: 'Pulse Horizon Pro Carbon-Plate Running Shoes',
    slug: 'pulse-horizon-pro-carbon-plate-running-shoes',
    description: 'Designed for marathon runners and tempo athletes. Dual-density PEBA supercritical foam combined with a full-length curved carbon fiber propulsion plate for 87% energy return per stride.',
    brand: 'Pulse Lab',
    category: 'Footwear & Sneakers',
    price: 24999,
    originalPrice: 29999,
    discountPercentage: 17,
    rating: 4.7,
    reviewCount: 215,
    stock: 19,
    sku: 'ZS-FTW-088',
    isFeatured: true,
    tags: ['Running', 'Carbon Plate', 'Sneakers', 'Athletic'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Velocity Crimson', hex: '#DC2626' },
      { name: 'Solar Cobalt', hex: '#2563EB' },
      { name: 'Pure Phantom', hex: '#111827' }
    ],
    sizes: ['US 8', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'],
    specs: {
      'Stack Height': '39mm Heel / 31mm Forefoot (8mm drop)',
      'Weight': '198g (Men’s US 9)',
      'Upper': 'AtomKnit 2.0 breathable engineered mesh',
      'Midsole': 'Supercritical Nitrogen-infused PEBA',
      'Outsole': 'Continental Rubber Compound'
    },
    highlights: [
      'Proprietary WavePlate carbon propulsion spoon',
      'Ultralight seamless internal heel cage',
      'Reinforced high-wear zonal traction pods'
    ],
    warranty: '90-Day Performance Fit Guarantee',
    shippingDays: 2,
    reviews: []
  },
  {
    id: 'prod-5',
    title: 'Aura Minimalist Water-Resistant Tech Backpack 26L',
    slug: 'aura-minimalist-water-resistant-tech-backpack',
    description: 'Streamlined aesthetic tailored for urban commutes and intercontinental travel. Constructed from recycled 840D ballistic nylon with YKK Aquaguard weatherproof zippers and a suspended 16-inch laptop cocoon.',
    brand: 'Aura Studio',
    category: 'Watches & Accessories',
    price: 16499,
    originalPrice: 19999,
    discountPercentage: 18,
    rating: 4.8,
    reviewCount: 142,
    stock: 35,
    sku: 'ZS-BAG-051',
    isFeatured: true,
    tags: ['Backpack', 'Travel', 'Waterproof', 'Accessories'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Matte Charcoal', hex: '#374151' },
      { name: 'Deep Navy', hex: '#1E3A8A' },
      { name: 'Moss Green', hex: '#3F6212' }
    ],
    specs: {
      'Capacity': '26 Liters',
      'Laptop Compartment': 'Suspended fits up to 16.2" MacBook / ThinkPad',
      'Material': 'Weatherproof Cordura 840D Recycled Nylon',
      'Dimensions': '48cm x 31cm x 17cm',
      'Weight': '980g'
    },
    highlights: [
      'Luggage pass-through strap for rolling suitcases',
      'Hidden RFID-blocking passport security pocket',
      'Self-standing balanced base architecture',
      'Ergonomic EVA dual-channel airflow back panel'
    ],
    warranty: 'Lifetime Craftsmanship Guarantee',
    shippingDays: 2,
    reviews: []
  },
  {
    id: 'prod-6',
    title: 'Barista Precision Touch Dual-Boiler Espresso Machine',
    slug: 'barista-precision-touch-dual-boiler-espresso',
    description: 'Brings third-wave specialty cafe espresso directly to your kitchen island. Dual PID stainless steel boilers, commercial 58mm portafilter, 9-bar rotary vane pump, and automated microfoam milk texturing wand.',
    brand: 'Caffe Artisan',
    category: 'Espresso & Kitchen',
    price: 185000,
    originalPrice: 215000,
    discountPercentage: 14,
    rating: 4.9,
    reviewCount: 78,
    stock: 6,
    sku: 'ZS-KTC-023',
    isFeatured: true,
    isFlashDeal: true,
    flashDealEndsAt: '2026-09-22T23:59:59Z',
    tags: ['Espresso', 'Coffee', 'Kitchen', 'Luxury'],
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Brushed Stainless', hex: '#E2E8F0' },
      { name: 'Matte Black', hex: '#1E293B' }
    ],
    specs: {
      'Boiler System': 'Dual Stainless Steel PID controlled',
      'Pump Pressure': '15 Bar Italian Rotary Vane Pump (Brewed at 9 Bar)',
      'Water Tank': '2.5L BPA-free removable with water filter',
      'Heat Up Time': 'Instant 3-second ThermoJet warm up',
      'Portafilter': 'Commercial Grade 58mm Stainless Steel'
    },
    highlights: [
      'Simultaneous espresso extraction and milk steaming',
      'Digital touch display with 8 programmable drink recipes',
      'Precise temperature control (+/- 1 degree Celsius)',
      'Pre-infusion low pressure gradual soaking'
    ],
    warranty: '3-Year Comprehensive Home Warranty',
    shippingDays: 3,
    reviews: []
  },
  {
    id: 'prod-7',
    title: 'Lumina Smart Ambient Sound & Light Hub',
    slug: 'lumina-smart-ambient-sound-light-hub',
    description: 'Transform any living space into a calm sanctuary. Combines circadian lighting cycles, 360-degree acoustic acoustic sound diffusion, wireless Qi fast charging pad, and hands-free voice integration.',
    brand: 'Lumina Life',
    category: 'Smart Home & Living',
    price: 22999,
    originalPrice: 28999,
    discountPercentage: 21,
    rating: 4.6,
    reviewCount: 94,
    stock: 22,
    sku: 'ZS-SMT-067',
    tags: ['Smart Home', 'Ambient', 'Lighting', 'Speaker'],
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Nordic Oak & White', hex: '#F8FAFC' },
      { name: 'Walnut & Obsidian', hex: '#27272A' }
    ],
    specs: {
      'Color Spectrum': '16 Million Colors + 2200K-6500K Tunable White',
      'Speaker Output': '25W High-Excursion Neodymium Driver',
      'Wireless Charging': '15W Qi2 Certified Fast Pad',
      'Smart Connectivity': 'Thread, Matter, Wi-Fi 6, Bluetooth 5.3'
    },
    highlights: [
      'Sunset & Sunrise dawn simulator for natural wakeups',
      'Synced music rhythm visualization mode',
      'Works with Apple Home, Google Home, and Alexa Matter'
    ],
    warranty: '2-Year Replacement Warranty',
    shippingDays: 2,
    reviews: []
  },
  {
    id: 'prod-8',
    title: 'Keyforge Apex 75% Wireless Mechanical Keyboard',
    slug: 'keyforge-apex-75-wireless-mechanical-keyboard',
    description: 'Gasket-mounted acoustic dampening with factory pre-lubed tactile switches, hot-swappable PCB, CNC-anodized aluminum case, OLED programmable status display, and tri-mode 2.4GHz/Bluetooth/USB-C connection.',
    brand: 'Keyforge',
    category: 'Workspace & Ergonomics',
    price: 26499,
    originalPrice: 32999,
    discountPercentage: 20,
    rating: 4.9,
    reviewCount: 268,
    stock: 14,
    sku: 'ZS-WRK-077',
    isFeatured: true,
    tags: ['Keyboard', 'Mechanical', 'Workspace', 'Hot-swap'],
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Deep Sea Navy', hex: '#1E3A8A' },
      { name: 'Retro Industrial', hex: '#64748B' },
      { name: 'Pure Snow', hex: '#F1F5F9' }
    ],
    specs: {
      'Layout': '75% Compact Exploded (82 Keys + Rotary Dial)',
      'Switches': 'Gateron Oil King / Baby Kangaroo Pre-lubed',
      'Keycaps': 'Double-shot PBT Cherry Profile (1.5mm thickness)',
      'Battery': '4000mAh (up to 200 hours without RGB)',
      'Polling Rate': '1000Hz wired / 2.4GHz'
    },
    highlights: [
      'Multi-layer Poron and silicone acoustic sound dampeners',
      'Rotary media knob with haptic detent steps',
      'Custom web-based QMK/VIA key remap configurator'
    ],
    warranty: '2-Year Manufacturer Warranty',
    shippingDays: 2,
    reviews: []
  },
  {
    id: 'prod-9',
    title: 'Sartorial Merino Wool Knit Bomber Jacket',
    slug: 'sartorial-merino-wool-knit-bomber-jacket',
    description: 'Woven from extra-fine 19.5-micron Australian merino wool with a water-repellent biological nanotechnology finish. Features double-ended Swiss metal zippers, interior zip pockets, and rib-knit cuffs.',
    brand: 'Atelier Z',
    category: 'Modern Apparel & Wear',
    price: 18999,
    originalPrice: 24999,
    discountPercentage: 24,
    rating: 4.8,
    reviewCount: 63,
    stock: 28,
    sku: 'ZS-FSH-034',
    tags: ['Apparel', 'Merino Wool', 'Jacket', 'Sustainable'],
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Midnight Navy', hex: '#0F172A' },
      { name: 'Heather Charcoal', hex: '#475569' },
      { name: 'Warm Camel', hex: '#B45309' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specs: {
      'Material': '100% Traceable Extra-Fine Merino Wool',
      'Care': 'Machine wash cold on wool cycle / Flat dry',
      'Fit': 'Tailored modern fit (true to size)',
      'Origin': 'Ethically spun and constructed in Portugal'
    },
    highlights: [
      'Naturally thermo-regulating and odor-resistant',
      'Micro-fleece lined hand warmer pockets',
      'Hidden interior passport pocket with zipper'
    ],
    warranty: '1-Year Quality Guarantee',
    shippingDays: 2,
    reviews: []
  },
  {
    id: 'prod-10',
    title: 'ErgoForm Orthopedic Executive Mesh Task Chair',
    slug: 'ergoform-orthopedic-executive-mesh-chair',
    description: 'Engineered in collaboration with spine ergonomists. Features dynamic lumbar matrix support that shifts with your posture, 4D adjustable armrests, synchronized multi-position tilt lock, and breathable German elastomeric mesh.',
    brand: 'ErgoForm',
    category: 'Workspace & Ergonomics',
    price: 58999,
    originalPrice: 74999,
    discountPercentage: 21,
    rating: 4.9,
    reviewCount: 157,
    stock: 15,
    sku: 'ZS-WRK-091',
    isFeatured: true,
    tags: ['Chair', 'Ergonomic', 'Office', 'Workspace'],
    images: [
      'https://images.unsplash.com/photo-1580481077195-722f45ff916b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Graphite Black', hex: '#1E293B' },
      { name: 'Mineral Gray', hex: '#94A3B8' }
    ],
    specs: {
      'Weight Capacity': '350 lbs (158 kg)',
      'Height Range': 'Pneumatic 18" to 23" seat height',
      'Recline': '90 to 135 degrees with 4 lock positions',
      'Casters': '65mm Dual-wheel smooth glide PU casters'
    },
    highlights: [
      'Self-adjusting dynamic auto-counterbalance recline tension',
      'Padded waterfall seat front to relieve thigh pressure',
      'Class 4 heavy duty BIFMA certified gas cylinder'
    ],
    warranty: '10-Year Full Frame & Mechanism Warranty',
    shippingDays: 3,
    reviews: []
  },
  {
    id: 'prod-11',
    title: 'Polaris Ultra Titanium Smart Fitness Ring',
    slug: 'polaris-ultra-titanium-smart-fitness-ring',
    description: 'Track sleep staging, cardiovascular strain, blood oxygen saturation, and body temperature with medical-grade precision in an ultra-sleek, hypoallergenic titanium ring with 7-day battery life.',
    brand: 'Polaris Bio',
    category: 'Watches & Accessories',
    price: 32999,
    originalPrice: 39999,
    discountPercentage: 18,
    rating: 4.7,
    reviewCount: 110,
    stock: 30,
    sku: 'ZS-WTC-063',
    tags: ['Smart Ring', 'Fitness', 'Titanium', 'Wearable'],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Stealth Matte Black', hex: '#18181B' },
      { name: 'Polished Silver', hex: '#E2E8F0' },
      { name: 'Rose Gold', hex: '#FB7185' }
    ],
    sizes: ['Size 7', 'Size 8', 'Size 9', 'Size 10', 'Size 11', 'Size 12'],
    specs: {
      'Water Resistance': '100m (Swim, Dive, Shower safe)',
      'Battery Life': 'Up to 7 days on 45 min charge',
      'Sensors': 'Optical PPG, Skin Temp, 3D Accelerometer',
      'Weight': '3.2 grams'
    },
    highlights: [
      'No monthly subscription required — lifetime app access',
      'Automatic workout and resting heart rate monitoring',
      'Haptic circadian wake vibration option'
    ],
    warranty: '2-Year Hardware Warranty',
    shippingDays: 2,
    reviews: []
  },
  {
    id: 'prod-12',
    title: 'Terra Hydro Pure Thermal Ceramic Travel Tumbler 20oz',
    slug: 'terra-hydro-pure-thermal-ceramic-tumbler',
    description: 'Triple-wall vacuum insulation with a genuine ceramic interior lining that preserves coffee and tea notes without metallic aftertaste. Leak-proof 360-degree magnetic sip lid and cupholder-friendly tapered silhouette.',
    brand: 'Terra Living',
    category: 'Espresso & Kitchen',
    price: 4999,
    originalPrice: 6499,
    discountPercentage: 23,
    rating: 4.8,
    reviewCount: 312,
    stock: 45,
    sku: 'ZS-KTC-014',
    tags: ['Tumbler', 'Coffee', 'Kitchen', 'Eco-friendly'],
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Nordic Blue', hex: '#1D4ED8' },
      { name: 'Stone Chalk', hex: '#F8FAFC' },
      { name: 'Sage Leaf', hex: '#65A30D' }
    ],
    specs: {
      'Capacity': '20 oz (590 ml)',
      'Insulation': 'Keeps hot for 12h / cold for 24h',
      'Interior': 'Ceramic Shield Glaze (Zero metal taste)',
      'Dishwasher Safe': 'Yes (Top rack)'
    },
    highlights: [
      'Splash-proof slide lid with neodymium magnetic lock',
      'Durable powder-coat exterior will not sweat or chip',
      'Fits 99% of car and treadmill cup holders'
    ],
    warranty: 'Lifetime Thermal Guarantee',
    shippingDays: 2,
    reviews: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ZS-89420',
    userId: 'user-cust-1',
    customerName: 'Marcus Bennett',
    customerEmail: 'marcus.b@example.com',
    customerPhone: '+92 300 1234567',
    items: [
      {
        productId: 'prod-1',
        title: 'Z-Acoustics Studio Pro Wireless ANC Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        price: 34999,
        quantity: 1,
        selectedColor: 'Midnight Navy'
      },
      {
        productId: 'prod-5',
        title: 'Aura Minimalist Water-Resistant Tech Backpack 26L',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        price: 16499,
        quantity: 1,
        selectedColor: 'Matte Charcoal'
      }
    ],
    subtotal: 51498,
    discount: 5150,
    discountCode: 'ZSTORE10',
    shippingFee: 0,
    tax: 0,
    total: 46348,
    status: 'shipped',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    shippingAddress: {
      fullName: 'Marcus Bennett',
      street: 'House 42, Street 7, Sector F-8/2',
      apartment: 'Phase 2',
      city: 'Islamabad',
      state: 'Federal',
      postalCode: '44000',
      country: 'Pakistan'
    },
    trackingNumber: 'ZS-PK-99201482',
    courier: 'TCS Express Courier',
    estimatedDelivery: '2026-09-24',
    createdAt: '2026-09-18T14:22:00Z',
    timeline: [
      {
        status: 'pending',
        label: 'Order Verified',
        description: 'Cash on Delivery order confirmed by dispatch center.',
        timestamp: 'Sep 18, 2026 - 14:22',
        completed: true
      },
      {
        status: 'processing',
        label: 'Packed & Dispatched',
        description: 'Quality tested, packed in secure bubble-wrap at ZStore Central Hub.',
        timestamp: 'Sep 19, 2026 - 09:15',
        completed: true
      },
      {
        status: 'shipped',
        label: 'In Transit',
        description: 'Departed regional logistics sorting center; in transit to local hub.',
        timestamp: 'Sep 20, 2026 - 06:40',
        completed: true,
        current: true
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        description: 'Rider en route with parcel for cash collection.',
        completed: false
      },
      {
        status: 'delivered',
        label: 'Delivered',
        description: 'Package handed over and cash collected upon delivery.',
        completed: false
      }
    ]
  },
  {
    id: 'ZS-77192',
    userId: 'user-cust-1',
    customerName: 'Marcus Bennett',
    customerEmail: 'marcus.b@example.com',
    customerPhone: '+92 300 1234567',
    items: [
      {
        productId: 'prod-8',
        title: 'Keyforge Apex 75% Wireless Mechanical Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        price: 26499,
        quantity: 1,
        selectedColor: 'Deep Sea Navy'
      }
    ],
    subtotal: 26499,
    discount: 0,
    shippingFee: 0,
    tax: 0,
    total: 26499,
    status: 'delivered',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'paid',
    shippingAddress: {
      fullName: 'Marcus Bennett',
      street: 'House 42, Street 7, Sector F-8/2',
      apartment: 'Phase 2',
      city: 'Islamabad',
      state: 'Federal',
      postalCode: '44000',
      country: 'Pakistan'
    },
    trackingNumber: 'ZS-PK-88192004',
    courier: 'Leopards Courier COD',
    estimatedDelivery: '2026-09-12',
    createdAt: '2026-09-09T10:05:00Z',
    timeline: [
      {
        status: 'pending',
        label: 'Order Verified',
        description: 'COD order confirmed.',
        timestamp: 'Sep 09, 2026 - 10:05',
        completed: true
      },
      {
        status: 'processing',
        label: 'Packed & Dispatched',
        description: 'Item securely boxed and ready for pickup.',
        timestamp: 'Sep 09, 2026 - 16:30',
        completed: true
      },
      {
        status: 'shipped',
        label: 'In Transit',
        description: 'Package scanned at transportation sorting hub.',
        timestamp: 'Sep 10, 2026 - 08:20',
        completed: true
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        description: 'Courier en route for delivery.',
        timestamp: 'Sep 12, 2026 - 09:00',
        completed: true
      },
      {
        status: 'delivered',
        label: 'Delivered',
        description: 'Delivered to front door. Cash on Delivery collected.',
        timestamp: 'Sep 12, 2026 - 14:18',
        completed: true,
        current: true
      }
    ]
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-cust-1',
    name: 'Marcus Bennett',
    email: 'marcus.b@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phoneNumber: '+1 (555) 234-5678',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Marcus Bennett',
        street: '742 Evergreen Terrace',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        isDefault: true
      }
    ],
    totalOrders: 4,
    totalSpent: 1245.8,
    memberSince: 'March 2025'
  },
  {
    id: 'user-admin-1',
    name: 'ZStore Store Manager',
    email: 'admin@zstore.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phoneNumber: '+1 (800) 978-6731',
    totalOrders: 0,
    totalSpent: 0,
    memberSince: 'January 2025'
  }
];
