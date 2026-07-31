// =====================================================================
// LUMÉRA — Supabase Client Wrapper
// Loads supabase-js from CDN, exposes a singleton `sb` and helpers.
// =====================================================================

(function () {
  // Config from window.__SUPABASE__ (set inline in HTML before this script)
  const cfg = window.__SUPABASE__ || {};
  const url = cfg.url;
  const key = cfg.anonKey;

  if (!url || !key) {
    console.warn('[supabase] No config found. Set window.__SUPABASE__ before loading this script.');
    window.sb = null;
    return;
  }

  // Lazy load supabase-js from CDN (only when needed)
  let client = null;

  async function getClient() {
    if (client) return client;
    if (!window.supabase) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    client = window.supabase.createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, storage: window.localStorage }
    });
    return client;
  }

  // Expose helpers
  window.sb = {
    raw: getClient,
    client: () => client,

    // ============== PUBLIC HELPERS ==============
    async getProducts(filters = {}) {
      const c = await getClient();
      let q = c.from('products').select('*').eq('is_active', true);
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'new') q = q.eq('is_new', true);
        else if (filters.category === 'bestsellers') q = q.eq('is_bestseller', true);
        else if (filters.category === 'sale') q = q.not('sale_price', 'is', null);
        else q = q.eq('category', filters.category);
      }
      if (filters.featured) q = q.eq('is_featured', true);
      if (filters.search) q = q.ilike('name', `%${filters.search}%`);
      q = q.order('created_at', { ascending: false });
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async getProductBySlug(slug) {
      const c = await getClient();
      const { data, error } = await c.from('products').select('*').eq('slug', slug).single();
      if (error) throw error;
      return data;
    },

    async getSettings() {
      const c = await getClient();
      const { data, error } = await c.from('settings').select('*');
      if (error) throw error;
      const out = {};
      (data || []).forEach((row) => { out[row.key] = row.value; });
      return out;
    },

    async createOrder(order, items) {
      const c = await getClient();
      const { data: orderRow, error: orderErr } = await c
        .from('orders')
        .insert([order])
        .select()
        .single();
      if (orderErr) throw orderErr;

      const itemsWithOrder = items.map((it) => ({ ...it, order_id: orderRow.id }));
      const { error: itemsErr } = await c.from('order_items').insert(itemsWithOrder);
      if (itemsErr) throw itemsErr;

      return orderRow;
    },

    // ============== ADMIN HELPERS (auth required) ==============
    async signIn(email, password) {
      const c = await getClient();
      const { data, error } = await c.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },

    async signOut() {
      const c = await getClient();
      return c.auth.signOut();
    },

    async getSession() {
      const c = await getClient();
      const { data } = await c.auth.getSession();
      return data.session;
    },

    async adminListProducts() {
      const c = await getClient();
      const { data, error } = await c.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async adminCreateProduct(product) {
      const c = await getClient();
      const { data, error } = await c.from('products').insert([product]).select().single();
      if (error) throw error;
      return data;
    },

    async adminUpdateProduct(id, patch) {
      const c = await getClient();
      const { data, error } = await c.from('products').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },

    async adminDeleteProduct(id) {
      const c = await getClient();
      const { error } = await c.from('products').delete().eq('id', id);
      if (error) throw error;
    },

    async adminListOrders() {
      const c = await getClient();
      const { data, error } = await c
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async adminUpdateOrderStatus(id, status) {
      const c = await getClient();
      const { data, error } = await c.from('orders').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },

    async adminUpdateSetting(key, value) {
      const c = await getClient();
      const { data, error } = await c
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async adminUploadImage(file) {
      const c = await getClient();
      const ext = file.name.split('.').pop();
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `products/${name}`;
      const { error: upErr } = await c.storage.from('products').upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data } = c.storage.from('products').getPublicUrl(path);
      return data.publicUrl;
    },

    async adminDeleteImage(url) {
      const c = await getClient();
      const path = url.split('/storage/v1/object/public/products/')[1];
      if (!path) return;
      await c.storage.from('products').remove([path]);
    }
  };
})();
