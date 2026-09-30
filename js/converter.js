
(function () {
  'use strict';
  const TE = window.TE;
  let uid = 0;

  function options(selected) {
    const { asia, rest } = TE.currency.codes();
    const opt = (c) => `<option value="${c}" ${c === selected ? 'selected' : ''}>${c} · ${TE.esc(TE.currency.name(c))}</option>`;
    return `<optgroup label="Asia">${asia.map(opt).join('')}</optgroup><optgroup label="Rest of the world">${rest.map(opt).join('')}</optgroup>`;
  }

  TE.converter = function (root, cfg) {
    cfg = Object.assign({ amount: 1000000, from: 'IDR', to: 'USD', quick: true }, cfg || {});
    const id = 'cv' + (++uid);
    root.innerHTML = `
      <div class="conv">
        <div class="field">
          <label for="${id}a">Amount</label>
          <div class="conv__side">
            <input id="${id}a" class="input" type="text" inputmode="decimal" value="${cfg.amount.toLocaleString('en-US')}" aria-label="Amount to convert">
            <select id="${id}f" class="input" aria-label="From currency"></select>
          </div>
        </div>
        <button type="button" class="conv__swap" id="${id}s" aria-label="Swap currencies">${TE.icon('swap', 18)}</button>
        <div class="field">
          <label for="${id}t">Converted to</label>
          <div class="conv__side">
            <input id="${id}o" class="input" type="text" readonly aria-label="Converted amount" tabindex="-1">
            <select id="${id}t" class="input" aria-label="To currency"></select>
          </div>
        </div>
      </div>
      <div class="conv__result" aria-live="polite"><strong id="${id}r">…</strong><span id="${id}x"></span></div>
      ${cfg.quick ? `<div class="conv__quick" id="${id}q">
        ${[100000, 500000, 1000000, 2500000, 5000000].map((v) => `<button type="button" data-v="${v}">Rp ${v.toLocaleString('id-ID')}</button>`).join('')}
      </div>` : ''}
      <p class="rate-status" id="${id}st" style="margin-top:10px"><i></i><span>Loading exchange rates…</span></p>`;

    const $ = (s) => TE.$('#' + id + s);
    const amount = $('a'), from = $('f'), to = $('t'), out = $('o');

    const parse = () => parseFloat(amount.value.replace(/[^0-9.]/g, '')) || 0;

    function calc() {
      const v = parse();
      const res = TE.currency.convert(v, from.value, to.value);
      const one = TE.currency.convert(1, from.value, to.value);
      const back = TE.currency.convert(1, to.value, from.value);
      out.value = isNaN(res) ? '—' : TE.currency.fmt(res, to.value);
      $('r').textContent = `${TE.currency.fmt(v, from.value)} = ${isNaN(res) ? '—' : TE.currency.fmt(res, to.value)}`;
      const small = (x) => (x < 0.01 ? x.toPrecision(3) : x.toLocaleString('en-US', { maximumFractionDigits: 4 }));
      $('x').textContent = `1 ${from.value} = ${small(one)} ${to.value} · 1 ${to.value} = ${small(back)} ${from.value}`;
    }

    function fill() {
      from.innerHTML = options(from.value || cfg.from);
      to.innerHTML = options(to.value || cfg.to);
      const st = $('st');
      const live = TE.currency.source === 'live';
      st.classList.toggle('is-offline', !live);
      st.querySelector('span').textContent = live
        ? `Live mid-market rates · updated ${String(TE.currency.updated).replace(' +0000', '')}`
        : 'Offline estimate — connect to the internet for live rates';
      calc();
    }

    amount.addEventListener('input', () => {
      const pos = amount.value.length - amount.selectionStart;
      const raw = amount.value.replace(/[^0-9.]/g, '');
      const [i, d] = raw.split('.');
      amount.value = (i ? parseInt(i, 10).toLocaleString('en-US') : '') + (d !== undefined ? '.' + d.slice(0, 2) : '');
      amount.setSelectionRange(amount.value.length - pos, amount.value.length - pos);
      calc();
    });
    from.addEventListener('change', calc);
    to.addEventListener('change', calc);
    $('s').addEventListener('click', () => { const f = from.value; from.value = to.value; to.value = f; calc(); });
    const q = $('q');
    if (q) q.addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      from.value = 'IDR'; amount.value = parseInt(b.dataset.v, 10).toLocaleString('en-US'); calc();
    });

    from.innerHTML = `<option>${cfg.from}</option>`; from.value = cfg.from;
    to.innerHTML = `<option>${cfg.to}</option>`; to.value = cfg.to;
    TE.ready.then(fill);
    return { setTo(code) { to.value = code; calc(); } };
  };
})();
