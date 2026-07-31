// =====================================================================
// LUMÉRA — Cart & Wishlist (localStorage-based)
// Exposes window.Cart and window.Wishlist with a small API.
// If your existing cart.js has these methods, no need to replace it.
// =====================================================================

(function () {
  const KEY_CART = 'lumera_cart';
  const KEY_WISH = 'lumera_wishlist';

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
  }
  function write(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  }

  // ============== CART ==============
  window.Cart = {
    get() { return read(KEY_CART); },
    add(item) {
      const cart = read(KEY_CART);
      const existing = cart.find(c => c.id === item.id && c.size === item.size && c.color === item.color);
      if (existing) existing.quantity += item.quantity || 1;
      else cart.push({ ...item, quantity: item.quantity || 1 });
      write(KEY_CART, cart);
      this.updateBadge();
    },
    remove(id, size, color) {
      const cart = read(KEY_CART).filter(c => !(c.id === id && c.size === size && c.color === color));
      write(KEY_CART, cart);
      this.updateBadge();
    },
    updateQty(id, size, color, qty) {
      const cart = read(KEY_CART);
      const item = cart.find(c => c.id === id && c.size === size && c.color === color);
      if (item) item.quantity = Math.max(1, qty);
      write(KEY_CART, cart);
      this.updateBadge();
    },
    clear() { write(KEY_CART, []); this.updateBadge(); },
    count() { return read(KEY_CART).reduce((s, c) => s + c.quantity, 0); },
    total() { return read(KEY_CART).reduce((s, c) => s + c.price * c.quantity, 0); },
    updateBadge() {
      const el = document.getElementById('cartCount');
      if (el) el.textContent = this.count();
    }
  };

  // ============== WISHLIST ==============
  window.Wishlist = {
    get() { return read(KEY_WISH); },
    has(id) { return read(KEY_WISH).some(w => w.id === id); },
    toggle(item) {
      let wish = read(KEY_WISH);
      const i = wish.findIndex(w => w.id === item.id);
      if (i >= 0) wish.splice(i, 1);
      else wish.push(item);
      write(KEY_WISH, wish);
    },
    clear() { write(KEY_WISH, []); }
  };

  // Init badge on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.Cart.updateBadge());
  } else {
    window.Cart.updateBadge();
  }
})();

// ============== GLOBAL Admin HELPERS (used by checkout + admin pages) ==============
window.Admin = window.Admin || {
  escape(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },
  toast(msg, type = '') {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      wrap.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:200;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(wrap);
    }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    t.style.cssText = 'background:#111;color:#fff;padding:12px 20px;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.2);font-size:13px;min-width:240px;animation:slideIn .3s;';
    if (type === 'success') t.style.background = '#2c9b7a';
    if (type === 'error') t.style.background = '#d14343';
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
};
