// =====================================================================
// LUMÉRA — Unified Data Layer
// Loads from Supabase if configured, falls back to local data.js
// This lets the frontend work in TWO modes:
//   1. Demo mode (no Supabase) — uses local data.js (current setup)
//   2. Live mode (Supabase configured) — uses real database
// =====================================================================

(function () {
  const cfg = window.__SUPABASE__ || {};
  const hasSupabase = !!(cfg.url && cfg.anonKey && !cfg.url.includes('YOUR_'));

  // ============== CACHE ==============
  const cache = {
    products: null,
    productsByCategory: {},
    productBySlug: {},
    settings: null,
    expires: 5 * 60 * 1000 // 5 min cache
  };

  function isFresh(timestamp) {
    return timestamp && (Date.now() - timestamp) < cache.expires;
  }

  // ============== MAPPER (Supabase row → frontend shape) ==============
  function mapProduct(p) {
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      salePrice: p.sale_price ? Number(p.sale_price) : null,
      category: p.category,
      images: p.images || [],
      sizes: p.sizes || [],
      colors: p.colors || [],
      stock: p.stock || 0,
      rating: Number(p.rating) || 0,
      reviews: p.reviews_count || 0,
      isNew: !!p.is_new,
      isBestseller: !!p.is_bestseller,
      isFeatured: !!p.is_featured,
      specs: p.specs || {},
      createdAt: p.created_at
    };
  }

  // ============== PUBLIC API ==============
  const Data = {
    isLive: hasSupabase,

    // ----- Products -----
    async getAll(filters = {}) {
      if (!hasSupabase) {
        // Demo mode: use local data
        return this._getLocalAll(filters);
      }

      try {
        const products = await sb.getProducts(filters);
        return products.map(mapProduct);
      } catch (err) {
        console.warn('[data] Supabase failed, falling back to local:', err.message);
        return this._getLocalAll(filters);
      }
    },

    async getFeatured() {
      return this.getAll({ featured: true });
    },

    async getNew() {
      return this.getAll({ category: 'new' });
    },

    async getBestsellers() {
      return this.getAll({ category: 'bestsellers' });
    },

    async getByCategory(cat) {
      return this.getAll({ category: cat });
    },

    async getBySlug(slug) {
      if (!hasSupabase) {
        return this._getLocalBySlug(slug);
      }
      try {
        const p = await sb.getProductBySlug(slug);
        return mapProduct(p);
      } catch (err) {
        return this._getLocalBySlug(slug);
      }
    },

    async getRelated(productId, category) {
      const all = await this.getByCategory(category);
      return all.filter(p => p.id !== productId).slice(0, 4);
    },

    // ----- Settings (brand info) -----
    async getSettings() {
      if (!hasSupabase) {
        return this._getLocalSettings();
      }
      try {
        return await sb.getSettings();
      } catch (err) {
        return this._getLocalSettings();
      }
    },

    // ----- Local fallbacks -----
    _getLocalAll(filters = {}) {
      if (typeof window.LUMERA_PRODUCTS === 'undefined') {
        console.error('[data] window.LUMERA_PRODUCTS not found. Include data.js first.');
        return [];
      }
      let list = [...window.LUMERA_PRODUCTS];
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'new') list = list.filter(p => p.isNew);
        else if (filters.category === 'bestsellers') list = list.filter(p => p.isBestseller);
        else if (filters.category === 'sale') list = list.filter(p => p.salePrice);
        else list = list.filter(p => p.category === filters.category);
      }
      if (filters.featured) list = list.filter(p => p.isFeatured);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q));
      }
      return list;
    },

    _getLocalBySlug(slug) {
      if (typeof window.LUMERA_PRODUCTS === 'undefined') return null;
      return window.LUMERA_PRODUCTS.find(p => p.slug === slug) || null;
    },

    _getLocalSettings() {
      return {
        brand_name: 'LUMÉRA',
        brand_phone: '+20 100 000 0000',
        brand_email: 'care@lumera.com',
        brand_address: 'Cairo, Egypt',
        shipping_fee: 60,
        free_shipping_threshold: 3000,
        payment_methods: [
          { id: 'cod', label: 'Cash on Delivery', enabled: true, instructions: 'Pay when you receive your order.' },
          { id: 'vodafone_cash', label: 'Vodafone Cash', enabled: true, instructions: 'Send to 01000000000.' },
          { id: 'instapay', label: 'InstaPay', enabled: true, instructions: 'Send to care@lumera' }
        ]
      };
    },

    // ----- Reviews (mock for demo) -----
    getReviews(productId) {
      return [
        { author: 'Sarah M.', rating: 5, text: 'Exceptional quality, exactly as described. The fit is perfect and the fabric feels luxurious.', date: '2026-01-15' },
        { author: 'James K.', rating: 5, text: 'This has become a wardrobe staple. Worth every penny.', date: '2026-02-03' },
        { author: 'Layla A.', rating: 4, text: 'Beautiful piece. Runs slightly small — consider sizing up.', date: '2026-02-20' }
      ];
    }
  };

  window.Data = Data;
})();
