/* TripEase Coastal — trip detail page + checkout */
(function () {
  'use strict';
  const TE = window.TE;
  const d = TE.getDestination(TE.param('id')) || TE.DESTINATIONS[0];
  const main = TE.$('#trip');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  document.title = `${d.name}, ${d.province} · TripEase Coastal`;
  TE.assistant.setContext(d.id);

  const today = new Date();
  const minDate = TE.isoDate(new Date(today.getTime() + 2 * 86400000));
  const state = {
    type: 'open',
    guests: Math.min(parseInt(TE.param('guests') || '2', 10) || 2, d.quota),
    date: TE.param('date') && TE.param('date') >= minDate ? TE.param('date') : TE.isoDate(new Date(today.getTime() + 14 * 86400000))
  };

  // Deterministic "spots left" per date so it feels live but stays consistent.
  const spotsLeft = (iso) => {
    let h = 0; for (const c of iso + d.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return Math.max(2, d.quota - (h % Math.ceil(d.quota * 0.7)));
  };
  const total = () => d.price * state.guests + (state.type === 'private' ? d.privateSurcharge : 0);
  const reviews = TE.sampleReviews(d);

  /* ------------------------------------------------------------------ */
  main.innerHTML = `
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span><a href="search.html?region=${encodeURIComponent(d.region)}">${d.region}</a></span><span>${TE.esc(d.name)}</span>
    </nav>

    <div class="gallery">
      <div class="gallery__main media">${TE.destImg(d)}<span class="gallery__label">${TE.icon('pin', 12)} ${TE.esc(d.area)}, ${TE.esc(d.province)}</span></div>
      <div class="gallery__side media">${TE.destImg(d)}</div>
      <div class="gallery__side gallery__side--b media">${TE.destImg(d)}<span class="gallery__label">Photo gallery</span></div>
    </div>

    <div class="trip-head">
      <div>
        <span class="tag">${TE.icon('shield', 12)} Verified by local ${d.partner}</span>
        <h1 style="margin-top:8px">${TE.esc(d.title)}</h1>
        <div class="trip-head__meta">
          <span class="rating">${TE.icon('star', 14)} ${d.rating.toFixed(1)} <small>${TE.scoreWord(d.rating)} · ${d.reviews} reviews</small></span>
          <span>${TE.icon('clock', 15)} ${d.duration}</span>
          <span>${TE.icon('users', 15)} Max ${d.quota} guests per day</span>
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <button type="button" class="btn btn--ghost btn--sm ${TE.wish.has(d.id) ? 'is-saved' : ''}" data-save="${d.id}">${TE.icon('heart', 16)} Save</button>
        <button type="button" class="btn btn--ghost btn--sm" id="shareBtn">${TE.icon('send', 16)} Share</button>
      </div>
    </div>

    <div class="trip-layout">
      <div>
        <nav class="tabs" id="tabs" aria-label="Sections">
          <a href="#overview" class="is-active">Overview</a><a href="#itinerary">Itinerary</a><a href="#food">Food &amp; shopping</a>
          <a href="#getting">Getting there</a><a href="#impact">Conservation</a><a href="#reviews">Reviews</a>
        </nav>

        <section class="panel" id="overview">
          <h2>${TE.icon('info')} Why it's a hidden gem</h2>
          <p>${TE.esc(d.why)}</p>
          <ul class="hl">${d.highlights.map((h) => `<li>${TE.icon('check', 16)}<span>${TE.esc(h)}</span></li>`).join('')}</ul>
          <div class="tags" style="margin-top:14px">${d.activities.map((a) => `<a class="tag" href="search.html?act=${a}">${TE.ACTIVITIES[a].label}</a>`).join('')}</div>
        </section>

        <section class="panel" id="itinerary">
          <h2>${TE.icon('calendar')} Itinerary</h2>
          <ol class="itin">${d.itinerary.map((s, i) => `<li data-day="D${i + 1}"><b>Day ${i + 1}</b>${TE.esc(s)}</li>`).join('')}</ol>
          <p class="small muted">Included: homestay, meals, local boat transfers, English-speaking guide, conservation contribution. Not included: flights to the region.</p>
        </section>

        <section class="panel" id="food">
          <h2>${TE.icon('food')} Local food &amp; shopping</h2>
          <div class="fs-grid">
            <div><h3>${TE.icon('food')} Must-try food</h3>${d.food.map((f) => `<div class="fs-item"><b>${TE.esc(f.name)}</b><span>${TE.esc(f.desc)}</span></div>`).join('')}</div>
            <div><h3>${TE.icon('bag')} Where to shop</h3>${d.shopping.map((f) => `<div class="fs-item"><b>${TE.esc(f.name)}</b><span>${TE.esc(f.desc)}</span></div>`).join('')}</div>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" style="margin-top:8px" data-ai-q="What else should I eat in ${TE.esc(d.name)}?">${TE.icon('chat', 16)} Ask Coastal AI about food here</button>
        </section>

        <section class="panel" id="getting">
          <h2>${TE.icon('map')} Getting there &amp; best season</h2>
          <ol class="route">${d.gettingThere.map((s, i) => `<li><b>${i + 1}</b><span>${TE.esc(s)}</span></li>`).join('')}</ol>
          <p style="margin-top:14px"><strong>Best time:</strong> ${TE.esc(d.bestTime)}</p>
          <div class="months">${TE.MONTHS.map((m, i) => `<span class="${d.bestMonths.includes(i + 1) ? 'on' : ''}">${m}</span>`).join('')}</div>
          <div class="trip-map" id="tripMap"></div>
          <p class="small muted" style="margin-top:12px"><strong>Local etiquette:</strong> ${TE.esc(d.etiquette)}</p>
        </section>

        <section class="panel" id="impact">
          <h2>${TE.icon('leaf')} Where your money goes</h2>
          <div class="eco-box">${TE.icon('leaf', 22)}<div><strong>20% of this trip funds ${TE.esc(d.conservationUse)}</strong><p style="color:inherit;font-size:14px">The fund is managed together with the village ${d.partner} and reported back to you after the trip.</p></div></div>
          <div class="sumline" style="margin-top:14px"><span>Local homestays, boats, cooks &amp; guides (70%)</span><b>${TE.price(d.price * 0.7)}</b></div>
          <div class="sumline"><span>Conservation fund (20%)</span><b>${TE.price(d.price * 0.2)}</b></div>
          <div class="sumline"><span>Platform (10%)</span><b>${TE.price(d.price * 0.1)}</b></div>
          <p class="small muted">Per person, open trip.</p>
        </section>

        <section class="panel" id="reviews">
          <h2>${TE.icon('star')} Guest reviews</h2>
          <div class="reviews-sum"><span class="score">${d.rating.toFixed(1)}</span><div><strong>${TE.scoreWord(d.rating)}</strong><p class="small muted">${d.reviews} reviews · sample reviews shown for this prototype</p></div></div>
          ${reviews.map((r) => `<div class="review"><div class="review__head"><span class="avatar">${r.name[0]}</span><div><b>${r.name}</b><small>${r.country} · ${r.month}</small></div><span class="score" style="margin-left:auto">${r.score}</span></div><p>${TE.esc(r.text)}</p></div>`).join('')}
        </section>
      </div>

      <aside class="bookbox" id="book" aria-label="Book this trip">
        <div class="bookbox__price"><small>Price per person, from</small><strong>${TE.price(d.price)}</strong> <span>/ person</span></div>
        <form id="bookForm" novalidate>
          <div class="opt" role="radiogroup" aria-label="Trip type">
            <label><input type="radio" name="type" value="open" checked><b>Open trip</b>Small shared group</label>
            <label><input type="radio" name="type" value="private"><b>Private trip</b>+ ${TE.price(d.privateSurcharge)}</label>
          </div>
          <div class="field">
            <label for="bDate">Date</label>
            <input type="date" id="bDate" class="input" min="${minDate}" value="${state.date}">
          </div>
          <div class="field">
            <span class="label" id="gLabel">Guests</span>
            <div class="stepper" role="group" aria-labelledby="gLabel">
              <button type="button" class="icon-btn" id="gMinus" aria-label="Remove a guest">−</button>
              <output id="gCount">${state.guests}</output>
              <button type="button" class="icon-btn" id="gPlus" aria-label="Add a guest">+</button>
            </div>
          </div>
          <p class="quota" id="quota"></p>
          <div>
            <div class="sumline"><span id="sBaseL"></span><b id="sBase"></b></div>
            <div class="sumline" id="sPrivRow" hidden><span>Private boat &amp; guide</span><b>${TE.price(d.privateSurcharge)}</b></div>
            <div class="sumline"><span>Taxes &amp; service</span><b>Included</b></div>
            <div class="sumline sumline--total"><span>Total</span><b id="sTotal"></b></div>
          </div>
          <button type="submit" class="btn btn--cta btn--lg btn--block">Book now</button>
        </form>
        <div class="bookbox__trust">
          <span>${TE.icon('check', 14)} Free cancellation up to 7 days before</span>
          <span>${TE.icon('check', 14)} Instant e-ticket by email</span>
          <span>${TE.icon('check', 14)} Pay by card, QRIS, bank transfer or PayPal</span>
        </div>
        <button type="button" class="btn btn--ghost btn--block btn--sm" style="margin-top:12px" data-ai-open>${TE.icon('chat', 16)} Questions? Ask Coastal AI</button>
      </aside>
    </div>`;

  TE.$('#mbPrice').innerHTML = TE.price(d.price);

  /* ---------- booking box ---------- */
  const form = TE.$('#bookForm');
  function updateBox() {
    const left = spotsLeft(state.date);
    if (state.guests > left) state.guests = left;
    TE.$('#gCount').textContent = state.guests;
    TE.$('#gMinus').disabled = state.guests <= 1;
    TE.$('#gPlus').disabled = state.guests >= left;
    const q = TE.$('#quota');
    q.innerHTML = `${TE.icon(left <= 4 ? 'info' : 'check', 14)} ${left} of ${d.quota} spots left on ${TE.niceDate(state.date)}`;
    q.classList.toggle('is-low', left <= 4);
    TE.$('#sBaseL').innerHTML = `${TE.money(d.price)} × ${state.guests} guest${state.guests > 1 ? 's' : ''}`;
    TE.$('#sBase').innerHTML = TE.price(d.price * state.guests);
    TE.$('#sPrivRow').hidden = state.type !== 'private';
    TE.$('#sTotal').innerHTML = TE.price(total());
  }
  form.addEventListener('change', (e) => {
    if (e.target.name === 'type') state.type = e.target.value;
    if (e.target.id === 'bDate') state.date = e.target.value < minDate ? minDate : e.target.value;
    updateBox();
  });
  TE.$('#gMinus').addEventListener('click', () => { state.guests = Math.max(1, state.guests - 1); updateBox(); });
  TE.$('#gPlus').addEventListener('click', () => { state.guests += 1; updateBox(); });
  form.addEventListener('submit', (e) => { e.preventDefault(); openCheckout(); });
  document.addEventListener('te:currency', updateBox);
  updateBox();

  /* ---------- misc ---------- */
  TE.$('#shareBtn').addEventListener('click', async () => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title: d.name, url });
      else { await navigator.clipboard.writeText(url); TE.toast('Link copied', 'Share it with your travel buddies'); }
    } catch (err) { /* cancelled */ }
  });
  document.addEventListener('click', (e) => {
    const q = e.target.closest('[data-ai-q]'); if (q) TE.assistant.open(q.dataset.aiQ);
    if (e.target.closest('[data-ai-open]')) TE.assistant.open();
  });

  const tabLinks = TE.$$('#tabs a');
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) tabLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  TE.$$('.panel[id]').forEach((p) => io.observe(p));

  TE.makeMap(TE.$('#tripMap'), [d], { zoom: 7 });

  /* ------------------------------------------------------------------ */
  /* Checkout                                                            */
  /* ------------------------------------------------------------------ */
  const dlg = TE.$('#checkout');
  const steps = [TE.$('#coStep1'), TE.$('#coStep2'), TE.$('#coStep3')];
  const next = TE.$('#coNext'), back = TE.$('#coBack');
  let step = 1, timer = null, paying = false, booking = null;

  const COUNTRIES = ['ID', 'SG', 'MY', 'AU', 'US', 'GB', 'NL', 'DE', 'FR', 'JP', 'KR', 'CN', 'IN', 'TH', 'PH', 'VN', 'NZ', 'CA', 'ES', 'IT', 'CH', 'SE', 'BE', 'SA', 'AE', 'BN', 'TW', 'HK'];
  const regionNames = (() => { try { return new Intl.DisplayNames(['en'], { type: 'region' }); } catch (e) { return { of: (c) => c }; } })();
  TE.$('#coCountry').innerHTML = COUNTRIES.map((c) => [c, regionNames.of(c)]).sort((a, b) => a[1].localeCompare(b[1]))
    .map(([c, n]) => `<option value="${c}">${n}</option>`).join('') + '<option value="XX">Other</option>';
  TE.$('#coCountry').value = 'AU';

  const setErr = (el, bad) => { el.closest('.field').classList.toggle('has-error', bad); el.setAttribute('aria-invalid', String(bad)); return bad; };

  function goto(n) {
    step = n;
    steps.forEach((s, i) => { s.hidden = i !== n - 1; });
    TE.$$('#coSteps [data-step]').forEach((s) => {
      const k = +s.dataset.step;
      s.classList.toggle('is-current', k === n);
      s.classList.toggle('is-done', k < n);
    });
    back.hidden = n !== 2;
    TE.$('#coFoot').hidden = false;
    if (n === 1) next.textContent = 'Continue to payment';
    if (n === 2) { next.textContent = 'Pay ' + TE.money(total()); startTimer(); }
    if (n === 3) { stopTimer(); next.textContent = 'View my bookings'; }
    steps[n - 1].scrollTop = 0;
  }

  function openCheckout() {
    booking = null;
    TE.$('#coOrder').innerHTML = `<span class="media">${TE.destImg(d)}</span><div><b>${TE.esc(d.name)} · ${state.type === 'open' ? 'Open' : 'Private'} trip</b>
      <span>${TE.niceDate(state.date)} · ${d.duration} · ${state.guests} guest${state.guests > 1 ? 's' : ''}</span></div>`;
    TE.$('#coTotal').innerHTML = TE.price(total());
    TE.$('#qrisCode').innerHTML = TE.qrSvg('QRIS' + d.id + total());
    updateVa();
    TE.$$('#coStep1 .field, #coStep2 .field').forEach((f) => f.classList.remove('has-error'));
    goto(1);
    dlg.showModal();
    document.body.style.overflow = 'hidden';
    setTimeout(() => TE.$('#coName').focus(), 50);
  }
  function closeCheckout() {
    if (paying) return;
    stopTimer(); dlg.close();
  }
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; stopTimer(); });
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeCheckout(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) closeCheckout(); });

  function startTimer() {
    stopTimer();
    let s = 15 * 60;
    const el = TE.$('#coTimer');
    const tick = () => { el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; if (s-- <= 0) { stopTimer(); TE.toast('Payment time expired', 'Please start again.'); goto(1); } };
    tick(); timer = setInterval(tick, 1000);
  }
  function stopTimer() { clearInterval(timer); timer = null; }

  function updateVa() {
    const prefix = { BCA: '39358', Mandiri: '89608', BNI: '98829', BRI: '26215' }[TE.$('#vaBank').value];
    TE.$('#vaNum').textContent = prefix + String(Math.abs(total() * 7 + state.guests) % 1e11).padStart(11, '0');
  }
  TE.$('#vaBank').addEventListener('change', updateVa);
  TE.$('#vaCopy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(TE.$('#vaNum').textContent); TE.toast('Virtual account number copied'); } catch (e) { /* ignore */ }
  });

  // card input formatting
  TE.$('#ccNum').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
  TE.$('#ccExp').addEventListener('input', (e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v; });
  TE.$('#ccCvc').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });

  function validStep1() {
    const n = TE.$('#coName'), em = TE.$('#coEmail'), ph = TE.$('#coPhone');
    const bad = [
      setErr(n, n.value.trim().length < 2),
      setErr(em, !EMAIL_RE.test(em.value.trim())),
      setErr(ph, ph.value.replace(/\D/g, '').length < 8)
    ];
    const first = [n, em, ph][bad.indexOf(true)];
    if (first) first.focus();
    return !bad.includes(true);
  }
  function validStep2() {
    const method = TE.$('input[name=pay]:checked').value;
    if (method === 'card') {
      const num = TE.$('#ccNum'), exp = TE.$('#ccExp'), cvc = TE.$('#ccCvc');
      const [mm, yy] = exp.value.split('/').map((x) => parseInt(x, 10));
      const now = new Date(); const expOk = mm >= 1 && mm <= 12 && yy >= 0 && new Date(2000 + yy, mm, 0) >= new Date(now.getFullYear(), now.getMonth(), 1);
      const bad = [setErr(num, num.value.replace(/\D/g, '').length !== 16), setErr(exp, !expOk), setErr(cvc, !/^\d{3,4}$/.test(cvc.value))];
      if (bad.includes(true)) return false;
    }
    if (!TE.$('#coTerms').checked) { TE.toast('Please accept the booking terms', 'Tick the box above the Pay button.'); return false; }
    return true;
  }

  async function pay() {
    paying = true;
    next.disabled = true; back.disabled = true;
    next.innerHTML = '<span class="spinner"></span> Processing…';
    await TE.sleep(1600);
    const method = TE.$('input[name=pay]:checked').value;
    booking = {
      id: 'TEC-' + Date.now().toString(36).toUpperCase().slice(-6),
      destId: d.id, type: state.type, date: state.date, guests: state.guests, total: total(),
      name: TE.$('#coName').value.trim(), email: TE.$('#coEmail').value.trim(), phone: TE.$('#coPhone').value.trim(),
      country: TE.$('#coCountry').value, diet: TE.$('#coDiet').value,
      pay: { card: 'Card •••• ' + TE.$('#ccNum').value.slice(-4), qris: 'QRIS', va: TE.$('#vaBank').value + ' virtual account', paypal: 'PayPal' }[method],
      createdAt: new Date().toISOString(), status: 'confirmed'
    };
    TE.bookings.add(booking);
    paying = false; next.disabled = false; back.disabled = false;
    TE.$('#coStep3').innerHTML = TE.ticketHTML(booking, true);
    goto(3);
    TE.toast('Booking confirmed', `${booking.id} · e-ticket sent to ${booking.email}`);
  }

  next.addEventListener('click', () => {
    if (paying) return;
    if (step === 1 && validStep1()) goto(2);
    else if (step === 2 && validStep2()) pay();
    else if (step === 3) location.href = 'bookings.html';
  });
  back.addEventListener('click', () => goto(1));
  TE.$('#coStep1').addEventListener('submit', (e) => { e.preventDefault(); next.click(); });
  dlg.addEventListener('click', (e) => { if (e.target.closest('[data-print]')) window.print(); });
})();
