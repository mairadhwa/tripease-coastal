
(function () {
  'use strict';
  const TE = window.TE;
  let filter = 'upcoming';
  const todayIso = TE.isoDate(new Date());

  function render() {
    const all = TE.bookings.all();
    const list = all.filter((b) =>
      filter === 'cancelled' ? b.status === 'cancelled'
        : filter === 'past' ? b.status === 'confirmed' && b.date < todayIso
          : b.status === 'confirmed' && b.date >= todayIso);
    const el = TE.$('#bkList');
    if (!list.length) {
      el.innerHTML = `<div class="empty"><strong>${filter === 'upcoming' ? 'No upcoming trips yet' : 'Nothing here'}</strong>
        <p>${filter === 'upcoming' ? 'Find a hidden coastal gem and your e-ticket will appear here.' : 'Bookings in this category will show up here.'}</p>
        <a href="search.html" class="btn btn--primary">Explore trips</a></div>`;
      return;
    }
    el.innerHTML = list.map((b) => {
      const d = TE.getDestination(b.destId);
      if (!d) return '';
      const days = Math.round((new Date(b.date + 'T00:00:00') - new Date(todayIso + 'T00:00:00')) / 86400000);
      const canCancel = b.status === 'confirmed' && days >= 7;
      return `
        <article class="bk">
          <a class="bk__media media" href="trip.html?id=${d.id}">${TE.destImg(d)}</a>
          <div class="bk__body">
            <span class="muted small">Booking code <b class="mono">${b.id}</b></span>
            <h3>${TE.esc(d.name)} · ${b.type === 'open' ? 'Open' : 'Private'} trip</h3>
            <div class="bk__meta">
              <span>${TE.icon('calendar', 14)} ${TE.niceDate(b.date)}</span>
              <span>${TE.icon('users', 14)} ${b.guests} guest${b.guests > 1 ? 's' : ''}</span>
              <span>${TE.icon('card', 14)} ${TE.esc(b.pay)}</span>
            </div>
            ${b.status === 'confirmed' && days >= 0 ? `<span class="small" style="color:var(--eco)">${days === 0 ? 'Your trip starts today!' : `Your trip starts in ${days} day${days === 1 ? '' : 's'}`}</span>` : ''}
          </div>
          <div class="bk__side">
            <span class="status status--${b.status}">${b.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}</span>
            <strong>${TE.price(b.total)}</strong>
            <div class="bk__actions">
              ${b.status === 'confirmed' ? `<button type="button" class="btn btn--primary btn--sm" data-ticket="${b.id}">E-ticket</button>` : ''}
              ${canCancel ? `<button type="button" class="btn btn--ghost btn--sm" data-cancel="${b.id}">Cancel</button>` : ''}
            </div>
          </div>
        </article>`;
    }).join('');
  }

  TE.$$('[data-f]').forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.f;
    TE.$$('[data-f]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  }));

  const dlg = TE.$('#ticketDlg');
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-ticket]');
    if (t) {
      const b = TE.bookings.all().find((x) => x.id === t.dataset.ticket);
      TE.$('#tkBody').innerHTML = TE.ticketHTML(b, false);
      dlg.showModal();
    }
    const c = e.target.closest('[data-cancel]');
    if (c && confirmCancel(c)) {
      TE.bookings.update(c.dataset.cancel, { status: 'cancelled' });
      TE.toast('Booking cancelled', 'A full refund would be issued to your original payment method.');
      render();
    }
    if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    if (e.target.closest('[data-print]')) window.print();
  });

  function confirmCancel(btn) {
    if (btn.dataset.armed) return true;
    btn.dataset.armed = '1';
    btn.textContent = 'Tap again to cancel';
    btn.style.color = 'var(--danger)';
    setTimeout(() => { if (btn.isConnected) { delete btn.dataset.armed; btn.textContent = 'Cancel'; btn.style.color = ''; } }, 3000);
    return false;
  }

  function renderWish() {
    const w = TE.wish.all().map(TE.getDestination).filter(Boolean);
    TE.$('#wishTrack').innerHTML = w.length ? w.map(TE.card).join('')
      : '<div class="empty" style="grid-column:1/-1"><strong>No saved trips yet</strong><p>Tap the heart on any trip to save it here.</p></div>';
    TE.rail(TE.$('#wishRail'));
  }

  document.addEventListener('te:currency', render);
  render();
  renderWish();
})();
