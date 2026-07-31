// =====================================================================
// LUMÉRA — Product Data (Demo Fallback)
// Used when Supabase is NOT configured. In production, products come
// from the database via the admin panel.
// =====================================================================

window.LUMERA_PRODUCTS = [
  {
    id: '1',
    name: 'Cashmere Wrap Coat',
    slug: 'cashmere-wrap-coat',
    description: 'A timeless silhouette in pure cashmere. Hand-finished with horn buttons and a tailored waist.',
    price: 8900,
    salePrice: 7500,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#C8A96A' },
      { name: 'Black', hex: '#111111' },
      { name: 'Ivory', hex: '#F5F0E8' }
    ],
    stock: 12,
    rating: 4.9,
    reviews: 47,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    specs: {
      material: '100% Cashmere',
      origin: 'Italy',
      care: 'Dry clean only',
      fit: 'Tailored'
    }
  },
  {
    id: '2',
    name: 'Silk Midi Dress',
    slug: 'silk-midi-dress',
    description: 'Fluid silk dress with subtle sheen. A modern essential cut on the bias for an effortless drape.',
    price: 5400,
    salePrice: null,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Burgundy', hex: '#6B1F2C' },
      { name: 'Champagne', hex: '#E8D5B7' }
    ],
    stock: 8,
    rating: 4.8,
    reviews: 31,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    specs: {
      material: '100% Mulberry Silk',
      origin: 'France',
      care: 'Hand wash cold',
      fit: 'Bias cut'
    }
  },
  {
    id: '3',
    name: 'Leather Tote — Mini',
    slug: 'leather-tote-mini',
    description: 'Compact yet considered. Vegetable-tanned Italian leather with hand-stitched detailing.',
    price: 4200,
    salePrice: null,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Cognac', hex: '#8B5A2B' },
      { name: 'Black', hex: '#111111' },
      { name: 'Bone', hex: '#E8DCC4' }
    ],
    stock: 15,
    rating: 4.9,
    reviews: 62,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    specs: {
      material: 'Italian Veg-Tan Leather',
      origin: 'Italy',
      dimensions: '28 × 22 × 12 cm'
    }
  },
  {
    id: '4',
    name: 'Wool Overcoat — Slim',
    slug: 'wool-overcoat-slim',
    description: 'Single-breasted overcoat in a refined Italian wool blend. Clean lines, modern proportions.',
    price: 7800,
    salePrice: 6500,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal', hex: '#3A3A3A' },
      { name: 'Camel', hex: '#C8A96A' },
      { name: 'Navy', hex: '#1B2845' }
    ],
    stock: 10,
    rating: 4.8,
    reviews: 28,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    specs: {
      material: '80% Wool, 20% Cashmere',
      origin: 'Italy',
      care: 'Dry clean only',
      fit: 'Slim'
    }
  },
  {
    id: '5',
    name: 'Cotton Oxford Shirt',
    slug: 'cotton-oxford-shirt',
    description: 'The essential oxford, perfected. Long-staple Egyptian cotton with a soft hand and clean drape.',
    price: 1800,
    salePrice: null,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Sky', hex: '#B8D4E3' },
      { name: 'Pink', hex: '#F4C2C2' }
    ],
    stock: 25,
    rating: 4.7,
    reviews: 89,
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    specs: {
      material: '100% Egyptian Cotton',
      origin: 'Portugal',
      fit: 'Regular'
    }
  },
  {
    id: '6',
    name: 'Leather Derby Shoes',
    slug: 'leather-derby-shoes',
    description: 'Goodyear-welted derbies in supple calfskin. Built to be resoled and worn for decades.',
    price: 6200,
    salePrice: null,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80',
      'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=800&q=80'
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Brown', hex: '#5C3A21' }
    ],
    stock: 7,
    rating: 4.9,
    reviews: 34,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    specs: {
      material: 'Calfskin Leather',
      construction: 'Goodyear Welted',
      origin: 'England'
    }
  },
  {
    id: '7',
    name: 'Silk Scarf — Atelier',
    slug: 'silk-scarf-atelier',
    description: 'Hand-rolled edges, archive-inspired print. A 90cm square of pure mulberry silk.',
    price: 1900,
    salePrice: 1500,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
      'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Gold', hex: '#C8A96A' },
      { name: 'Black', hex: '#111111' },
      { name: 'Ivory', hex: '#F5F0E8' }
    ],
    stock: 20,
    rating: 4.8,
    reviews: 52,
    isNew: false,
    isBestseller: false,
    isFeatured: true,
    specs: {
      material: '100% Silk Twill',
      dimensions: '90 × 90 cm',
      origin: 'France'
    }
  },
  {
    id: '8',
    name: 'Minimalist Watch — 36mm',
    slug: 'minimalist-watch-36mm',
    description: 'Swiss quartz movement, sapphire crystal, Italian leather strap. Quietly precise.',
    price: 4800,
    salePrice: null,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Silver/Black', hex: '#1A1A1A' },
      { name: 'Gold/Brown', hex: '#8B5A2B' }
    ],
    stock: 14,
    rating: 4.9,
    reviews: 41,
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    specs: {
      movement: 'Swiss Quartz',
      case: '36mm Stainless',
      crystal: 'Sapphire',
      strap: 'Italian Leather'
    }
  },
  {
    id: '9',
    name: 'Aviator Sunglasses',
    slug: 'aviator-sunglasses',
    description: 'Hand-polished titanium frame with Carl Zeiss lenses. Lightweight, considered, enduring.',
    price: 2900,
    salePrice: null,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Gold/Green', hex: '#C8A96A' },
      { name: 'Silver/Gray', hex: '#888888' }
    ],
    stock: 18,
    rating: 4.7,
    reviews: 56,
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    specs: {
      frame: 'Titanium',
      lens: 'Carl Zeiss',
      origin: 'Japan'
    }
  },
  {
    id: '10',
    name: 'Knit Cashmere Sweater',
    slug: 'knit-cashmere-sweater',
    description: 'A clean, modern sweater in 12-gauge Mongolian cashmere. Soft, warm, and refined.',
    price: 3900,
    salePrice: null,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Cream', hex: '#F5F0E8' },
      { name: 'Black', hex: '#111111' },
      { name: 'Camel', hex: '#C8A96A' }
    ],
    stock: 9,
    rating: 4.8,
    reviews: 38,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    specs: {
      material: '100% Mongolian Cashmere',
      gauge: '12gg',
      origin: 'Scotland'
    }
  },
  {
    id: '11',
    name: 'Linen Suit — Two Piece',
    slug: 'linen-suit-two-piece',
    description: 'Lightweight Italian linen tailored to a relaxed silhouette. The warm-weather uniform.',
    price: 9200,
    salePrice: 7900,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sand', hex: '#D4B896' },
      { name: 'Stone', hex: '#A89F8A' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    stock: 6,
    rating: 4.9,
    reviews: 22,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    specs: {
      material: '100% Italian Linen',
      origin: 'Italy',
      fit: 'Relaxed Tailored'
    }
  },
  {
    id: '12',
    name: 'Leather Card Holder',
    slug: 'leather-card-holder',
    description: 'Slim profile, full-grain leather, six card slots. Patinas beautifully with use.',
    price: 1200,
    salePrice: null,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Cognac', hex: '#8B5A2B' }
    ],
    stock: 30,
    rating: 4.8,
    reviews: 73,
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    specs: {
      material: 'Full-Grain Calfskin',
      origin: 'Italy',
      slots: '6'
    }
  }
];
