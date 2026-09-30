/* ==========================================================================
   TripEase Coastal — Coastal AI assistant (floating chat widget)
   --------------------------------------------------------------------------
   Answers from the destination database (js/data/destinations.js):
   local food, where to shop, best season, how to get there, activities,
   prices, recommendations by activity or month — plus Indonesian phrases
   and etiquette. Understands simple English and Indonesian questions.

   provider: 'local'  Built-in engine, no API key. Default for demos.
             'proxy'  RECOMMENDED for a real AI: your own backend keeps the
                      key and calls OpenAI/Gemini with the database as context.
             'gemini' / 'openai'  Direct browser calls — private demos only.
   Never commit a real API key to a public GitHub repository.
   ========================================================================== */

(function () {
  'use strict';
  const TE = window.TE;

  const AI_CONFIG = {
    provider: 'local',
    apiKey: '',
    geminiModel: 'gemini-2.0-flash',   // check current model names in the provider docs
    openaiModel: 'gpt-4o-mini',
    proxyUrl: '/api/coastal-assistant'
  };

  /* ------------------------------------------------------------------ */
  /* 1. Local knowledge engine                                           */
  /* ------------------------------------------------------------------ */
  const ALIASES = {
    kei: ['kei', 'kai islands', 'ngurbloat', 'pasir panjang', 'langgur', 'tual'],
    togean: ['togean', 'togian', 'ampana', 'wakai', 'kadidiri', 'tojo una'],
    anambas: ['anambas', 'tarempa', 'jemaja', 'siantan', 'padang melang'],
    alor: ['alor', 'kalabahi', 'kepa', 'pantar'],
    banyak: ['banyak', 'singkil', 'bangkaru', 'haloban', 'pulau balai'],
    widi: ['widi', 'halmahera', 'ternate'],
    moyo: ['moyo', 'sumbawa', 'mata jitu'],
    gelasa: ['gelasa', 'bangka', 'pangkalpinang', 'koba'],
    baros: ['baros', 'yogyakarta', 'yogya', 'jogja', 'bantul', 'kretek']
  };

  const ACT_WORDS = {
    snorkeling: ['snorkel'], diving: ['dive', 'diving', 'scuba', 'selam'], surfing: ['surf', 'selancar', 'waves'],
    turtles: ['turtle', 'penyu'], mangrove: ['mangrove', 'bakau'], culture: ['culture', 'village', 'traditional', 'budaya', 'desa adat'],
    beach: ['beach', 'pantai', 'sand', 'pasir'], island: ['island hopping', 'hopping', 'pulau-pulau']
  };

  const MONTH_WORDS = [
    ['january', 'januari', 'jan'], ['february', 'februari', 'feb'], ['march', 'maret', 'mar'], ['april', 'apr'],
    ['in may', 'during may', 'mei'], ['june', 'juni', 'jun'], ['july', 'juli', 'jul'], ['august', 'agustus', 'aug', 'agu'],
    ['september', 'sep', 'sept'], ['october', 'oktober', 'oct', 'okt'], ['november', 'nov'], ['december', 'desember', 'dec', 'des']
  ];

  const INTENT_WORDS = {
    food: ['food', 'eat', 'dish', 'cuisine', 'culinary', 'restaurant', 'breakfast', 'dinner', 'lunch', 'snack', 'makan', 'kuliner', 'hungry', 'try'],
    shopping: ['shop', 'souvenir', 'buy', 'market', 'gift', 'oleh', 'belanja', 'pasar', 'beli', 'bring home', 'take home'],
    when: ['when', 'best time', 'season', 'month', 'weather', 'kapan', 'musim', 'bulan', 'cuaca'],
    getting: ['get there', 'get to', 'how to go', 'how do i go', 'reach', 'airport', 'flight', 'fly', 'ferry', 'transport', 'cara ke', 'menuju', 'pesawat', 'kapal', 'bandara'],
    price: ['price', 'cost', 'how much', 'budget', 'expensive', 'cheap', 'harga', 'biaya', 'berapa'],
    conservation: ['conservation', 'impact', 'fund', 'sustainab', 'konservasi', 'donation', 'where does my money'],
    recommend: ['recommend', 'suggest', 'where should', 'which destination', 'best place', 'hidden', 'rekomendasi', 'sarankan', 'where can i', 'where to'],
    etiquette: ['etiquette', 'respect', 'rules', 'taboo', 'dos and don', 'culture tips', 'etika', 'sopan', 'dress', 'wear'],
    activities: ['what to do', 'things to do', 'activities', 'activity', 'highlights', 'see', 'aktivitas', 'kegiatan'],
    about: ['tell me about', 'what is', 'about', 'overview', 'why', 'info', 'tentang']
  };

  const PHRASES = [
    { keys: ['greet', 'hello', 'halo', 'good morning', 'elder', 'say hi'],
      title: 'Greeting someone respectfully', phrase: 'Selamat pagi, Pak / Bu', pronunciation: 'suh-LAH-mat PAH-gee, pahk / boo',
      meaning: 'Good morning, sir / ma\'am. Use siang, sore or malam for midday, afternoon or evening.',
      tip: 'Offer your right hand for a gentle handshake, then lightly touch your chest. With elders, a slight bow goes a long way.' },
    { keys: ['thank', 'terima kasih'],
      title: 'Saying thank you', phrase: 'Terima kasih banyak', pronunciation: 'tuh-REE-mah KAH-see BAH-nyahk',
      meaning: 'Thank you very much. The reply is "Sama-sama".', tip: 'Thank your homestay host after meals — it is always appreciated.' },
    { keys: ['photo', 'picture', 'camera', 'foto'],
      title: 'Taking photos', phrase: 'Boleh saya foto?', pronunciation: 'BOH-leh SAH-yah FOH-toh',
      meaning: 'May I take a photo?', tip: 'Always ask first, especially with women, children and elders.' },
    { keys: ['sorry', 'excuse', 'permisi', 'maaf'],
      title: 'Excuse me and sorry', phrase: 'Permisi … Maaf', pronunciation: 'per-MEE-see … MAH-ahf',
      meaning: 'Excuse me … Sorry.', tip: 'Say "Permisi" with a slight bow when walking past people who are seated.' },
    { keys: ['help', 'emergency', 'sick', 'doctor', 'tolong'],
      title: 'Getting help', phrase: 'Tolong! Saya sakit.', pronunciation: 'TOH-long! SAH-yah SAH-kit',
      meaning: 'Help! I\'m sick.', tip: 'Indonesia\'s emergency number is 112. Save your guide\'s WhatsApp number before going to sea.' },
    { keys: ['toilet', 'bathroom', 'restroom'],
      title: 'Asking for directions', phrase: 'Di mana toilet?', pronunciation: 'dee MAH-nah TOY-let',
      meaning: 'Where is the toilet? Swap "toilet" for pantai (beach) or pasar (market).', tip: 'Point with your right thumb, not your index finger.' },
    { keys: ['spicy', 'pedas', 'allerg'],
      title: 'Ordering food', phrase: 'Tidak pedas, ya. Saya alergi …', pronunciation: 'TEE-dahk puh-DAHS, yah. SAH-yah ah-LEHR-gee …',
      meaning: 'Not spicy, please. I\'m allergic to …', tip: 'Eat and pass food with your right hand.' },
    { keys: ['how much is', 'ask the price', 'bargain', 'tawar'],
      title: 'Asking the price', phrase: 'Berapa harganya?', pronunciation: 'buh-RAH-pah har-GAH-nyah',
      meaning: 'How much is it?', tip: 'Community crafts have fixed fair prices — please don\'t bargain on those.' }
  ];

  const ctx = { dest: null };

  const norm = (s) => ' ' + s.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const has = (q, words) => words.some((w) => q.includes(w.length <= 3 ? ' ' + w + ' ' : w));

  function findDest(q) {
    for (const id in ALIASES) if (ALIASES[id].some((a) => q.includes(a))) return TE.getDestination(id);
    return null;
  }
  function findActivity(q) {
    for (const k in ACT_WORDS) if (ACT_WORDS[k].some((w) => q.includes(w))) return k;
    return null;
  }
  function findMonth(q) {
    for (let i = 0; i < 12; i++) if (MONTH_WORDS[i].some((w) => q.includes(' ' + w + ' '))) return i + 1;
    return null;
  }

  const destChips = (d) => [`Local food in ${d.name}`, `Where to shop in ${d.name}`, `Best time to visit ${d.name}`, `How to get to ${d.name}`];

  function localAnswer(question) {
    const q = norm(question);
    const named = findDest(q);
    const d = named || ctx.dest;
    const act = findActivity(q);
    const month = findMonth(q);
    const is = (k) => has(q, INTENT_WORDS[k]);
    if (named) ctx.dest = named;

    // Phrase / etiquette requests without a destination focus
    const phrase = PHRASES.find((p) => has(q, p.keys));
    if (phrase && !(is('food') && d) && !(is('price') && named)) {
      return { title: phrase.title, phrase: phrase.phrase, pronunciation: phrase.pronunciation, meaning: phrase.meaning, tip: phrase.tip,
        chips: ['How do I say thank you?', 'Can I take photos?', 'Recommend a hidden gem'] };
    }

    if (d && is('food')) {
      return { title: `What to eat in ${d.name}`, list: d.food,
        tip: 'Tell your guide about allergies before the trip, and eat with your right hand.',
        cards: [d.id], chips: [`Where to shop in ${d.name}`, `Best time to visit ${d.name}`, 'How do I order not spicy?'] };
    }
    if (d && is('shopping')) {
      return { title: `Shopping & souvenirs in ${d.name}`, list: d.shopping,
        tip: 'Buying directly from local makers keeps more money in the community.',
        cards: [d.id], chips: [`Local food in ${d.name}`, 'How do I ask the price?', `How to get to ${d.name}`] };
    }
    if (d && is('when')) {
      return { title: `Best time to visit ${d.name}`, text: d.bestTime,
        months: d.bestMonths, cards: [d.id], chips: [`How to get to ${d.name}`, `Local food in ${d.name}`] };
    }
    if (d && is('getting')) {
      return { title: `How to get to ${d.name}`, steps: d.gettingThere,
        tip: 'Remote islands depend on weather and boat schedules — keep a buffer day in your plans.',
        cards: [d.id], chips: [`Best time to visit ${d.name}`, `Where to shop in ${d.name}`] };
    }
    if (d && is('price')) {
      return { title: `Trip price: ${d.name}`,
        text: `The ${d.duration} community trip starts from ${TE.money(d.price)} per person (open trip). A private trip adds ${TE.money(d.privateSurcharge)} for your own boat and guide. 20% of every booking goes to ${d.conservationUse}.`,
        cards: [d.id], chips: ['Where does my money go?', `Local food in ${d.name}`] };
    }
    if (d && is('etiquette')) {
      return { title: `Local etiquette in ${d.name}`, text: d.etiquette,
        tip: 'Dress modestly in villages, ask before photos, and follow your guide\'s lead.', cards: [d.id],
        chips: ['How do I greet an elder?', `Local food in ${d.name}`] };
    }
    if (is('conservation')) {
      const s = TE.REVENUE_SPLIT;
      return { title: 'Where your money goes',
        list: [
          { name: `${s.local * 100}% to local operators`, desc: 'Homestays, boat owners, cooks and guides, paid through the village Pokdarwis or BUMDes.' },
          { name: `${s.conservation * 100}% to conservation`, desc: d ? `In ${d.name} it funds ${d.conservationUse}.` : 'Reef, mangrove, turtle and waste programmes managed with each village.' },
          { name: `${s.platform * 100}% platform commission`, desc: 'Marketing, booking and payment systems.' }
        ], chips: ['Recommend a hidden gem', 'How do I become a partner?'] };
    }
    if (named && (is('activities') || act)) {
      return { title: `Things to do in ${d.name}`, list: d.highlights.map((h) => ({ name: h, desc: '' })),
        text: d.why, cards: [d.id], chips: destChips(d) };
    }

    // Recommendations by activity and/or month
    if (act || month || is('recommend')) {
      let list = TE.DESTINATIONS.slice();
      if (act) list = list.filter((x) => x.activities.includes(act));
      if (month) list = list.filter((x) => x.bestMonths.includes(month));
      list.sort((a, b) => b.rating - a.rating);
      const bits = [act ? TE.ACTIVITIES[act].label.toLowerCase() : '', month ? 'in ' + TE.MONTHS[month - 1] : ''].filter(Boolean).join(' ');
      if (!list.length) return { title: 'No perfect match', text: `None of our partner destinations is ideal for ${bits}. Try another month or activity.`, chips: ['Recommend a hidden gem'] };
      return { title: bits ? `Hidden gems for ${bits}` : 'Hidden gems worth the journey',
        text: bits ? `These partner destinations match ${bits}:` : 'Quiet, community-run coastal destinations most travellers haven\'t heard of yet:',
        cards: list.slice(0, 3).map((x) => x.id), chips: ['Best snorkelling in October', 'Where can I see turtles?', 'Mangrove trips'] };
    }

    if (named) {
      return { title: d.name + ', ' + d.province, text: d.why, list: d.highlights.map((h) => ({ name: h, desc: '' })),
        cards: [d.id], chips: destChips(d) };
    }

    if (is('food') || is('shopping') || is('when') || is('getting')) {
      return { title: 'Which destination?', text: 'Tell me the destination and I\'ll answer from our local partners\' notes, for example:',
        chips: TE.DESTINATIONS.slice(0, 4).map((x) => (is('shopping') ? 'Where to shop in ' : is('when') ? 'Best time to visit ' : is('getting') ? 'How to get to ' : 'Local food in ') + x.name) };
    }

    return { title: 'I can help with that',
      text: 'Ask me about local food, where to shop, the best season, how to get there, trip prices, or Indonesian phrases and etiquette for any of our destinations.',
      chips: ['Recommend a hidden gem', 'Local food in Kei Islands', 'Where to shop in Alor', 'How do I greet an elder?'] };
  }

  /* ------------------------------------------------------------------ */
  /* 2. Real AI providers (optional)                                    */
  /* ------------------------------------------------------------------ */
  function systemPrompt() {
    const kb = TE.DESTINATIONS.map((d) => ({ id: d.id, name: d.name, province: d.province, why: d.why, highlights: d.highlights,
      bestTime: d.bestTime, gettingThere: d.gettingThere, food: d.food, shopping: d.shopping, etiquette: d.etiquette,
      priceIDR: d.price, duration: d.duration }));
    return `You are Coastal AI, the travel assistant of TripEase Coastal, a community-based coastal tourism platform in Indonesia.
Answer ONLY using this destination database; if the answer is not in it, say so and suggest asking the local guide.
Database: ${JSON.stringify(kb)}
Reply ONLY as JSON: {"title": string, "text": string, "list": [{"name": string, "desc": string}], "cards": [destination ids], "phrase": string, "pronunciation": string, "meaning": string, "tip": string}. Omit fields you don't need. Keep answers short.`;
  }
  const parse = (t) => { try { return JSON.parse(t.replace(/```json|```/g, '').trim()); } catch (e) { return { title: 'Coastal AI', text: t }; } };

  async function remoteAnswer(question) {
    if (AI_CONFIG.provider === 'proxy') {
      const r = await fetch(AI_CONFIG.proxyUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, systemPrompt: systemPrompt() }) });
      if (!r.ok) throw new Error('proxy ' + r.status);
      return r.json();
    }
    if (AI_CONFIG.provider === 'gemini') {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.geminiModel}:generateContent?key=${AI_CONFIG.apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt() }] }, contents: [{ role: 'user', parts: [{ text: question }] }],
          generationConfig: { responseMimeType: 'application/json' } }) });
      if (!r.ok) throw new Error('gemini ' + r.status);
      const j = await r.json();
      return parse(j.candidates[0].content.parts[0].text);
    }
    if (AI_CONFIG.provider === 'openai') {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + AI_CONFIG.apiKey },
        body: JSON.stringify({ model: AI_CONFIG.openaiModel, response_format: { type: 'json_object' },
          messages: [{ role: 'system', content: systemPrompt() }, { role: 'user', content: question }] }) });
      if (!r.ok) throw new Error('openai ' + r.status);
      const j = await r.json();
      return parse(j.choices[0].message.content);
    }
    return localAnswer(question);
  }

  /* ------------------------------------------------------------------ */
  /* 3. Chat widget UI                                                  */
  /* ------------------------------------------------------------------ */
  const root = document.createElement('div');
  root.className = 'ai';
  root.innerHTML = `
    <button type="button" class="ai__fab" id="aiFab" aria-controls="aiPanel" aria-expanded="false">
      <img src="assets/img/logo-icon.png" alt="" width="30" height="29"><span>Ask Coastal AI</span>
    </button>
    <section class="ai__panel" id="aiPanel" aria-label="Coastal AI assistant" hidden>
      <header class="ai__head">
        <span class="ai__avatar"><img src="assets/img/logo-icon.png" alt="" width="26" height="25"></span>
        <div><strong>Coastal AI</strong><span id="aiStatus">Food, shopping, travel tips &amp; phrases</span></div>
        <button type="button" class="ai__close" id="aiClose" aria-label="Close assistant">${TE.icon('close', 18)}</button>
      </header>
      <div class="ai__body" id="aiBody" aria-live="polite"></div>
      <div class="ai__chips" id="aiChips"></div>
      <form class="ai__form" id="aiForm">
        <label for="aiInput" class="sr-only">Ask a question</label>
        <input id="aiInput" class="input" placeholder="Ask in English or Bahasa Indonesia" autocomplete="off">
        <button type="submit" class="ai__send" id="aiSend" aria-label="Send" disabled>${TE.icon('send', 18)}</button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const fab = TE.$('#aiFab'), panel = TE.$('#aiPanel'), body = TE.$('#aiBody'), chips = TE.$('#aiChips');
  const form = TE.$('#aiForm'), input = TE.$('#aiInput'), send = TE.$('#aiSend'), status = TE.$('#aiStatus');
  let busy = false, greeted = false;

  const scroll = () => { body.scrollTop = body.scrollHeight; };

  function setOpen(open) {
    panel.hidden = !open;
    root.classList.toggle('is-open', open);
    fab.setAttribute('aria-expanded', String(open));
    if (open && !greeted) {
      greeted = true;
      const d = ctx.dest;
      bot({ title: 'Hi, I\'m Coastal AI', text: d
        ? `Planning a trip to ${d.name}? Ask me what to eat, where to shop, when to go or how to get there.`
        : 'I know our partner destinations inside out. Ask me about local food, souvenirs, the best season, how to get there, or Indonesian phrases.',
        chips: d ? destChips(d) : ['Recommend a hidden gem', 'Local food in Kei Islands', 'Where to shop in Alor', 'Best snorkelling in October'] });
    }
    if (open && matchMedia('(hover: hover)').matches) setTimeout(() => input.focus(), 50);
  }

  function setChips(list) {
    chips.innerHTML = (list || []).map((c) => `<button type="button">${TE.esc(c)}</button>`).join('');
  }

  function user(text) {
    const m = document.createElement('div');
    m.className = 'ai-msg ai-msg--user';
    m.textContent = text;
    body.appendChild(m);
  }

  function bot(a) {
    const m = document.createElement('div');
    m.className = 'ai-msg ai-msg--bot';
    let h = '';
    if (a.title) h += `<p class="ai-msg__title">${TE.esc(a.title)}</p>`;
    if (a.phrase) h += `<p class="ai-msg__phrase">${TE.esc(a.phrase)}</p>`;
    if (a.pronunciation) h += `<p class="ai-msg__say">Say: ${TE.esc(a.pronunciation)}</p>`;
    if (a.meaning) h += `<p>${TE.esc(a.meaning)}</p>`;
    if (a.text) h += `<p>${TE.esc(a.text)}</p>`;
    if (a.list && a.list.length) h += `<ul class="ai-msg__list">${a.list.map((i) => `<li><b>${TE.esc(i.name)}</b>${i.desc ? ' — ' + TE.esc(i.desc) : ''}</li>`).join('')}</ul>`;
    if (a.steps) h += `<ol class="ai-msg__steps">${a.steps.map((s) => `<li>${TE.esc(s)}</li>`).join('')}</ol>`;
    if (a.months) h += `<div class="ai-months">${TE.MONTHS.map((mo, i) => `<span class="${a.months.includes(i + 1) ? 'on' : ''}">${mo}</span>`).join('')}</div>`;
    if (a.tip) h += `<p class="ai-msg__tip">${TE.icon('info', 14)} ${TE.esc(a.tip)}</p>`;
    if (a.cards && a.cards.length) {
      h += '<div class="ai-cards">' + a.cards.map((id) => {
        const d = TE.getDestination(id);
        return d ? `<a class="ai-card" href="trip.html?id=${d.id}"><span class="ai-card__img media">${TE.destImg(d)}</span><span><b>${TE.esc(d.name)}</b><small>${TE.esc(d.province)} · from ${TE.price(d.price)}</small></span></a>` : '';
      }).join('') + '</div>';
    }
    m.innerHTML = h;
    body.appendChild(m);
    setChips(a.chips);
  }

  async function ask(q) {
    q = (q || '').trim();
    if (!q || busy) return;
    busy = true;
    user(q);
    input.value = ''; send.disabled = true; input.disabled = true;
    setChips([]);
    status.textContent = 'Typing…';
    const typing = document.createElement('div');
    typing.className = 'ai-msg ai-msg--bot ai-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing); scroll();
    try {
      const [ans] = await Promise.all([
        AI_CONFIG.provider === 'local' ? Promise.resolve(localAnswer(q)) : remoteAnswer(q),
        TE.sleep(1200 + Math.random() * 600)
      ]);
      typing.remove(); bot(ans);
    } catch (e) {
      console.error(e);
      typing.remove();
      bot({ title: 'Connection problem', text: 'I couldn\'t reach the AI service. Here is what I know from our database:' });
      bot(localAnswer(q));
    } finally {
      busy = false; input.disabled = false;
      status.textContent = 'Food, shopping, travel tips & phrases';
      scroll();
      if (matchMedia('(hover: hover)').matches) input.focus();
    }
  }

  fab.addEventListener('click', () => setOpen(panel.hidden));
  TE.$('#aiClose').addEventListener('click', () => setOpen(false));
  input.addEventListener('input', () => { send.disabled = busy || !input.value.trim(); });
  form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
  chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });

  /* Public API used by pages */
  TE.assistant = {
    open(question) { setOpen(true); if (question) setTimeout(() => ask(question), 150); },
    setContext(id) { ctx.dest = TE.getDestination(id) || null; },
    answer: localAnswer,
    config: AI_CONFIG
  };
})();
