// =====================================================================
// LUMÉRA Admin — shared logic
// =====================================================================

const Admin = {
  // ============== AUTH GUARD ==============
  async requireAuth() {
    const session = await sb.getSession();
    if (!session) {
      window.location.href = 'index.html';
      return null;
    }
    return session;
  },

  async logout() {
    await sb.signOut();
    window.location.href = 'index.html';
  },

  // ============== TOAST ==============
  toast(msg, type = '') {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  },

  // ============== SIDEBAR ==============
  renderSidebar(activeKey) {
    const items = [
      { section: 'Overview' },
      { key: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: iconHome() },
      { section: 'Manage' },
      { key: 'products', label: 'Products', href: 'products.html', icon: iconBox() },
      { key: 'orders', label: 'Orders', href: 'orders.html', icon: iconCart() },
      { key: 'settings', label: 'Settings', href: 'settings.html', icon: iconCog() }
    ];
    const html = `
      <div class="logo"><a href="dashboard.html">LUMÉRA</a></div>
      ${items.map((it) => {
        if (it.section) return `<div class="nav-section"><div class="nav-label">${it.section}</div></div>`;
        return `<a class="nav-item ${it.key === activeKey ? 'active' : ''}" href="${it.href}">
          ${it.icon}<span>${it.label}</span>
        </a>`;
      }).join('')}
      <div class="sidebar-footer">
        <a href="../index.html" target="_blank">↗ View Store</a>
        <button onclick="Admin.logout()">Sign Out</button>
      </div>`;
    return html;
  },

  initShell(activeKey) {
    const sb = document.getElementById('sidebar');
    if (sb) sb.innerHTML = this.renderSidebar(activeKey);
    const toggle = document.getElementById('menuToggle');
    if (toggle) toggle.addEventListener('click', () => sb.classList.toggle('open'));
  },

  // ============== HELPERS ==============
  fmtDate(d) {
    return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },
  fmtMoney(n) { return Number(n || 0).toFixed(2) + ' EGP'; },
  escape(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
};

// ============== ICONS ==============
function iconHome() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2h-4a1 1 0 01-1-1v-6h-4v6a1 1 0 01-1 1H5a2 2 0 01-2-2V9z"/></svg>'; }
function iconBox() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>'; }
function iconCart() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>'; }
function iconCog() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'; }
