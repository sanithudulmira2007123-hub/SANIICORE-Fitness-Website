/* ============================================================
   SaniCore Fitness Center — main.js  (Complete v3)
   All interactive features for all 7 pages
   ============================================================ */
(function () {
  'use strict';

  /* ════════════════════════════════════════════════
     1. NAVBAR — scroll shadow + mobile hamburger
  ════════════════════════════════════════════════ */
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobNav    = document.querySelector('.mob-nav');
  const bttBtn    = document.querySelector('.btt');

  window.addEventListener('scroll', () => {
    if (navbar)  navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (bttBtn)  bttBtn.classList.toggle('visible',  window.scrollY > 400);
  }, { passive: true });

  if (hamburger && mobNav) {
    hamburger.addEventListener('click', () => {
      const open = mobNav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobNav.contains(e.target)) {
        mobNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ════════════════════════════════════════════════
     2. BACK TO TOP
  ════════════════════════════════════════════════ */
  if (bttBtn) {
    bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ════════════════════════════════════════════════
     3. SCROLL REVEAL (Intersection Observer)
  ════════════════════════════════════════════════ */
  const revEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revEls.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revEls.forEach(el => ro.observe(el));
  }

  /* ════════════════════════════════════════════════
     4. ANIMATED COUNTERS (hero stats)
  ════════════════════════════════════════════════ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1800, step = 16;
        const steps = dur / step;
        let cur = 0;
        const timer = setInterval(() => {
          cur += target / steps;
          if (cur >= target) { cur = target; clearInterval(timer); }
          el.textContent = Math.floor(cur) + suffix;
        }, step);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  }

  /* ════════════════════════════════════════════════
     5. GALLERY LIGHTBOX
  ════════════════════════════════════════════════ */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg     = lightbox.querySelector('.lb-img');
    const lbCaption = lightbox.querySelector('.lb-caption');
    const lbClose   = lightbox.querySelector('.lb-close');
    const lbPrev    = lightbox.querySelector('.lb-prev');
    const lbNext    = lightbox.querySelector('.lb-next');
    const items     = Array.from(document.querySelectorAll('.gal-item'));
    let current     = 0;

    function open(idx) {
      const item = items[idx];
      const img  = item.querySelector('img');
      const cap  = item.querySelector('.gal-overlay span');
      lbImg.src  = img.src.replace(/w=\d+/, 'w=1400');
      lbCaption.textContent = cap ? cap.textContent : '';
      current = idx;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { lbImg.src = ''; }, 300);
    }
    function nav(dir) { current = (current + dir + items.length) % items.length; open(current); }

    items.forEach((item, i) => item.addEventListener('click', () => open(i)));
    if (lbClose) lbClose.addEventListener('click', close);
    if (lbPrev)  lbPrev.addEventListener('click', () => nav(-1));
    if (lbNext)  lbNext.addEventListener('click', () => nav(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   nav(-1);
      if (e.key === 'ArrowRight')  nav(1);
    });
  }

  /* ════════════════════════════════════════════════
     6. SHOP — Category filter + Cart
  ════════════════════════════════════════════════ */
  const shopTabs = document.querySelectorAll('.shop-tab');
  const shopCats = document.querySelectorAll('.shop-cat');

  if (shopTabs.length && shopCats.length) {
    shopTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        shopTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.cat;
        shopCats.forEach(cat => {
          cat.style.display = (target === 'all' || cat.id === target) ? 'block' : 'none';
        });
      });
    });
  }

  /* Cart */
  let cartCount = 0;
  const cartToast   = document.querySelector('.cart-toast');
  const cartCountEl = document.querySelector('.cart-count');

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.product-card');
      const name = card ? card.querySelector('h4').textContent : 'Item';
      cartCount++;
      if (cartCountEl) cartCountEl.textContent = cartCount;
      showToast(`"${name}" added to cart! 🛒`);
      // Animate button
      const orig = this.textContent;
      this.textContent = '✓ Added!';
      this.disabled = true;
      setTimeout(() => { this.textContent = orig; this.disabled = false; }, 1800);
    });
  });

  function showToast(msg) {
    if (!cartToast) return;
    cartToast.textContent = msg;
    cartToast.classList.add('show');
    clearTimeout(cartToast._t);
    cartToast._t = setTimeout(() => cartToast.classList.remove('show'), 3000);
  }

  /* ════════════════════════════════════════════════
     7. CONTACT FORM — validation + submit
  ════════════════════════════════════════════════ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formMsg   = contactForm.querySelector('.form-msg');
    const submitBtn = contactForm.querySelector('.form-submit .btn');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      // Clear errors
      contactForm.querySelectorAll('.fg input, .fg textarea, .fg select')
        .forEach(f => f.classList.remove('err'));

      // Required fields
      contactForm.querySelectorAll('[required]').forEach(f => {
        if (!f.value.trim()) { f.classList.add('err'); valid = false; }
      });

      // Email format
      const emailF = contactForm.querySelector('#email');
      if (emailF && emailF.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailF.value.trim())) {
        emailF.classList.add('err'); valid = false;
      }

      // Phone format
      const phoneF = contactForm.querySelector('#phone');
      if (phoneF && phoneF.value && !/^[\d\s\+\-\(\)]{7,18}$/.test(phoneF.value.trim())) {
        phoneF.classList.add('err'); valid = false;
      }

      if (!valid) {
        showMsg('error', '⚠ Please fill in all required fields correctly.');
        return;
      }

      // Send simulation
      const origTxt = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '.7';

      setTimeout(() => {
        submitBtn.textContent = '✓ Sent!';
        submitBtn.style.opacity = '1';
        showMsg('success', '✅ Message received! We\'ll get back to you within 24 hours.');
        contactForm.reset();
        setTimeout(() => {
          submitBtn.textContent = origTxt;
          submitBtn.disabled = false;
          if (formMsg) formMsg.classList.remove('show');
        }, 7000);
      }, 1800);
    });

    // Live validation clear
    contactForm.querySelectorAll('.fg input, .fg textarea, .fg select').forEach(f => {
      f.addEventListener('input', () => f.classList.remove('err'));
    });

    function showMsg(type, text) {
      if (!formMsg) return;
      formMsg.className = 'form-msg show ' + type;
      formMsg.textContent = text;
    }
  }

  /* ════════════════════════════════════════════════
     8. MEMBERSHIP — plan buttons → contact page
         + billing toggle (monthly / annual)
  ════════════════════════════════════════════════ */
  document.querySelectorAll('.plan-join-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const plan = this.dataset.plan || 'Standard';
      sessionStorage.setItem('selectedPlan', plan);
      window.location.href = 'contact.html?plan=' + encodeURIComponent(plan);
    });
  });

  // Auto-fill plan on contact page from URL or sessionStorage
  const urlParams  = new URLSearchParams(window.location.search);
  const planParam  = urlParams.get('plan') || sessionStorage.getItem('selectedPlan');
  if (planParam) {
    const goalField = document.getElementById('goal');
    if (goalField) {
      const opt = Array.from(goalField.options)
        .find(o => o.value.toLowerCase().includes(planParam.toLowerCase()));
      if (opt) goalField.value = opt.value;
      sessionStorage.removeItem('selectedPlan');
    }
  }

  // Billing toggle
  const billingToggle = document.getElementById('billingToggle');
  if (billingToggle) {
    const labels = document.querySelectorAll('.billing-label');
    billingToggle.addEventListener('change', function () {
      const annual = this.checked;
      document.querySelectorAll('.plan-price-val').forEach(el => {
        const m = parseFloat(el.dataset.monthly);
        const a = parseFloat(el.dataset.annual);
        el.textContent = annual ? a : m;
      });
      document.querySelectorAll('.plan-period-text').forEach(el => {
        el.textContent = annual ? 'Billed annually · Save 20%' : 'Billed monthly · No contract';
      });
      labels.forEach((lbl, i) => {
        lbl.classList.toggle('active-label', annual ? i === 1 : i === 0);
      });
    });
  }

  /* ════════════════════════════════════════════════
     9. FAQ ACCORDION
  ════════════════════════════════════════════════ */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', function () {
      const item   = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ════════════════════════════════════════════════
     10. OPENING HOURS — highlight today's row
  ════════════════════════════════════════════════ */
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayName = dayNames[new Date().getDay()];
  document.querySelectorAll('.hours-tbl tr').forEach(row => {
    const cell = row.querySelector('td');
    if (cell && cell.textContent.trim() === todayName) row.classList.add('today');
  });

  /* ════════════════════════════════════════════════
     11. SMOOTH ANCHOR SCROLLING
  ════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id     = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 12, behavior: 'smooth' });
    });
  });

  /* ════════════════════════════════════════════════
     12. HERO SCROLL indicator → next section
  ════════════════════════════════════════════════ */
  const scrollHint = document.querySelector('.hero-scroll');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const next = document.querySelector('.hero + section, .hero ~ section');
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    scrollHint.style.cursor = 'pointer';
  }

  /* ════════════════════════════════════════════════
     13. SERVICES — class schedule day filter
  ════════════════════════════════════════════════ */
  const dayBtns = document.querySelectorAll('.day-filter-btn');
  if (dayBtns.length) {
    dayBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        dayBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.day;
        document.querySelectorAll('.schedule-table tbody tr').forEach(row => {
          row.style.display = (filter === 'all' || row.dataset.day === filter || row.dataset.day === 'all') ? '' : 'none';
        });
      });
    });
  }

  /* ════════════════════════════════════════════════
     14. ACTIVE NAV LINK detection
  ════════════════════════════════════════════════ */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ════════════════════════════════════════════════
     15. GALLERY FILTER TABS (if present)
  ════════════════════════════════════════════════ */
  const galTabs = document.querySelectorAll('.gal-filter-btn');
  if (galTabs.length) {
    galTabs.forEach(btn => {
      btn.addEventListener('click', function () {
        galTabs.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        document.querySelectorAll('.gal-item').forEach(item => {
          const match = filter === 'all' || item.dataset.cat === filter;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }

})();
