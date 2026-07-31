// =====================================================================
// LUMÉRA — Shared main script (header, menu, scroll reveal, search)
// =====================================================================

(function () {
  // ============== HEADER SCROLL ==============
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============== SCROLL REVEAL ==============
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => io.observe(el));
  }
  window.initRevealAnimations = initRevealAnimations;
  document.addEventListener('DOMContentLoaded', initRevealAnimations);

  // ============== MOBILE MENU TOGGLE ==============
  const toggle = document.getElementById('menuToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      // Simple alert-style nav for demo (full drawer would go here)
      const links = Array.from(document.querySelectorAll('.nav-desktop a'))
        .map(a => a.textContent.trim()).join('\n');
      alert('LUMÉRA Menu:\n\n' + links);
    });
  }

  // ============== SEARCH OVERLAY (basic) ==============
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = prompt('Search LUMÉRA:');
      if (q && q.trim()) {
        window.location.href = 'shop.html?search=' + encodeURIComponent(q.trim());
      }
    });
  }

  // ============== UPDATE CART BADGE ==============
  document.addEventListener('DOMContentLoaded', () => {
    if (window.Cart) window.Cart.updateBadge();
  });
})();
