
(function () {
  'use strict';
  const TE = window.TE;
  const D = TE.DESTINATIONS;

  const dest = TE.$('#hsDest');
  TE.REGIONS.forEach((r) => {
    const list = D.filter((d) => d.region === r);
    if (!list.length) return;
    dest.insertAdjacentHTML('beforeend', `<optgroup label="${r}">${list.map((d) => `<option value="${d.id}">${d.name}, ${d.province}</option>`).join('')}</optgroup>`);
  });
  const act = TE.$('#hsAct');
  Object.keys(TE.ACTIVITIES).forEach((k) => act.insertAdjacentHTML('beforeend', `<option value="${k}">${TE.ACTIVITIES[k].label}</option>`));
  const date = TE.$('#hsDate');
  const today = new Date();
  date.min = TE.isoDate(today);
  date.value = TE.isoDate(new Date(today.getTime() + 14 * 86400000));

  TE.$('#heroSearch').addEventListener('submit', (e) => {
    e.preventDefault();
    if (dest.value) { location.href = `trip.html?id=${dest.value}&date=${date.value}&guests=${TE.$('#hsGuests').value}`; return; }
    const p = new URLSearchParams({ act: act.value, date: date.value, guests: TE.$('#hsGuests').value });
    location.href = 'search.html?' + p.toString();
  });


  const tabs = TE.$$('.searchbox__tab[role="tab"]');
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => { x.setAttribute('aria-selected', String(x === t)); TE.$('#' + x.getAttribute('aria-controls')).hidden = x !== t; });
  }));
  TE.$('#tab-ai').addEventListener('click', () => TE.assistant.open());


  TE.converter(TE.$('#heroConverter'), { amount: 1000000, from: 'IDR', to: 'USD', quick: false });
  const main = TE.converter(TE.$('#mainConverter'), { amount: 2500000, from: 'IDR', to: 'SGD' });
  TE.$('#showPricesIn').addEventListener('click', TE.openCurrencyPicker);
  document.addEventListener('te:currency', (e) => { if (e.detail !== 'IDR') main.setTo(e.detail); });

  const gems = D.slice().sort((a, b) => a.reviews - b.reviews);
  TE.$('#gemTrack').innerHTML = gems.map(TE.card).join('');
  TE.rail(TE.$('#gemRail'));


  TE.$('#acts').innerHTML = Object.keys(TE.ACTIVITIES).map((k) => {
    const n = D.filter((d) => d.activities.includes(k)).length;
    return `<a class="act" href="search.html?act=${k}"><span class="act__icon">${TE.icon(TE.ACTIVITIES[k].icon, 22)}</span><span>${TE.ACTIVITIES[k].label}<small>${n} destination${n === 1 ? '' : 's'}</small></span></a>`;
  }).join('');

  const list = TE.$('#mapList');
  list.innerHTML = D.map((d) => `
    <button type="button" class="map-item" data-id="${d.id}">
      <span class="map-item__img media">${TE.destImg(d)}</span>
      <span><b>${TE.esc(d.name)}</b><span>${TE.esc(d.province)} · from ${TE.price(d.price)}</span></span>
    </button>`).join('');
  const select = (id) => TE.$$('.map-item', list).forEach((b) => b.classList.toggle('is-active', b.dataset.id === id));
  const m = TE.makeMap(TE.$('#homeMap'), D, { onSelect: select });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.map-item'); if (!b) return;
    select(b.dataset.id);
    if (m) m.focus(b.dataset.id); else location.href = 'trip.html?id=' + b.dataset.id;
  });


  document.addEventListener('click', (e) => {
    const q = e.target.closest('[data-ai-q]');
    if (q) TE.assistant.open(q.dataset.aiQ);
    if (e.target.closest('[data-ai-open]')) TE.assistant.open();
  });

  TE.observeCounters();
  TE.observeReveal();
})();
