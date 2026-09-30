/* ==========================================================================
   TripEase Coastal — shared core
   Header, footer, currency, formatting, storage, toast, images, icons.
   Loaded on every page after js/data/destinations.js.
   ========================================================================== */

(function () {
  'use strict';
  const TE = (window.TE = window.TE || {});

  /* ---------- tiny helpers ---------- */
  TE.$ = (s, r) => (r || document).querySelector(s);
  TE.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  TE.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  TE.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  TE.param = (k) => new URLSearchParams(location.search).get(k);
  TE.isoDate = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  TE.niceDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  TE.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  TE.store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------- icons (inline SVG, stroke-based) ---------- */
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    pin: '<path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.6 3.5 2.6 3.5 6"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor" stroke="none"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.2-6"/>',
    boat: '<path d="M3 17l2 3h14l2-3H3z"/><path d="M12 3v11M12 4l6 8h-6"/>',
    mask: '<path d="M3 10c0-2 1.5-3 3-3h12c1.5 0 3 1 3 3v2c0 2-1.5 3-3 3h-3l-1.5-2h-3L9 15H6c-1.5 0-3-1-3-3z"/><path d="M21 9V5"/>',
    tank: '<rect x="8" y="6" width="8" height="15" rx="4"/><path d="M12 6V3M10 3h4"/>',
    wave: '<path d="M2 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M4 11c2-4 7-6 11-4-3 0-4 2-4 4"/>',
    turtle: '<ellipse cx="12" cy="13" rx="6" ry="4.5"/><circle cx="19.5" cy="12" r="1.8"/><path d="M8 17l-2 2M16 17l2 2M8 9l-2-2M16 9l1-2"/>',
    home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
    swap: '<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/>',
    food: '<path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18M17 3c-2 0-3 2.5-3 6s1 4 3 4v8"/>',
    bag: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
    qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M21 14v7h-4M17 21v-2"/>',
    bank: '<path d="M3 10l9-6 9 6M5 10v8M19 10v8M9.5 10v8M14.5 10v8M3 20h18"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3"/><rect x="7" y="14" width="10" height="7"/>'
  };
  TE.icon = (name, size) => `<svg class="ico" width="${size || 18}" height="${size || 18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

  /* ---------- images with fallbacks ---------- */
  // Tries assets/img/destinations/<id>.jpg first, then the Unsplash photo,
  // then leaves the ocean gradient placeholder visible.
  TE.imgFallback = function (img) {
    const next = img.dataset.fb;
    if (next) { img.dataset.fb = ''; img.src = next; return; }
    img.classList.add('is-missing');
  };
  TE.destImg = (d, cls) =>
    `<img class="${cls || ''}" src="assets/img/destinations/${d.id}.jpg" data-fb="${d.photo}" alt="${TE.esc(d.name)}, ${TE.esc(d.province)}" loading="lazy" onerror="TE.imgFallback(this)">`;

  /* ---------- currency ---------- */
  // Offline estimate (IDR per 1 unit) used only if both live sources fail.
  const OFFLINE_IDR_PER_UNIT = {
    USD: 16300, EUR: 18900, GBP: 21900, AUD: 10600, NZD: 9700, CAD: 11900, CHF: 20300,
    JPY: 110, CNY: 2270, HKD: 2090, TWD: 540, KRW: 11.8, SGD: 12700, MYR: 3850, THB: 500,
    PHP: 285, VND: 0.62, BND: 12700, KHR: 4.05, LAK: 0.75, MMK: 7.8, INR: 190, PKR: 58,
    BDT: 134, LKR: 54, NPR: 118, MVR: 1055, SAR: 4350, AED: 4440, QAR: 4480, KWD: 53300,
    OMR: 42300, BHD: 43300, TRY: 400, ILS: 4450, MOP: 2030, MNT: 4.6, KZT: 31
  };
  TE.ASIA = ['IDR', 'SGD', 'MYR', 'THB', 'PHP', 'VND', 'BND', 'KHR', 'LAK', 'MMK', 'JPY', 'KRW', 'CNY', 'HKD', 'TWD', 'MOP', 'MNT',
    'INR', 'PKR', 'BDT', 'LKR', 'NPR', 'MVR', 'SAR', 'AED', 'QAR', 'KWD', 'OMR', 'BHD', 'ILS', 'TRY', 'KZT'];
  TE.POPULAR = ['IDR', 'USD', 'SGD', 'MYR', 'AUD', 'EUR', 'JPY', 'CNY', 'KRW', 'GBP'];

  const cur = (TE.currency = {
    code: TE.store.get('te_currency', 'IDR'),
    rates: null,          // units of foreign currency per 1 IDR
    source: 'loading',    // 'live' | 'offline'
    updated: null,
    names: (() => { try { return new Intl.DisplayNames(['en'], { type: 'currency' }); } catch (e) { return null; } })()
  });

  cur.name = (code) => (cur.names ? cur.names.of(code) : code) || code;

  function offlineRates() {
    const r = { IDR: 1 };
    Object.keys(OFFLINE_IDR_PER_UNIT).forEach((k) => { r[k] = 1 / OFFLINE_IDR_PER_UNIT[k]; });
    return r;
  }

  cur.load = async function () {
    const cached = TE.store.get('te_rates', null);
    if (cached && Date.now() - cached.fetchedAt < 6 * 3600 * 1000) {
      Object.assign(cur, { rates: cached.rates, source: 'live', updated: cached.updated });
      return;
    }
    const sources = [
      async () => {
        const r = await fetch('https://open.er-api.com/v6/latest/IDR');
        const j = await r.json();
        if (j.result !== 'success') throw new Error('er-api');
        return { rates: j.rates, updated: j.time_last_update_utc };
      },
      async () => {
        const r = await fetch('https://api.frankfurter.app/latest?from=IDR');
        const j = await r.json();
        return { rates: Object.assign({ IDR: 1 }, j.rates), updated: j.date };
      }
    ];
    for (const src of sources) {
      try {
        const res = await Promise.race([src(), TE.sleep(6000).then(() => { throw new Error('timeout'); })]);
        Object.assign(cur, { rates: res.rates, source: 'live', updated: res.updated });
        TE.store.set('te_rates', { rates: res.rates, updated: res.updated, fetchedAt: Date.now() });
        return;
      } catch (e) { /* try the next source */ }
    }
    Object.assign(cur, { rates: offlineRates(), source: 'offline', updated: 'offline estimate' });
  };

  cur.codes = function () {
    const all = Object.keys(cur.rates || offlineRates());
    const asia = TE.ASIA.filter((c) => all.includes(c));
    const rest = all.filter((c) => !asia.includes(c)).sort();
    return { asia, rest, all };
  };

  cur.convert = (amount, from, to) => {
    const r = cur.rates || offlineRates();
    if (!r[from] || !r[to]) return NaN;
    return (amount / r[from]) * r[to];
  };

  cur.fmt = function (value, code) {
    code = code || 'IDR';
    if (code === 'IDR') return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
    const big = Math.abs(value) >= 1000;
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: code, maximumFractionDigits: big ? 0 : 2 }).format(value);
    } catch (e) { return code + ' ' + value.toFixed(2); }
  };

  // Format an IDR amount in the visitor's chosen currency.
  TE.money = (idr) => {
    if (cur.code === 'IDR' || !cur.rates || !cur.rates[cur.code]) return cur.fmt(idr, 'IDR');
    return cur.fmt(idr * cur.rates[cur.code], cur.code);
  };
  // Markup that re-renders automatically when the currency changes.
  TE.price = (idr) => `<span data-idr="${idr}">${TE.money(idr)}</span>`;

  cur.refreshPrices = function () {
    TE.$$('[data-idr]').forEach((el) => { el.textContent = TE.money(parseFloat(el.dataset.idr)); });
    TE.$$('[data-cur-code]').forEach((el) => { el.textContent = cur.code; });
  };

  cur.set = function (code) {
    cur.code = code;
    TE.store.set('te_currency', code);
    cur.refreshPrices();
    document.dispatchEvent(new CustomEvent('te:currency', { detail: code }));
  };

  /* ---------- toast ---------- */
  TE.toast = function (title, msg) {
    let t = TE.$('#te-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'te-toast'; t.className = 'toast'; t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.innerHTML = `<span class="toast__icon">${TE.icon('check', 14)}</span><div><p class="toast__title">${TE.esc(title)}</p>${msg ? `<p class="toast__msg">${TE.esc(msg)}</p>` : ''}</div>`;
    t.classList.add('is-visible');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('is-visible'), 4500);
  };

  /* ---------- bookings (saved in this browser) ---------- */
  TE.bookings = {
    all: () => TE.store.get('te_bookings', []),
    add(b) { const list = TE.bookings.all(); list.unshift(b); TE.store.set('te_bookings', list); TE.updateBookingBadge(); },
    update(id, patch) { const list = TE.bookings.all().map((b) => (b.id === id ? Object.assign(b, patch) : b)); TE.store.set('te_bookings', list); TE.updateBookingBadge(); }
  };
  TE.updateBookingBadge = () => {
    const n = TE.bookings.all().filter((b) => b.status === 'confirmed').length;
    TE.$$('[data-booking-count]').forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  };

  /* ---------- header & footer ---------- */
  const page = document.body.dataset.page || '';
  const navItem = (href, label, key) => `<a href="${href}" class="${page === key ? 'is-active' : ''}">${label}</a>`;

  function renderHeader() {
    const el = TE.$('#site-header');
    if (!el) return;
    el.className = 'site-header' + (document.body.classList.contains('has-hero') ? ' site-header--overlay' : '');
    el.innerHTML = `
      <div class="container site-header__inner">
        <a href="index.html" class="brand" aria-label="TripEase Coastal home">
          <img src="assets/img/logo-horizontal.png" alt="TripEase Coastal" class="brand__logo brand__logo--dark" width="167" height="60">
          <img src="assets/img/logo-horizontal-light.png" alt="" class="brand__logo brand__logo--light" width="167" height="60" aria-hidden="true">
        </a>
        <nav class="main-nav" aria-label="Main">
          ${navItem('search.html', 'Explore trips', 'search')}
          ${navItem('index.html#map', 'Destination map', 'map')}
          ${navItem('index.html#currency', 'Currency', 'currency')}
          ${navItem('partner.html', 'For local partners', 'partner')}
        </nav>
        <div class="site-header__actions">
          <button type="button" class="pill-btn" id="currencyBtn" aria-haspopup="dialog">${TE.icon('globe', 16)}<span data-cur-code>${cur.code}</span></button>
          <a href="bookings.html" class="pill-btn pill-btn--solid ${page === 'bookings' ? 'is-active' : ''}">${TE.icon('ticket', 16)}<span class="hide-sm">My bookings</span><b class="badge-count" data-booking-count hidden>0</b></a>
          <button type="button" class="icon-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">${TE.icon('menu', 22)}</button>
        </div>
      </div>
      <nav class="mobile-drawer" id="mobileDrawer" aria-label="Mobile">
        <a href="search.html">${TE.icon('search')} Explore trips</a>
        <a href="index.html#map">${TE.icon('map')} Destination map</a>
        <a href="index.html#currency">${TE.icon('swap')} Currency converter</a>
        <a href="bookings.html">${TE.icon('ticket')} My bookings</a>
        <a href="partner.html">${TE.icon('home')} For local partners</a>
      </nav>`;

    const toggle = TE.$('#navToggle');
    toggle.addEventListener('click', () => {
      const open = !el.classList.contains('is-open');
      el.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = TE.icon(open ? 'close' : 'menu', 22);
    });
    TE.$('#currencyBtn').addEventListener('click', openCurrencyPicker);

    if (el.classList.contains('site-header--overlay')) {
      const onScroll = () => el.classList.toggle('is-scrolled', window.scrollY > 40);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  function renderFooter() {
    const el = TE.$('#site-footer');
    if (!el) return;
    el.className = 'site-footer';
    el.innerHTML = `
      <div class="container site-footer__grid">
        <div class="site-footer__brand">
          <img src="assets/img/logo-horizontal-light.png" alt="TripEase Coastal" width="167" height="60">
          <p>Community-based coastal marine tourism for Indonesia's hidden coastal destinations, under the Agromaritime 5.0 framework.</p>
          <div class="pay-logos" aria-label="Payment methods">
            <span>VISA</span><span>Mastercard</span><span>QRIS</span><span>BCA</span><span>Mandiri</span><span>PayPal</span>
          </div>
        </div>
        <div>
          <h4>Travel</h4>
          <ul>
            <li><a href="search.html">All trips</a></li>
            <li><a href="index.html#map">Destination map</a></li>
            <li><a href="index.html#currency">Currency converter</a></li>
            <li><a href="bookings.html">My bookings</a></li>
          </ul>
        </div>
        <div>
          <h4>Destinations</h4>
          <ul>${TE.DESTINATIONS.slice(0, 5).map((d) => `<li><a href="trip.html?id=${d.id}">${d.name}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h4>Communities</h4>
          <ul>
            <li><a href="partner.html">Become a partner</a></li>
            <li><a href="index.html#impact">Impact tracker</a></li>
            <li><a href="index.html#how">How it works</a></li>
          </ul>
        </div>
      </div>
      <div class="container site-footer__bottom">
        <p>© ${new Date().getFullYear()} TripEase Coastal</p>
        <p>Prototype for the 9th IPB Business Festival 2026. No real bookings or payments are processed.</p>
      </div>`;
  }

  /* ---------- currency picker dialog ---------- */
  function openCurrencyPicker() {
    let dlg = TE.$('#currencyDialog');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.id = 'currencyDialog';
      dlg.className = 'modal modal--sm';
      dlg.innerHTML = `
        <div class="modal__head"><h2 class="modal__title">Choose currency</h2>
          <button type="button" class="icon-btn" data-close aria-label="Close">${TE.icon('close', 16)}</button></div>
        <div class="modal__body">
          <input type="search" class="input" id="curSearch" placeholder="Search currency or country code" autocomplete="off">
          <p class="muted small" id="curSource"></p>
          <div class="cur-list" id="curList"></div>
        </div>`;
      document.body.appendChild(dlg);
      dlg.addEventListener('click', (e) => {
        if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
        const b = e.target.closest('[data-code]');
        if (b) { cur.set(b.dataset.code); dlg.close(); TE.toast('Prices now shown in ' + b.dataset.code, cur.name(b.dataset.code)); }
      });
      TE.$('#curSearch', dlg).addEventListener('input', (e) => fill(e.target.value));
    }
    function fill(q) {
      q = (q || '').trim().toLowerCase();
      const { asia, rest } = cur.codes();
      const match = (c) => !q || c.toLowerCase().includes(q) || cur.name(c).toLowerCase().includes(q);
      const btn = (c) => `<button type="button" data-code="${c}" class="${c === cur.code ? 'is-active' : ''}"><b>${c}</b><span>${TE.esc(cur.name(c))}</span></button>`;
      const pop = TE.POPULAR.filter(match);
      const a = asia.filter((c) => match(c) && !TE.POPULAR.includes(c));
      const r = rest.filter((c) => match(c) && !TE.POPULAR.includes(c));
      TE.$('#curList', dlg).innerHTML =
        (pop.length ? `<p class="cur-group">Popular</p><div class="cur-grid">${pop.map(btn).join('')}</div>` : '') +
        (a.length ? `<p class="cur-group">Asia</p><div class="cur-grid">${a.map(btn).join('')}</div>` : '') +
        (r.length ? `<p class="cur-group">Rest of the world</p><div class="cur-grid">${r.map(btn).join('')}</div>` : '') ||
        '<p class="muted">No currency found.</p>';
    }
    TE.$('#curSource', dlg).textContent = cur.source === 'live'
      ? `Live exchange rates · updated ${String(cur.updated).replace(' +0000', '')}`
      : 'Offline estimate rates (no internet connection)';
    TE.$('#curSearch', dlg).value = '';
    fill('');
    dlg.showModal();
  }
  TE.openCurrencyPicker = openCurrencyPicker;

  /* ---------- in-page smooth scroll with header offset ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(url.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    TE.$('#site-header') && TE.$('#site-header').classList.remove('is-open');
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', url.hash);
  });

  /* ---------- counters & bars when scrolled into view ---------- */
  TE.observeCounters = function (root) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const n = en.target;
        obs.unobserve(n);
        if (n.hasAttribute('data-bar')) { n.style.width = n.dataset.width + '%'; return; }
        const target = parseFloat(n.dataset.target), pre = n.dataset.prefix || '', suf = n.dataset.suffix || '';
        const out = (v) => pre + Math.round(v).toLocaleString('en-US') + suf;
        if (reduce) { n.textContent = out(target); return; }
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / 1600, 1);
          n.textContent = out(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    TE.$$('[data-counter],[data-bar]', root).forEach((n) => io.observe(n));
  };

  /* ---------- reveal on scroll ---------- */
  TE.observeReveal = function () {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    TE.$$('.reveal').forEach((n) => io.observe(n));
  };

  /* ---------- declarative icons: <span data-icon="leaf"> ---------- */
  TE.hydrateIcons = (root) => TE.$$('[data-icon]', root).forEach((el) => {
    if (el.dataset.iconDone) return;
    el.dataset.iconDone = '1';
    el.insertAdjacentHTML('afterbegin', TE.icon(el.dataset.icon, parseInt(el.dataset.iconSize || '18', 10)));
  });

  /* ---------- boot ---------- */
  TE.hydrateIcons();
  renderHeader();
  renderFooter();
  TE.updateBookingBadge();
  TE.ready = cur.load().then(() => {
    if (!cur.rates[cur.code]) cur.code = 'IDR';
    cur.refreshPrices();
    document.dispatchEvent(new CustomEvent('te:rates'));
  });
})();
