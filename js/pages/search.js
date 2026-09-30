/* TripEase Coastal — search results page */
(function () {
  'use strict';
  const TE = window.TE;
  const D = TE.DESTINATIONS;

  const state = {
    q: TE.param('q') || '',
    act: TE.param('act') ? [TE.param('act')] : [],
    regions: TE.param('region') ? [TE.param('region')] : [],
    maxPrice: 4000000,
    len: '',
    rate: 0,
    season: false,
    date: TE.param('date') || TE.isoDate(new Date(Date.now() + 14 * 86400000)),
    guests: parseInt(TE.param('guests') || '2', 10),
    sort: 'rec',
    view: 'list'
  };

  /* ---------- build filter controls ---------- */
  const count = (fn) => D.filter(fn).length;
  TE.$('#fActs').innerHTML = Object.keys(TE.ACTIVITIES).map((k) =>
    `<label class="check"><input type="checkbox" value="${k}" ${state.act.includes(k) ? 'checked' : ''}> ${TE.ACTIVITIES[k].label}<small>${count((d) => d.activities.includes(k))}</small></label>`).join('');
  TE.$('#fRegions').innerHTML = TE.REGIONS.map((r) =>
    `<label class="check"><input type="checkbox" value="${r}" ${state.regions.includes(r) ? 'checked' : ''}> ${r}<small>${count((d) => d.region === r)}</small></label>`).join('');
  const sAct = TE.$('#sAct');
  Object.keys(TE.ACTIVITIES).forEach((k) => sAct.insertAdjacentHTML('beforeend', `<option value="${k}">${TE.ACTIVITIES[k].label}</option>`));

  TE.$('#sQ').value = state.q;
  sAct.value = state.act[0] || '';
  TE.$('#sDate').min = TE.isoDate(new Date());
  TE.$('#sDate').value = state.date;
  TE.$('#sGuests').value = String(state.guests);
  if (!TE.$('#sGuests').value) TE.$('#sGuests').value = '2';

  const priceEl = TE.$('#fPrice');
  const showPrice = () => {
    TE.$('#fPriceMin').innerHTML = TE.price(500000);
    TE.$('#fPriceVal').innerHTML = TE.price(state.maxPrice) + (state.maxPrice >= 4000000 ? '+' : '');
  };

  /* ---------- filtering ---------- */
  const month = () => (state.date ? new Date(state.date + 'T00:00:00').getMonth() + 1 : null);

  function matches(d) {
    const q = state.q.trim().toLowerCase();
    if (q) {
      const hay = [d.name, d.area, d.province, d.region, d.title, d.tagline, ...d.activities.map((a) => TE.ACTIVITIES[a].label)].join(' ').toLowerCase();
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    if (state.act.length && !state.act.every((a) => d.activities.includes(a))) return false;
    if (state.regions.length && !state.regions.includes(d.region)) return false;
    if (d.price > state.maxPrice && state.maxPrice < 4000000) return false;
    if (state.len === 'short' && d.days > 3) return false;
    if (state.len === 'long' && d.days < 4) return false;
    if (d.rating < state.rate) return false;
    if (d.quota < state.guests) return false;
    if (state.season && month() && !d.bestMonths.includes(month())) return false;
    return true;
  }

  function sorted(list) {
    const m = month();
    const s = {
      rec: (a, b) => ((m && b.bestMonths.includes(m)) - (m && a.bestMonths.includes(m))) || b.rating - a.rating,
      price: (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      hidden: (a, b) => a.reviews - b.reviews
    }[state.sort];
    return list.slice().sort(s);
  }

  let mapCtl = null;

  function render() {
    const list = sorted(D.filter(matches));
    const qs = `&date=${state.date}&guests=${state.guests}`;
    TE.$('#resultTitle').textContent = state.q ? `Results for “${state.q}”` : state.act.length === 1 ? TE.ACTIVITIES[state.act[0]].label + ' trips' : 'Coastal trips';
    TE.$('#resultCount').textContent = `${list.length} of ${D.length} destinations · ${state.guests} guest${state.guests > 1 ? 's' : ''} · ${TE.niceDate(state.date)}`;
    TE.$('#resultList').innerHTML = list.length
      ? list.map((d) => TE.rcard(d, { month: month(), guests: state.guests, qs })).join('')
      : `<div class="empty"><strong>No trips match your filters</strong><p>Try removing a filter or choosing another date.</p><button type="button" class="btn btn--ghost" data-reset>Reset all filters</button></div>`;

    // active filter chips
    const chips = [];
    if (state.q) chips.push(['q', '', `“${state.q}”`]);
    state.act.forEach((a) => chips.push(['act', a, TE.ACTIVITIES[a].label]));
    state.regions.forEach((r) => chips.push(['region', r, r]));
    if (state.maxPrice < 4000000) chips.push(['price', '', 'Under ' + TE.money(state.maxPrice)]);
    if (state.len) chips.push(['len', '', state.len === 'short' ? '2–3 days' : '4–5 days']);
    if (state.rate) chips.push(['rate', '', state.rate + '+ rating']);
    if (state.season) chips.push(['season', '', 'In season']);
    TE.$('#activeChips').innerHTML = chips.map(([k, v, l]) => `<button type="button" data-chip="${k}" data-v="${v}">${TE.esc(l)} ${TE.icon('close', 12)}</button>`).join('');

    if (state.view === 'map') {
      const el = TE.$('#resultMap');
      if (mapCtl) { mapCtl.map.remove(); mapCtl = null; }
      el.innerHTML = '';
      mapCtl = TE.makeMap(el, list);
    }
    showPrice();
  }

  /* ---------- events ---------- */
  TE.$('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.q = TE.$('#sQ').value.trim();
    const a = sAct.value;
    state.act = a ? [a] : [];
    TE.$$('#fActs input').forEach((i) => { i.checked = state.act.includes(i.value); });
    state.date = TE.$('#sDate').value || state.date;
    state.guests = parseInt(TE.$('#sGuests').value, 10);
    history.replaceState(null, '', `search.html?q=${encodeURIComponent(state.q)}&act=${a}&date=${state.date}&guests=${state.guests}`);
    render();
  });

  TE.$('#filters').addEventListener('change', (e) => {
    const t = e.target;
    if (t.closest('#fActs')) state.act = TE.$$('#fActs input:checked').map((i) => i.value);
    if (t.closest('#fRegions')) state.regions = TE.$$('#fRegions input:checked').map((i) => i.value);
    if (t.name === 'fLen') state.len = t.value;
    if (t.name === 'fRate') state.rate = parseFloat(t.value);
    if (t.id === 'fSeason') state.season = t.checked;
    sAct.value = state.act.length === 1 ? state.act[0] : '';
    render();
  });
  priceEl.addEventListener('input', () => { state.maxPrice = parseInt(priceEl.value, 10); showPrice(); });
  priceEl.addEventListener('change', render);

  function reset() {
    Object.assign(state, { q: '', act: [], regions: [], maxPrice: 4000000, len: '', rate: 0, season: false });
    TE.$('#sQ').value = ''; sAct.value = ''; priceEl.value = 4000000;
    TE.$$('#filters input[type=checkbox]').forEach((i) => { i.checked = false; });
    TE.$$('#filters input[value=""], #filters input[value="0"]').forEach((i) => { i.checked = true; });
    render();
  }
  TE.$('#clearAll').addEventListener('click', reset);
  document.addEventListener('click', (e) => { if (e.target.closest('[data-reset]')) reset(); });

  TE.$('#activeChips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-chip]'); if (!b) return;
    const k = b.dataset.chip, v = b.dataset.v;
    if (k === 'q') { state.q = ''; TE.$('#sQ').value = ''; }
    if (k === 'act') { state.act = state.act.filter((x) => x !== v); TE.$(`#fActs input[value="${v}"]`).checked = false; sAct.value = ''; }
    if (k === 'region') { state.regions = state.regions.filter((x) => x !== v); TE.$(`#fRegions input[value="${v}"]`).checked = false; }
    if (k === 'price') { state.maxPrice = 4000000; priceEl.value = 4000000; }
    if (k === 'len') { state.len = ''; TE.$('input[name=fLen][value=""]').checked = true; }
    if (k === 'rate') { state.rate = 0; TE.$('input[name=fRate][value="0"]').checked = true; }
    if (k === 'season') { state.season = false; TE.$('#fSeason').checked = false; }
    render();
  });

  TE.$('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });

  TE.$$('[data-view]').forEach((b) => b.addEventListener('click', () => {
    state.view = b.dataset.view;
    TE.$$('[data-view]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    TE.$('#resultList').hidden = state.view !== 'list';
    TE.$('#resultMap').hidden = state.view !== 'map';
    render();
  }));

  const filters = TE.$('#filters');
  const openF = (open) => { filters.classList.toggle('is-open', open); document.body.style.overflow = open ? 'hidden' : ''; };
  TE.$('#openFilters').addEventListener('click', () => openF(true));
  TE.$('#closeFilters').addEventListener('click', () => openF(false));
  TE.$('#applyFilters').addEventListener('click', () => { openF(false); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  document.addEventListener('te:currency', render);
  render();
})();
