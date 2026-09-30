/* ==========================================================================
   TripEase Coastal — Cultural & phrase assistant
   --------------------------------------------------------------------------
   provider: 'mock'   Offline keyword engine. No key needed. Default for demos.
             'proxy'  Recommended for a live site. Your own backend holds the
                      API key and forwards the question to OpenAI / Gemini.
             'openai' Direct browser call. Demo only: anyone can read the key.
             'gemini' Direct browser call. Demo only: anyone can read the key.
   Never commit a real API key to a public GitHub repository.
   ========================================================================== */

(function () {
  const AI_CONFIG = {
    provider: 'mock',
    apiKey: '',
    openaiModel: 'gpt-4o-mini',      // check current model names in the provider docs
    geminiModel: 'gemini-2.0-flash',
    proxyUrl: '/api/cultural-assistant'
  };

  const SYSTEM_PROMPT = `You are the TripEase Coastal cultural assistant for international tourists visiting community-based coastal villages in Indonesia.
Answer with one useful Indonesian phrase and a short, respectful cultural tip.
Reply ONLY with JSON: {"title": string, "phrase": string, "pronunciation": string, "meaning": string, "tip": string}.
Keep the tip under 60 words. Mention the verified local guide (Pokdarwis/BUMDes) when relevant.`;

  /* Each keyword hit scores 1 point. The highest-scoring intent wins. */
  const INTENTS = [
    { keys: ['greet', 'hello', 'hi ', 'halo', 'good morning', 'elder', 'welcome', 'respect'],
      title: 'Greeting someone respectfully',
      phrase: 'Selamat pagi, Pak / Bu', pronunciation: 'suh-LAH-mat PAH-gee, pahk / boo',
      meaning: 'Good morning, sir / ma\'am. Use siang, sore or malam for midday, afternoon or evening.',
      tip: 'Offer your right hand for a gentle handshake, then lightly touch your hand to your chest. With village elders, a slight bow and a smile go a long way. Your guide will help with pronunciation on day one.' },
    { keys: ['how are you', 'my name', 'introduce', 'name', 'meet'],
      title: 'Introducing yourself',
      phrase: 'Apa kabar? Nama saya …', pronunciation: 'AH-pah KAH-bar? NAH-mah SAH-yah …',
      meaning: 'How are you? My name is … (reply to "Apa kabar?" with "Baik", meaning fine)',
      tip: 'People will often ask where you are from ("Dari mana?"). It is friendly curiosity, and answering with your country is perfect.' },
    { keys: ['thank', 'thanks', 'grateful', 'appreciate'],
      title: 'Saying thank you',
      phrase: 'Terima kasih banyak', pronunciation: 'tuh-REE-mah KAH-see BAH-nyahk',
      meaning: 'Thank you very much. The reply is "Sama-sama", you\'re welcome.',
      tip: 'Thank your homestay host after meals. Tipping is not expected, but buying handicrafts directly supports local families.' },
    { keys: ['price', 'cost', 'buy', 'how much', 'bargain', 'pay', 'money', 'souvenir', 'cheap'],
      title: 'Asking the price',
      phrase: 'Berapa harganya?', pronunciation: 'buh-RAH-pah har-GAH-nyah',
      meaning: 'How much is it?',
      tip: 'Handicrafts sold through partner BUMDes have fixed, fair prices so artisans receive direct income, so please don\'t bargain on these. Light, polite bargaining is fine at general markets.' },
    { keys: ['food', 'eat', 'spicy', 'restaurant', 'halal', 'vegetarian', 'allerg', 'meal', 'delicious', 'hungry'],
      title: 'Food and dietary needs',
      phrase: 'Tidak pedas, ya. Saya alergi …', pronunciation: 'TEE-dahk puh-DAHS, yah. SAH-yah ah-LEHR-gee …',
      meaning: 'Not spicy, please. I\'m allergic to … ("Enak sekali!" means delicious!)',
      tip: 'Most coastal villages are Muslim communities, so meals are halal. Eat and pass food with your right hand. Tell your guide about seafood or peanut allergies before the trip.' },
    { keys: ['dress', 'wear', 'clothes', 'mosque', 'temple', 'pray', 'religion', 'shoes', 'house', 'enter'],
      title: 'Dress code and visiting homes',
      phrase: 'Boleh saya masuk?', pronunciation: 'BOH-leh SAH-yah MAH-sook',
      meaning: 'May I come in?',
      tip: 'In the village, cover shoulders and knees. Swimwear is for the beach and boat. Take off your shoes before entering a home or mosque, and don\'t walk in front of people who are praying.' },
    { keys: ['photo', 'picture', 'camera', 'selfie', 'video', 'drone', 'film'],
      title: 'Taking photos',
      phrase: 'Boleh saya foto?', pronunciation: 'BOH-leh SAH-yah FOH-toh',
      meaning: 'May I take a photo?',
      tip: 'Always ask first, especially with women, children and elders. Drones need permission from the village head, which your guide can arrange.' },
    { keys: ['snorkel', 'dive', 'coral', 'reef', 'swim', 'sea', 'fish', 'turtle', 'sunscreen', 'boat'],
      title: 'Reef-friendly behaviour',
      phrase: 'Jangan injak karang', pronunciation: 'JAHNG-ahn IN-jahk KAH-rahng',
      meaning: 'Don\'t step on the coral.',
      tip: 'Use reef-safe sunscreen, never touch or feed marine life and stay inside your guide\'s buoy lines. Part of your booking goes directly to reef restoration at this site.' },
    { keys: ['where', 'direction', 'toilet', 'bathroom', 'restroom', 'lost', 'way', 'find'],
      title: 'Asking for directions',
      phrase: 'Di mana toilet?', pronunciation: 'dee MAH-nah TOY-let',
      meaning: 'Where is the toilet? Swap "toilet" for pantai (beach) or masjid (mosque).',
      tip: 'When pointing, use your right thumb rather than your index finger. It is considered more polite in Indonesia.' },
    { keys: ['help', 'emergency', 'sick', 'doctor', 'hospital', 'hurt', 'police', 'danger', 'injur'],
      title: 'Getting help',
      phrase: 'Tolong! Saya sakit.', pronunciation: 'TOH-long! SAH-yah SAH-kit',
      meaning: 'Help! I\'m sick.',
      tip: 'Every TripEase guide completes basic safety training. Indonesia\'s national emergency number is 112. Save your guide\'s WhatsApp number before heading out to sea.' },
    { keys: ['sorry', 'excuse', 'apolog', 'pass', 'rude', 'mistake'],
      title: 'Excuse me and sorry',
      phrase: 'Permisi … Maaf', pronunciation: 'per-MEE-see … MAH-ahf',
      meaning: 'Excuse me … Sorry.',
      tip: 'Say "Permisi" with a slight bow and your right arm lowered when walking past people who are seated. It is one of the most appreciated small gestures in any village.' },
    { keys: ['plastic', 'trash', 'waste', 'bottle', 'recycl', 'garbage', 'eco', 'environment'],
      title: 'Travelling plastic-free',
      phrase: 'Tidak pakai plastik, terima kasih', pronunciation: 'TEE-dahk PAH-kai PLAHS-tik',
      meaning: 'No plastic, thank you.',
      tip: 'Bring a refillable bottle and ask your homestay for drinking-water refills. Take your own waste back from small islands, where waste handling is limited.' }
  ];

  const FALLBACK = {
    title: 'Your local guide can help',
    phrase: 'Bisa bantu saya?', pronunciation: 'BEE-sah BAHN-too SAH-yah',
    meaning: 'Can you help me?',
    tip: 'Try asking about greetings, food, prices, photos, dress code, the reef or directions. For anything else, your verified Pokdarwis or BUMDes guide will be with you throughout the trip.'
  };

  function mockAnswer(question) {
    const q = ' ' + question.toLowerCase().replace(/[^a-z\s']/g, ' ').replace(/\s+/g, ' ') + ' ';
    let best = null;
    let bestScore = 0;
    INTENTS.forEach(function (intent) {
      const score = intent.keys.reduce(function (s, k) { return s + (q.includes(k) ? 1 : 0); }, 0);
      if (score > bestScore) { best = intent; bestScore = score; }
    });
    const pick = best || FALLBACK;
    return {
      title: pick.title, phrase: pick.phrase, pronunciation: pick.pronunciation,
      meaning: pick.meaning, tip: pick.tip
    };
  }

  function parseJson(text) {
    try { return JSON.parse(text.replace(/```json|```/g, '').trim()); }
    catch (e) { return { title: 'Cultural guidance', tip: text }; }
  }

  async function callOpenAI(question) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + AI_CONFIG.apiKey },
      body: JSON.stringify({
        model: AI_CONFIG.openaiModel,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: question }]
      })
    });
    if (!res.ok) throw new Error('OpenAI request failed: ' + res.status);
    const data = await res.json();
    return parseJson(data.choices[0].message.content);
  }

  async function callGemini(question) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
      AI_CONFIG.geminiModel + ':generateContent?key=' + AI_CONFIG.apiKey;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: question }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });
    if (!res.ok) throw new Error('Gemini request failed: ' + res.status);
    const data = await res.json();
    return parseJson(data.candidates[0].content.parts[0].text);
  }

  async function callProxy(question) {
    // Your backend receives { question, systemPrompt } and returns
    // { title, phrase, pronunciation, meaning, tip }.
    const res = await fetch(AI_CONFIG.proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question, systemPrompt: SYSTEM_PROMPT })
    });
    if (!res.ok) throw new Error('Proxy request failed: ' + res.status);
    return res.json();
  }

  function ask(question) {
    switch (AI_CONFIG.provider) {
      case 'openai': return callOpenAI(question);
      case 'gemini': return callGemini(question);
      case 'proxy':  return callProxy(question);
      default:       return Promise.resolve(mockAnswer(question));
    }
  }

  window.TripEaseAssistant = { ask: ask, config: AI_CONFIG };
})();
