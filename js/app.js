/* ==========================================================================
   TripEase Coastal — interactions
   Navigation · catalog & search · booking checkout · toast ·
   phrase assistant · partner registration · animated counters
   ========================================================================== */

(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const PACKAGES = window.PACKAGES || [];
  const SPLIT = window.REVENUE_SPLIT;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rp = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(n));
  const usd = (n) => '≈ US$' + Math.round(n / window.IDR_PER_USD).toLocaleString('en-US');
  const isoDate = (d) => {
    const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return z.toISOString().slice(0, 10);
  };
  const niceDate = (iso) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const ICON_CHECK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>';
  const ICON_STAR = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
  const ICON_LEAF = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.2-6"/></svg>';

  /* ------------------------------------------------------------------------
     1. Header & navigation
     ------------------------------------------------------------------------ */
  const header = $('#header');
  const menuToggle = $('#menuToggle');

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuToggle.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));

  // Smooth-scroll every in-page link and close the mobile menu afterwards.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    const target = id === '#top' ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (id === '#top') {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    } else {
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    history.replaceState(null, '', id);
  });

  // Highlight the nav link of the section in view.
  const navLinks = $$('.nav a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) sectionObserver.observe(s); });

  /* ------------------------------------------------------------------------
     2. Catalog, theme chips & search
     ------------------------------------------------------------------------ */
  const filters = { theme: 'all', where: 'any', guests: 1, date: '' };
  const grid = $('#tripGrid');
  const chipsWrap = $('#themeChips');
  const whereSelect = $('#searchWhere');
  const dateInput = $('#searchDate');
  const guestSelect = $('#searchGuests');

  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  dateInput.min = isoDate(today);
  dateInput.value = isoDate(tomorrow);

  PACKAGES.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.location;
    whereSelect.appendChild(opt);
  });

  window.THEMES.forEach((t) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = t.label;
    b.dataset.theme = t.id;
    b.setAttribute('aria-pressed', String(t.id === filters.theme));
    chipsWrap.appendChild(b);
  });
  chipsWrap.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    filters.theme = chip.dataset.theme;
    $$('.chip', chipsWrap).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    renderTrips();
  });

  function cardHTML(p) {
    const eco = p.price * SPLIT.conservation;
    return `
      <article class="card" data-id="${p.id}">
        <div class="card__media">
          <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.style.visibility='hidden'">
          <span class="badge">${ICON_CHECK} Verified by ${p.partner}</span>
        </div>
        <div class="card__body">
          <div class="card__meta">
            <span>${p.location} · ${p.duration}</span>
            <span class="rating">${ICON_STAR} ${p.rating.toFixed(1)} <small>(${p.reviews})</small></span>
          </div>
          <h3>${p.title}</h3>
          <p class="card__desc">${p.description}</p>
          <p class="card__eco">${ICON_LEAF}<span>${rp(eco)} per guest goes to ${p.conservationUse}</span></p>
          <div class="card__foot">
            <p class="price"><strong>${rp(p.price)}</strong> / person</p>
            <button type="button" class="btn btn--secondary btn--sm" data-book="${p.id}">Book trip</button>
          </div>
        </div>
      </article>`;
  }

  function renderTrips() {
    const list = PACKAGES.filter((p) =>
      (filters.theme === 'all' || p.themes.includes(filters.theme)) &&
      (filters.where === 'any' || p.id === filters.where) &&
      p.quotaLeft >= filters.guests
    );
    $('#resultCount').textContent = list.length === 1 ? '1 trip' : list.length + ' trips';
    grid.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : `<div class="empty">
           <strong>No trips match your search</strong>
           <p>Try another destination, theme or group size.</p>
           <button type="button" class="btn btn--secondary" id="resetFilters">Clear filters</button>
         </div>`;
  }

  grid.addEventListener('click', (e) => {
    if (e.target.closest('#resetFilters')) {
      filters.theme = 'all'; filters.where = 'any'; filters.guests = 1;
      whereSelect.value = 'any'; guestSelect.value = '1';
      $$('.chip', chipsWrap).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.theme === 'all')));
      renderTrips();
      return;
    }
    const card = e.target.closest('.card');
    if (card) openBooking(card.dataset.id);
  });

  $('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    filters.where = whereSelect.value;
    filters.guests = parseInt(guestSelect.value, 10);
    filters.date = dateInput.value;
    renderTrips();
    $('#trips').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  renderTrips();

  /* ------------------------------------------------------------------------
     3. Booking checkout
     ------------------------------------------------------------------------ */
  const modal = $('#bookingModal');
  const bookingForm = $('#bookingForm');
  const bookingSuccess = $('#bookingSuccess');
  const nameInput = $('#bkName');
  const emailInput = $('#bkEmail');
  const payBtn = $('#payBtn');
  const payHint = $('#payHint');

  const booking = { pkg: null, type: 'open', guests: 1, processing: false, id: '', timer: null };

  const total = () => {
    const p = booking.pkg;
    return p.price * booking.guests + (booking.type === 'private' ? p.privateSurcharge : 0);
  };
  const nameValid = () => nameInput.value.trim().length >= 2;
  const emailValid = () => EMAIL_RE.test(emailInput.value.trim());

  function updateSummary() {
    const p = booking.pkg;
    const t = total();
    $('#guestCount').textContent = booking.guests;
    $('#guestMinus').disabled = booking.guests <= 1;
    $('#guestPlus').disabled = booking.guests >= p.quotaLeft;
    $('#sumBaseLabel').textContent = `${rp(p.price)} × ${booking.guests} ${booking.guests > 1 ? 'guests' : 'guest'}`;
    $('#sumBase').textContent = rp(p.price * booking.guests);
    $('#sumPrivateRow').hidden = booking.type !== 'private';
    $('#sumPrivate').textContent = rp(p.privateSurcharge);
    $('#sumTotal').textContent = rp(t);
    $('#sumUsd').textContent = usd(t) + ' (indicative)';
    $('#splitLocal').textContent = rp(t * SPLIT.local);
    $('#splitEco').textContent = rp(t * SPLIT.conservation);
    $('#splitPlatform').textContent = rp(t * SPLIT.platform);
    updatePayButton();
  }

  function updatePayButton() {
    const ok = nameValid() && emailValid();
    payBtn.disabled = !ok || booking.processing;
    if (!booking.processing) payBtn.textContent = 'Confirm and pay ' + rp(total());
    payHint.textContent = ok ? 'Simulation only. No real payment is charged.' : 'Enter your name and email to continue.';
  }

  function showFieldError(input, show) {
    input.closest('.field').classList.toggle('has-error', show);
    input.setAttribute('aria-invalid', String(show));
  }

  function openBooking(id) {
    const p = PACKAGES.find((x) => x.id === id);
    if (!p) return;
    clearTimeout(booking.timer);
    Object.assign(booking, { pkg: p, type: 'open', guests: Math.min(filters.guests, p.quotaLeft), processing: false });

    $('#bkThumb').src = p.img;
    $('#bkThumb').style.visibility = '';
    $('#bkLocation').textContent = `${p.location}, ${p.region}`;
    $('#bookingTitle').textContent = p.title;
    $('#bkMeta').textContent = `${p.duration} · Verified by ${p.partner}`;
    $('#bkPrivateNote').textContent = `+ ${rp(p.privateSurcharge)}, own boat and guide`;
    $('#bkQuota').textContent = `${p.quotaLeft} places left on this date. Daily limits protect the site.`;

    const bkDate = $('#bkDate');
    bkDate.min = isoDate(today);
    bkDate.value = filters.date || dateInput.value || isoDate(tomorrow);

    bookingForm.reset();
    bkDate.value = filters.date || dateInput.value || isoDate(tomorrow);
    $$('input[name="tripType"]', bookingForm).forEach((r) => { r.checked = r.value === 'open'; });
    [nameInput, emailInput].forEach((i) => showFieldError(i, false));

    bookingForm.hidden = false;
    bookingSuccess.hidden = true;
    updateSummary();

    modal.showModal();
    document.body.classList.add('no-scroll');
    $('.modal__scroll', modal).scrollTop = 0;
  }

  function closeBooking() {
    if (booking.processing || !modal.open) return;
    clearTimeout(booking.timer);
    const wasSuccess = !bookingSuccess.hidden;
    modal.close();
    if (wasSuccess) {
      showToast('Booking confirmed', `${booking.id} · Ticket sent to ${emailInput.value.trim()}`);
    }
  }

  modal.addEventListener('close', () => document.body.classList.remove('no-scroll'));
  modal.addEventListener('cancel', (e) => { e.preventDefault(); closeBooking(); }); // Esc key
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-close]')) closeBooking(); // backdrop or close buttons
  });

  bookingForm.addEventListener('change', (e) => {
    if (e.target.name === 'tripType') { booking.type = e.target.value; updateSummary(); }
  });
  $('#guestMinus').addEventListener('click', () => { booking.guests = Math.max(1, booking.guests - 1); updateSummary(); });
  $('#guestPlus').addEventListener('click', () => { booking.guests = Math.min(booking.pkg.quotaLeft, booking.guests + 1); updateSummary(); });

  nameInput.addEventListener('input', () => { if (nameValid()) showFieldError(nameInput, false); updatePayButton(); });
  emailInput.addEventListener('input', () => { if (emailValid()) showFieldError(emailInput, false); updatePayButton(); });
  nameInput.addEventListener('blur', () => showFieldError(nameInput, !nameValid()));
  emailInput.addEventListener('blur', () => {
    $('#bkEmailError').textContent = emailInput.value.trim()
      ? 'That email address doesn\'t look right.'
      : 'Enter your email so we can send your ticket.';
    showFieldError(emailInput, !emailValid());
  });

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showFieldError(nameInput, !nameValid());
    showFieldError(emailInput, !emailValid());
    if (!nameValid() || !emailValid() || booking.processing) return;

    booking.processing = true;
    payBtn.disabled = true;
    payBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Processing payment…';
    await sleep(1400); // simulated payment gateway
    booking.processing = false;

    const t = total();
    booking.id = 'TEC-' + Date.now().toString(36).toUpperCase().slice(-6);
    $('#okName').textContent = nameInput.value.trim().split(/\s+/)[0];
    $('#okEmail').textContent = emailInput.value.trim();
    $('#okId').textContent = booking.id;
    $('#okTrip').textContent = `${booking.type === 'open' ? 'Open' : 'Private'} trip · ${booking.guests} ${booking.guests > 1 ? 'guests' : 'guest'}`;
    $('#okDate').textContent = niceDate($('#bkDate').value);
    $('#okPaid').textContent = rp(t);
    $('#okEco').textContent = rp(t * SPLIT.conservation);

    bookingForm.hidden = true;
    bookingSuccess.hidden = false;
    $('.modal__scroll', modal).scrollTop = 0;
    booking.timer = setTimeout(closeBooking, 3500);
  });

  /* ------------------------------------------------------------------------
     4. Toast
     ------------------------------------------------------------------------ */
  const toast = $('#toast');
  let toastTimer = null;
  function showToast(title, msg) {
    $('#toastTitle').textContent = title;
    $('#toastMsg').textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 5000);
  }
  $('#toastClose').addEventListener('click', () => toast.classList.remove('is-visible'));

  /* ------------------------------------------------------------------------
     5. Phrase & culture assistant
     ------------------------------------------------------------------------ */
  const chatBody = $('#chatBody');
  const chatForm = $('#chatForm');
  const chatInput = $('#chatInput');
  const chatSend = $('#chatSend');
  const chatStatus = $('#chatStatus');
  let aiBusy = false;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };
  const scrollChat = () => { chatBody.scrollTop = chatBody.scrollHeight; };

  function setBusy(busy) {
    aiBusy = busy;
    chatInput.disabled = busy;
    chatSend.disabled = busy || !chatInput.value.trim();
    $$('#suggestions button').forEach((b) => { b.disabled = busy; });
    chatStatus.textContent = busy ? 'Typing…' : 'Usually replies in a few seconds';
  }

  function addUserMessage(text) {
    const m = el('div', 'msg msg--user');
    m.appendChild(el('p', '', text));
    chatBody.appendChild(m);
  }

  function addBotMessage(a) {
    const m = el('div', 'msg msg--bot');
    if (a.title) m.appendChild(el('p', 'msg__title', a.title));
    if (a.phrase) m.appendChild(el('p', 'msg__phrase', a.phrase));
    if (a.pronunciation) m.appendChild(el('p', 'msg__say', 'Say: ' + a.pronunciation));
    if (a.meaning) m.appendChild(el('p', 'msg__meaning', a.meaning));
    if (a.tip) {
      const tip = el('p', 'msg__tip');
      tip.appendChild(el('b', '', 'Local tip: '));
      tip.appendChild(document.createTextNode(a.tip));
      m.appendChild(tip);
    }
    chatBody.appendChild(m);
  }

  async function ask(question) {
    question = question.trim();
    if (!question || aiBusy) return;
    addUserMessage(question);
    chatInput.value = '';
    setBusy(true);

    const typing = el('div', 'msg msg--bot typing');
    typing.setAttribute('aria-label', 'Assistant is typing');
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typing);
    scrollChat();

    try {
      const delay = 1500 + Math.random() * 500; // 1.5 to 2 seconds
      const [answer] = await Promise.all([window.TripEaseAssistant.ask(question), sleep(delay)]);
      typing.remove();
      addBotMessage(answer);
    } catch (err) {
      console.error(err);
      typing.remove();
      addBotMessage({ title: 'Connection problem', tip: 'The assistant could not be reached. Please try again in a moment, or ask your local guide.' });
    } finally {
      setBusy(false);
      scrollChat();
      if (window.matchMedia('(hover: hover)').matches) chatInput.focus();
    }
  }

  chatInput.addEventListener('input', () => { chatSend.disabled = aiBusy || !chatInput.value.trim(); });
  chatForm.addEventListener('submit', (e) => { e.preventDefault(); ask(chatInput.value); });
  $('#suggestions').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-q]');
    if (b) ask(b.dataset.q);
  });

  /* ------------------------------------------------------------------------
     6. Partner registration (simulated)
     ------------------------------------------------------------------------ */
  const partnerForm = $('#partnerForm');
  const partnerSuccess = $('#partnerSuccess');
  const partnerFields = ['#pName', '#pType', '#pInst', '#pVillage', '#pEmail'].map((s) => $(s));
  const partnerValid = (input) => input.type === 'email' ? EMAIL_RE.test(input.value.trim()) : input.value.trim() !== '';

  partnerFields.forEach((input) => {
    const evt = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(evt, () => { if (partnerValid(input)) showFieldError(input, false); });
  });

  partnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstInvalid = null;
    partnerFields.forEach((input) => {
      const ok = partnerValid(input);
      showFieldError(input, !ok);
      if (!ok && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const btn = $('#partnerSubmit');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Submitting…';
    await sleep(1200);

    const ref = 'PTR-' + Date.now().toString(36).toUpperCase().slice(-5);
    $('#partnerSuccessText').textContent =
      `Reference ${ref}. Your ${$('#pInst').value} in ${$('#pVillage').value.trim()} will contact ${$('#pEmail').value.trim()} to arrange verification.`;
    partnerForm.hidden = true;
    partnerSuccess.hidden = false;
    btn.disabled = false;
    btn.textContent = 'Submit for verification';
    showToast('Application submitted', ref + ' · Waiting for verification');
  });

  $('#partnerReset').addEventListener('click', () => {
    partnerForm.reset();
    partnerFields.forEach((i) => showFieldError(i, false));
    partnerSuccess.hidden = true;
    partnerForm.hidden = false;
    $('#pName').focus();
  });

  /* ------------------------------------------------------------------------
     7. Animated counters & bars (run once, when scrolled into view)
     ------------------------------------------------------------------------ */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(node) {
    const target = parseFloat(node.dataset.target);
    const prefix = node.dataset.prefix || '';
    const suffix = node.dataset.suffix || '';
    const format = (v) => prefix + Math.round(v).toLocaleString('en-US') + suffix;
    if (reduceMotion) { node.textContent = format(target); return; }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      node.textContent = format(target * (1 - Math.pow(1 - p, 3))); // ease-out cubic
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      if (node.hasAttribute('data-counter')) animateCounter(node);
      if (node.hasAttribute('data-bar')) node.style.width = node.dataset.width + '%';
      obs.unobserve(node);
    });
  }, { threshold: 0.4 });
  $$('[data-counter], [data-bar]').forEach((n) => countObserver.observe(n));

  /* ------------------------------------------------------------------------ */
  $('#year').textContent = new Date().getFullYear();
})();
