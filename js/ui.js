/* ==========================================================================
   TripEase Coastal — shared UI components
   Destination cards, result cards, carousels, map, wishlist, QR codes.
   ========================================================================== */

(function () {
  'use strict';
  const TE = window.TE;

  /* ---------- wishlist (saved in this browser) ---------- */
  TE.wish = {
    all: () => TE.store.get('te_wish', []),
    has: (id) => TE.wish.all().includes(id),
    toggle(id) {
      const w = TE.wish.all();
      const i = w.indexOf(id);
      if (i >= 0) w.splice(i, 1); else w.push(id);
      TE.store.set('te_wish', w);
      return i < 0;
    }
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-save]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const saved = TE.wish.toggle(b.dataset.save);
    TE.$$(`[data-save="${b.dataset.save}"]`).forEach((x) => x.classList.toggle('is-saved', saved));
    const d = TE.getDestination(b.dataset.save);
    TE.toast(saved ? 'Saved to your wishlist' : 'Removed from wishlist', d ? d.name : '');
  });

  const saveBtn = (d) => `<button type="button" class="dcard__save ${TE.wish.has(d.id) ? 'is-saved' : ''}" data-save="${d.id}" aria-label="Save ${TE.esc(d.name)}">${TE.icon('heart', 16)}</button>`;

  /* ---------- destination card (carousels) ---------- */
  TE.card = (d) => `
    <a class="dcard" href="trip.html?id=${d.id}">
      <div class="dcard__media media">
        ${TE.destImg(d)}
        <span class="dcard__tag">${TE.icon('shield', 12)} ${d.partner} verified</span>
        ${saveBtn(d)}
      </div>
      <div class="dcard__body">
        <span class="dcard__loc">${TE.icon('pin', 13)} ${TE.esc(d.area)}, ${TE.esc(d.province)}</span>
        <span class="dcard__title">${TE.esc(d.name)}</span>
        <span class="rating">${TE.icon('star', 13)} ${d.rating.toFixed(1)} <small>(${d.reviews} reviews)</small></span>
        <span class="dcard__eco">${TE.icon('leaf', 13)} Funds ${TE.esc(d.conservationUse)}</span>
        <div class="dcard__price"><small>${d.duration} · from</small><strong>${TE.price(d.price)}</strong></div>
      </div>
    </a>`;

  /* ---------- result card (search page) ---------- */
  const scoreWord = (r) => (r >= 4.85 ? 'Exceptional' : r >= 4.7 ? 'Excellent' : 'Very good');
  TE.scoreWord = scoreWord;
  TE.rcard = (d, opts) => {
    opts = opts || {};
    const acts = d.activities.slice(0, 3).map((a) => `<span class="tag">${TE.ACTIVITIES[a].label}</span>`).join('');
    const inSeason = opts.month && d.bestMonths.includes(opts.month);
    const offSeason = opts.month && !inSeason;
    const low = d.quota <= 8;
    return `
      <article class="rcard">
        <a class="rcard__media media" href="trip.html?id=${d.id}" aria-label="${TE.esc(d.name)}">
          ${TE.destImg(d)}
          <span class="dcard__tag">${TE.icon('shield', 12)} ${d.partner} verified</span>
          ${saveBtn(d)}
        </a>
        <div class="rcard__body">
          <h3><a href="trip.html?id=${d.id}">${TE.esc(d.title)}</a></h3>
          <div class="rcard__meta">
            <span>${TE.icon('pin', 14)} ${TE.esc(d.area)}, ${TE.esc(d.province)}</span>
            <span>${TE.icon('clock', 14)} ${d.duration}</span>
          </div>
          <p class="rcard__desc">${TE.esc(d.tagline)}</p>
          <div class="tags">${acts}
            ${inSeason ? `<span class="tag tag--eco">Best season in ${TE.MONTHS[opts.month - 1]}</span>` : ''}
            ${offSeason ? `<span class="tag tag--warn">Off-season in ${TE.MONTHS[opts.month - 1]}</span>` : ''}
          </div>
          <span class="dcard__eco">${TE.icon('leaf', 13)} 20% of your booking funds ${TE.esc(d.conservationUse)}</span>
        </div>
        <div class="rcard__side">
          <div class="rcard__score">
            <div><b>${scoreWord(d.rating)}</b><small>${d.reviews} reviews</small></div>
            <span class="score">${d.rating.toFixed(1)}</span>
          </div>
          <div class="rcard__price">
            ${low ? `<small style="color:var(--danger);font-weight:700">Only ${d.quota} spots per day</small>` : ''}
            <small>per person, from</small>
            <strong>${TE.price(d.price)}</strong>
            ${opts.guests > 1 ? `<small>${TE.price(d.price * opts.guests)} for ${opts.guests} guests</small>` : ''}
          </div>
          <a class="btn btn--primary btn--sm" href="trip.html?id=${d.id}${opts.qs || ''}">See details</a>
        </div>
      </article>`;
  };

  /* ---------- carousel arrows ---------- */
  TE.rail = (root) => {
    const track = TE.$('.rail__track', root);
    const prev = TE.$('.rail__btn--prev', root);
    const next = TE.$('.rail__btn--next', root);
    const update = () => {
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    };
    const step = () => track.clientWidth * 0.8;
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  };

  /* ---------- map (Leaflet, bundled in vendor/leaflet) ---------- */
  TE.makeMap = (el, dests, opts) => {
    opts = opts || {};
    if (!window.L) {
      el.innerHTML = '<div class="map-fallback">The map needs an internet connection to load.</div>';
      return null;
    }
    const map = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18, subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
    const icon = (active) => L.divIcon({ className: '', html: `<div class="map-pin ${active ? 'map-pin--active' : ''}"></div>`, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });
    const markers = {};
    dests.forEach((d) => {
      const m = L.marker(d.coords, { icon: icon(false), title: d.name }).addTo(map);
      m.bindPopup(`<div class="map-pop"><b>${TE.esc(d.name)}</b><span>${TE.esc(d.province)} · from ${TE.money(d.price)}</span><a href="trip.html?id=${d.id}">View trip →</a></div>`);
      m.on('click', () => opts.onSelect && opts.onSelect(d.id));
      markers[d.id] = m;
    });
    if (dests.length === 1) map.setView(dests[0].coords, opts.zoom || 7);
    else if (dests.length) map.fitBounds(L.latLngBounds(dests.map((d) => d.coords)), { padding: [30, 30] });
    else map.setView([-2.5, 118], 4);
    map.on('focus', () => map.scrollWheelZoom.enable());
    map.on('blur', () => map.scrollWheelZoom.disable());
    return {
      map, markers,
      focus(id) {
        Object.keys(markers).forEach((k) => markers[k].setIcon(icon(k === id)));
        const m = markers[id];
        if (m) { map.flyTo(m.getLatLng(), Math.max(map.getZoom(), 6), { duration: .8 }); m.openPopup(); }
      }
    };
  };

  /* ---------- decorative QR-style code (prototype only) ---------- */
  TE.qrSvg = (text) => {
    const n = 25; let h = 2166136261;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#0a2a5c"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#0a2a5c"/>`;
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    let cells = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inFinder(x, y) && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="Booking code"><rect width="${n}" height="${n}" fill="#fff"/><g fill="#0a2a5c">${cells}</g>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
  };

  /* ---------- e-ticket ---------- */
  TE.ticketHTML = (b, withHead) => {
    const d = TE.getDestination(b.destId);
    const eco = b.total * TE.REVENUE_SPLIT.conservation;
    return `
      ${withHead ? `<div class="success-head"><div class="success-icon">${TE.icon('check', 28)}</div><h3>Booking confirmed!</h3>
        <p class="muted">Terima kasih, ${TE.esc(b.name.split(' ')[0])}. Your e-ticket has been sent to <b>${TE.esc(b.email)}</b>.</p></div>` : ''}
      <div class="ticket">
        <div class="ticket__top"><img src="assets/img/logo-horizontal-light.png" alt="TripEase Coastal"><div style="text-align:right"><small>Booking code</small><b>${b.id}</b></div></div>
        <div class="ticket__body">
          <dl>
            <div><dt>Trip</dt><dd>${TE.esc(d ? d.name : b.destId)}</dd></div>
            <div><dt>Type</dt><dd>${b.type === 'open' ? 'Open trip' : 'Private trip'}</dd></div>
            <div><dt>Date</dt><dd>${TE.niceDate(b.date)}</dd></div>
            <div><dt>Duration</dt><dd>${d ? d.duration : ''}</dd></div>
            <div><dt>Lead guest</dt><dd>${TE.esc(b.name)}</dd></div>
            <div><dt>Guests</dt><dd>${b.guests}</dd></div>
            <div><dt>Paid with</dt><dd>${TE.esc(b.pay)}</dd></div>
            <div><dt>Total paid</dt><dd>${TE.money(b.total)}</dd></div>
            <div><dt>Meeting point</dt><dd>${d ? TE.esc(d.gettingThere[d.gettingThere.length - 1]) : ''}</dd></div>
            <div><dt>Host</dt><dd>Local ${d ? d.partner : ''} guide</dd></div>
          </dl>
          <div class="ticket__qr">${TE.qrSvg(b.id)}</div>
        </div>
        <div class="ticket__foot">${TE.icon('leaf', 16)} ${TE.money(eco)} of your booking goes to ${d ? TE.esc(d.conservationUse) : 'conservation'}.</div>
      </div>
      ${withHead ? `<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn--ghost btn--sm" data-print>${TE.icon('print', 16)} Print / save as PDF</button>
        <a class="btn btn--ghost btn--sm" href="https://wa.me/?text=${encodeURIComponent('My TripEase Coastal booking ' + b.id + ' to ' + (d ? d.name : ''))}" target="_blank" rel="noopener">${TE.icon('send', 16)} Share via WhatsApp</a></div>
        <p class="note">Prototype: no real payment was made and no email is sent. Your booking is saved in this browser under “My bookings”.</p>` : ''}`;
  };

  /* ---------- sample reviews (clearly labelled as prototype content) ---------- */
  const REVIEWERS = [['Emma', 'Netherlands'], ['Kenji', 'Japan'], ['Sofia', 'Spain'], ['Liam', 'Australia'], ['Mei Ling', 'Singapore'], ['Jonas', 'Germany'], ['Aisha', 'Malaysia'], ['Daniel', 'United Kingdom']];
  TE.sampleReviews = (d) => {
    const t = [
      `The guide from the local ${d.partner} made the whole trip. We felt like guests of the village, not tourists.`,
      `${d.highlights[0]} was the highlight for us. Quiet, clean and beautifully looked after.`,
      `Getting to ${d.name} takes time, but that is exactly why it is still so unspoilt. Homestay food was fantastic.`,
      `Loved knowing part of the price goes to ${d.conservationUse}. Very transparent and well organised.`
    ];
    const start = d.id.length % REVIEWERS.length;
    return t.map((text, i) => {
      const [name, country] = REVIEWERS[(start + i) % REVIEWERS.length];
      return { name, country, text, score: (i === 2 ? d.rating - 0.3 : d.rating).toFixed(1), month: TE.MONTHS[(d.bestMonths[i % d.bestMonths.length] - 1)] + ' 2026' };
    });
  };
})();
