/* ==========================================================================
   TripEase Coastal — destination database
   --------------------------------------------------------------------------
   Every trip, card, map pin and AI answer is generated from this file.
   To add a destination, copy one object and change the values.

   PHOTOS: put your own photo at  assets/img/destinations/<id>.jpg
   (e.g. assets/img/destinations/kei.jpg). If that file is missing, the
   illustrative Unsplash photo in `photo` is used instead.

   Prices are prototype figures in IDR per person (open trip).
   ========================================================================== */

window.TE = window.TE || {};

TE.REVENUE_SPLIT = { local: 0.70, conservation: 0.20, platform: 0.10 };

TE.ACTIVITIES = {
  snorkeling: { label: 'Snorkelling',      icon: 'mask' },
  diving:     { label: 'Diving',           icon: 'tank' },
  surfing:    { label: 'Surfing',          icon: 'wave' },
  turtles:    { label: 'Turtle watching',  icon: 'turtle' },
  mangrove:   { label: 'Mangrove trails',  icon: 'leaf' },
  culture:    { label: 'Village culture',  icon: 'home' },
  beach:      { label: 'Quiet beaches',    icon: 'sun' },
  island:     { label: 'Island hopping',   icon: 'boat' }
};

TE.REGIONS = ['Sumatra', 'Java', 'Nusa Tenggara', 'Sulawesi', 'Maluku'];

TE.DESTINATIONS = [
  {
    id: 'kei',
    name: 'Kei Islands',
    area: 'Southeast Maluku',
    province: 'Maluku',
    region: 'Maluku',
    coords: [-5.63, 132.63],
    title: 'Kei Islands: powder-white sand & village island hopping',
    tagline: 'Some of the softest white sand in Indonesia, and almost nobody on it.',
    why: 'Far from the usual tourist routes, Kei is known for Ngurbloat (Pasir Panjang), a long beach of extremely fine white sand. Villages still follow customary law (Larvul Ngabal) and traditional sasi rules that close fishing grounds so stocks can recover.',
    highlights: ['Ngurbloat (Pasir Panjang) beach', 'Meti Kei — extreme low tide when sandbars connect islands', 'Snorkelling around Kei Kecil', 'Village visit with customary leaders'],
    activities: ['beach', 'snorkeling', 'island', 'culture'],
    bestTime: 'September to December, when the sea is calmer. Meti Kei low tides are usually around October.',
    bestMonths: [9, 10, 11, 12],
    gettingThere: [
      'Fly to Karel Sadsuitubun Airport (LUV) in Langgur, usually via Ambon.',
      'Ngurbloat is about 30 minutes by car from Langgur.',
      'Local boats from the village jetty for island hopping.'
    ],
    food: [
      { name: 'Enbal', desc: 'The Kei staple made from pressed, detoxified cassava — eaten as flatbread, crackers or sweet cakes.' },
      { name: 'Grilled reef fish & colo-colo', desc: 'Fresh catch grilled over coconut husk, served with a sharp lime-and-chilli sambal.' },
      { name: 'Seafood at Ngurbloat stalls', desc: 'Beachside stalls run by local families sell grilled fish, squid and enbal snacks.' }
    ],
    shopping: [
      { name: 'Enbal chips & crackers', desc: 'The easiest Kei souvenir to carry home. Sold in Langgur and Tual markets.' },
      { name: 'Pasar Langgur & Pasar Tual', desc: 'Traditional markets for dried fish, spices and local snacks.' }
    ],
    etiquette: 'Respect sasi signs (palm-leaf markers) — they mean an area is closed to fishing or harvesting.',
    partner: 'Pokdarwis',
    rating: 4.9, reviews: 64,
    duration: '4 days, 3 nights', days: 4,
    price: 2450000, privateSurcharge: 1500000, quota: 12,
    conservationUse: 'village sasi reef monitoring',
    itinerary: [
      'Arrive in Langgur, homestay check-in, sunset at Ngurbloat',
      'Island hopping around Kei Kecil and snorkelling',
      'Village visit, enbal cooking session with local women',
      'Morning beach walk, transfer to the airport'
    ],
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'togean',
    name: 'Togean Islands',
    area: 'Tojo Una-Una',
    province: 'Central Sulawesi',
    region: 'Sulawesi',
    coords: [-0.38, 121.95],
    title: 'Togean Islands: jellyfish lake, Bajo villages & reef walls',
    tagline: 'A national-park archipelago in the Gulf of Tomini with some of Indonesia\'s largest reef areas.',
    why: 'The Togean Islands National Park (est. 2004) covers a huge area of coral reef in the Gulf of Tomini. Getting here takes effort, so the islands stay quiet — perfect for slow travel with Bajau (sea nomad) communities.',
    highlights: ['Swim in a lake of stingless jellyfish', 'Bajau stilt village visit', 'Reef walls around Kadidiri', 'WWII bomber wreck dive'],
    activities: ['snorkeling', 'diving', 'island', 'culture'],
    bestTime: 'Roughly March to May and September to November, between the windier months.',
    bestMonths: [3, 4, 5, 9, 10, 11],
    gettingThere: [
      'Fly to Palu, Luwuk or Gorontalo, then travel overland to Ampana.',
      'Ferry from Ampana (or Gorontalo) to Wakai runs a few times a week; speedboats from Ampana are faster.',
      'Local boats connect Wakai with Kadidiri and other islands.'
    ],
    food: [
      { name: 'Bajau-style fresh seafood', desc: 'Fish and squid caught that morning, grilled or cooked in a sour broth by Bajau families.' },
      { name: 'Grilled fish with dabu-dabu', desc: 'The Sulawesi fresh tomato-chilli-lime relish that goes with almost every meal.' },
      { name: 'Homestay coconut dishes', desc: 'Coconut milk curries and fried bananas served in family-run homestays.' }
    ],
    shopping: [
      { name: 'Ampana market', desc: 'Stock up on snacks, dried fish and supplies before crossing — shops on the islands are very limited.' },
      { name: 'Handmade crafts in Bajau villages', desc: 'Woven items and small wooden boat models made by local families.' }
    ],
    etiquette: 'Ask before photographing people in Bajau villages, and never apply sunscreen right before entering the jellyfish lake.',
    partner: 'Pokdarwis',
    rating: 4.8, reviews: 51,
    duration: '5 days, 4 nights', days: 5,
    price: 3200000, privateSurcharge: 1800000, quota: 10,
    conservationUse: 'reef patrols and mooring buoys',
    itinerary: [
      'Arrive in Ampana, boat to Wakai, transfer to island homestay',
      'Jellyfish lake and snorkelling on the reef',
      'Bajau village visit and fishing with local families',
      'Free day: diving or kayaking',
      'Boat back to Ampana'
    ],
    photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'anambas',
    name: 'Anambas Islands',
    area: 'Anambas Islands Regency',
    province: 'Riau Islands',
    region: 'Sumatra',
    coords: [3.22, 106.22],
    title: 'Anambas: turquoise lagoons in the Natuna Sea',
    tagline: '255 islands between Borneo and the Malay Peninsula, still off most travellers\' maps.',
    why: 'Anambas has been praised internationally for its coastline, yet it receives a fraction of the visitors Bali or Lombok do. Clear water, granite islands and small fishing towns make it ideal for low-impact island hopping.',
    highlights: ['Padang Melang beach on Jemaja', 'Temburun waterfall on Siantan', 'Island hopping around Tarempa', 'Turtle conservation island visits'],
    activities: ['island', 'snorkeling', 'turtles', 'beach'],
    bestTime: 'March to October. Avoid November to February, when the north monsoon brings big waves.',
    bestMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    gettingThere: [
      'Fly from Batam or Tanjungpinang to Letung (Jemaja) or Matak.',
      'Passenger ships also run from Tanjungpinang to Tarempa (long overnight journey).',
      'Local boats between islands from Tarempa harbour.'
    ],
    food: [
      { name: 'Mie Tarempa', desc: 'Anambas\' signature flat noodles cooked with tuna and chilli — a must-try breakfast in Tarempa.' },
      { name: 'Luti gendang', desc: 'Crispy-outside, soft-inside bread rolls filled with spiced tuna. Named for their drum shape.' },
      { name: 'Grilled tuna & reef fish', desc: 'Fresh from the Natuna Sea, served at harbour-side eateries.' }
    ],
    shopping: [
      { name: 'Luti gendang to take home', desc: 'Sold in Tarempa coffee shops and bakeries; keeps a few days if refrigerated.' },
      { name: 'Tarempa harbour shops', desc: 'Dried and salted fish, fish crackers and local snacks.' }
    ],
    etiquette: 'Tarempa is a small, mostly Malay Muslim town — dress modestly away from the beach.',
    partner: 'BUMDes',
    rating: 4.8, reviews: 42,
    duration: '4 days, 3 nights', days: 4,
    price: 2750000, privateSurcharge: 1600000, quota: 12,
    conservationUse: 'turtle nest protection',
    itinerary: [
      'Arrive in Tarempa, mie tarempa lunch, harbour walk',
      'Island hopping and snorkelling',
      'Temburun waterfall and village visit',
      'Morning luti gendang shopping, depart'
    ],
    photo: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'alor',
    name: 'Alor',
    area: 'Alor Regency',
    province: 'East Nusa Tenggara',
    region: 'Nusa Tenggara',
    coords: [-8.22, 124.52],
    title: 'Alor: world-class reefs & traditional villages',
    tagline: 'Healthy, diverse corals and more than fifteen local languages on one island.',
    why: 'Alor has some of the healthiest and most diverse coral reefs in Indonesia, yet it takes a connecting flight through Kupang to get here, so dive sites are rarely crowded. Traditional villages keep moko bronze drums and ikat weaving alive.',
    highlights: ['Diving the Alor and Pantar straits', 'Kepa and Pura islands', 'Takpala traditional village', 'Ikat weaving demonstrations'],
    activities: ['diving', 'snorkeling', 'culture', 'island'],
    bestTime: 'April to November for the best diving visibility and calmer seas.',
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    gettingThere: [
      'Fly to Kupang, then connect to Alor Mali Airport (ARD).',
      'Kalabahi town is about 20 minutes from the airport.',
      'Short boat ride to Kepa island dive homestays.'
    ],
    food: [
      { name: 'Kenari (canarium nut) snacks', desc: 'Alor is known for canarium nuts, eaten roasted or made into sweets.' },
      { name: 'Ikan kuah asam', desc: 'Clear, sour fish soup with tamarind or starfruit — light and perfect after a dive.' },
      { name: 'Corn-and-rice village meals', desc: 'Simple dishes built around locally grown corn, vegetables and fresh fish.' }
    ],
    shopping: [
      { name: 'Kenari nuts', desc: 'The classic Alor souvenir, sold roasted or as brittle in Kalabahi.' },
      { name: 'Alor ikat textiles', desc: 'Hand-woven ikat bought directly from weavers in traditional villages.' },
      { name: 'Kalabahi market', desc: 'Local produce, spices, vanilla and tamarind.' }
    ],
    etiquette: 'In traditional villages, wait to be invited in and follow your guide\'s lead during ceremonies.',
    partner: 'Pokdarwis',
    rating: 4.9, reviews: 38,
    duration: '4 days, 3 nights', days: 4,
    price: 2900000, privateSurcharge: 1700000, quota: 10,
    conservationUse: 'coral reef monitoring',
    itinerary: [
      'Arrive in Kalabahi, boat to Kepa homestay',
      'Two reef dives or snorkel sessions',
      'Takpala village and ikat weaving',
      'Kenari shopping in Kalabahi, depart'
    ],
    photo: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'banyak',
    name: 'Banyak Islands',
    area: 'Aceh Singkil',
    province: 'Aceh',
    region: 'Sumatra',
    coords: [2.25, 97.40],
    title: 'Banyak Islands: turtle beaches & empty surf breaks',
    tagline: 'Around 70 islands in the Indian Ocean with protected turtle nesting beaches.',
    why: 'Banyak ("many") has about 71 surveyed islands and only a few thousand residents. Bangkaru island is a protected turtle rookery where green and leatherback turtles nest, and the surf breaks see a tiny fraction of the crowds found in Bali.',
    highlights: ['Turtle nesting beaches on Bangkaru', 'Uncrowded surf breaks', 'Camping on uninhabited islands', 'Fishing village life in Haloban'],
    activities: ['turtles', 'surfing', 'island', 'beach'],
    bestTime: 'Roughly April to October for surf; turtle nesting happens through much of the year.',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    gettingThere: [
      'Fly to Medan, then travel overland (or a small flight) to Singkil.',
      'Boat from Singkil port to Pulau Balai or Haloban.',
      'Local boats between islands.'
    ],
    food: [
      { name: 'Gulai ikan', desc: 'Rich Acehnese-style fish curry with turmeric and coconut milk.' },
      { name: 'Fresh lobster & reef fish', desc: 'Island fishermen sell their catch directly to homestays.' },
      { name: 'Kopi Aceh', desc: 'Strong Acehnese coffee, served in every village coffee stall.' }
    ],
    shopping: [
      { name: 'Singkil market', desc: 'Last stop for supplies, snacks and local coffee before the crossing.' },
      { name: 'Acehnese coffee', desc: 'Ground coffee from Aceh\'s highlands, a light and popular gift.' }
    ],
    etiquette: 'Aceh follows Islamic law: dress modestly in villages and keep swimwear to tourist beaches.',
    partner: 'BUMDes',
    rating: 4.7, reviews: 29,
    duration: '4 days, 3 nights', days: 4,
    price: 2350000, privateSurcharge: 1400000, quota: 8,
    conservationUse: 'turtle nest patrols on Bangkaru',
    itinerary: [
      'Arrive in Singkil, boat to Pulau Balai',
      'Island hopping and snorkelling',
      'Evening turtle patrol with rangers (seasonal)',
      'Surf or relax, boat back to Singkil'
    ],
    photo: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'widi',
    name: 'Widi Islands',
    area: 'South Halmahera',
    province: 'North Maluku',
    region: 'Maluku',
    coords: [-0.58, 128.63],
    title: 'Widi Islands: a remote atoll of uninhabited islands',
    tagline: 'Around 90 small islands ringed by one of the region\'s largest atoll reefs.',
    why: 'The Widi archipelago is a cluster of tiny islands in a shallow atoll off South Halmahera. Almost entirely uninhabited, it is one of the last untouched reef systems in the Coral Triangle — ideal for small-group, low-impact trips with fishing communities from nearby villages.',
    highlights: ['Snorkelling on the atoll reef', 'Sandbar picnics', 'Uninhabited islands', 'Spice-island history on the way'],
    activities: ['snorkeling', 'diving', 'island', 'beach'],
    bestTime: 'Roughly October to April, outside the stronger southeast winds.',
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    gettingThere: [
      'Fly to Ternate (TTE).',
      'Continue by speedboat or ship to South Halmahera.',
      'Local boat from the coastal villages to the Widi atoll.'
    ],
    food: [
      { name: 'Gohu ikan', desc: 'North Maluku\'s fresh tuna "ceviche" with lime, chilli, basil and roasted peanuts.' },
      { name: 'Papeda with kuah kuning', desc: 'Sago porridge eaten with yellow turmeric fish soup.' },
      { name: 'Island picnic grill', desc: 'Fish caught on the way, grilled on the beach by your boat crew.' }
    ],
    shopping: [
      { name: 'Nutmeg & cloves', desc: 'The spices that made the Moluccas famous — buy them whole in Ternate markets.' },
      { name: 'Ternate traditional market', desc: 'Spices, kenari nuts and sago cakes before heading out.' }
    ],
    etiquette: 'Take all waste back with you — the islands have no waste handling at all.',
    partner: 'Pokdarwis',
    rating: 4.8, reviews: 19,
    duration: '5 days, 4 nights', days: 5,
    price: 3600000, privateSurcharge: 2200000, quota: 8,
    conservationUse: 'atoll reef protection and clean-ups',
    itinerary: [
      'Arrive in Ternate, spice market visit',
      'Boat to South Halmahera village homestay',
      'Full day on the Widi atoll: snorkelling and sandbars',
      'Village fishing morning and cooking',
      'Return to Ternate'
    ],
    photo: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'moyo',
    name: 'Moyo Island',
    area: 'Sumbawa',
    province: 'West Nusa Tenggara',
    region: 'Nusa Tenggara',
    coords: [-8.25, 117.55],
    title: 'Moyo Island: jungle waterfalls & quiet reefs off Sumbawa',
    tagline: 'A protected island of forest, turquoise pools and reef, just off Sumbawa.',
    why: 'Moyo is a protected nature reserve with forest, waterfalls and fringing reefs. Most visitors to Nusa Tenggara stop at Lombok or Komodo, so Moyo\'s villages see few travellers and welcome homestay guests.',
    highlights: ['Mata Jitu waterfall pools', 'Snorkelling off the island\'s reefs', 'Forest trekking', 'Village homestays'],
    activities: ['snorkeling', 'beach', 'culture', 'island'],
    bestTime: 'May to October (dry season). Waterfalls are fullest just after the rains, around April–May.',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    gettingThere: [
      'Fly to Sumbawa Besar (SWQ), or take the ferry from Lombok to Sumbawa.',
      'Drive to the harbour near Sumbawa Besar.',
      'Boat crossing to Moyo takes about 1–1.5 hours.'
    ],
    food: [
      { name: 'Sepat', desc: 'Sumbawa\'s grilled fish in a sour, spicy broth with young mango.' },
      { name: 'Singang', desc: 'Tangy yellow fish soup flavoured with turmeric and tamarind.' },
      { name: 'Fresh island fruit', desc: 'Mangoes, bananas and coconuts from village gardens.' }
    ],
    shopping: [
      { name: 'Madu Sumbawa', desc: 'Wild forest honey from Sumbawa, one of the island\'s best-known products.' },
      { name: 'Sumbawa woven cloth', desc: 'Traditional woven fabrics sold by local weavers in Sumbawa Besar.' },
      { name: 'Sumbawa Besar market', desc: 'Honey, spices and snacks to take home.' }
    ],
    etiquette: 'Moyo is a nature reserve: stay on trails and never take coral, shells or plants.',
    partner: 'BUMDes',
    rating: 4.7, reviews: 33,
    duration: '3 days, 2 nights', days: 3,
    price: 1850000, privateSurcharge: 1100000, quota: 12,
    conservationUse: 'reserve ranger support',
    itinerary: [
      'Boat to Moyo, homestay check-in, snorkelling',
      'Trek to Mata Jitu waterfall, village dinner',
      'Morning reef swim, boat back, honey shopping'
    ],
    photo: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'gelasa',
    name: 'Gelasa Island',
    area: 'Central Bangka',
    province: 'Bangka Belitung',
    region: 'Sumatra',
    coords: [-2.42, 107.07],
    title: 'Gelasa Island: coral restoration & fishing-village life',
    tagline: 'A small granite island with clear water, reachable from Bangka\'s east coast.',
    why: 'While neighbouring Belitung is getting busier, Gelasa stays quiet. Its reefs and granite boulders make for great snorkelling, and nearby fishing villages can host visitors in family homestays.',
    highlights: ['Coral transplant session with local divers', 'Granite boulder beaches', 'Fishing village homestay', 'Sunrise boat trip'],
    activities: ['snorkeling', 'diving', 'culture', 'beach'],
    bestTime: 'March to October, when seas off Bangka are calmer.',
    bestMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    gettingThere: [
      'Fly to Pangkalpinang (PGK), Bangka.',
      'Drive to the east-coast fishing villages of Central Bangka (about 1.5–2 hours).',
      'Boat crossing to Gelasa.'
    ],
    food: [
      { name: 'Lempah kuning', desc: 'Bangka\'s famous yellow fish soup with turmeric, pineapple and shrimp paste.' },
      { name: 'Mie Koba', desc: 'Noodles in a fish broth — Koba is the town closest to the island.' },
      { name: 'Otak-otak & martabak Bangka', desc: 'Grilled fish cakes and thick sweet pancakes, both Bangka classics.' }
    ],
    shopping: [
      { name: 'Kemplang & fish crackers', desc: 'Crispy fish crackers, the top souvenir from Bangka.' },
      { name: 'Terasi Bangka', desc: 'Shrimp paste famous across Indonesia for its quality.' },
      { name: 'Souvenir shops in Pangkalpinang', desc: 'Crackers, getas, kretek and pepper — Bangka is a major white-pepper producer.' }
    ],
    etiquette: 'Fishing boats leave early — join them only if invited, and wear a life jacket.',
    partner: 'Pokdarwis',
    rating: 4.9, reviews: 120,
    duration: '3 days, 2 nights', days: 3,
    price: 1250000, privateSurcharge: 750000, quota: 12,
    conservationUse: 'coral restoration',
    itinerary: [
      'Arrive in Pangkalpinang, drive to the fishing village',
      'Boat to Gelasa, coral transplant and snorkelling',
      'Mie Koba breakfast, souvenir stop, depart'
    ],
    photo: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'baros',
    name: 'Baros Mangrove',
    area: 'Bantul, Yogyakarta',
    province: 'DI Yogyakarta',
    region: 'Java',
    coords: [-8.0, 110.28],
    title: 'Baros: youth-run mangrove forest on Yogyakarta\'s coast',
    tagline: 'A community-planted mangrove at the mouth of the Opak river.',
    why: 'Just an hour from the city but ignored by most visitors heading to Parangtritis, Baros is a mangrove forest planted and looked after by local youth to protect the coast from abrasion. It is the easiest way to see community-led coastal conservation on Java.',
    highlights: ['Plant your own mangrove seedling', 'River mouth birdwatching', 'Coastal village cooking class', 'Kasongan pottery village nearby'],
    activities: ['mangrove', 'culture', 'beach'],
    bestTime: 'April to October (dry season). Go early morning for birds.',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    gettingThere: [
      'Fly or take the train to Yogyakarta.',
      'Drive south to Kretek, Bantul (about 1 hour).',
      'Walk the mangrove trail from the village.'
    ],
    food: [
      { name: 'Mangut lele', desc: 'Smoked catfish in a spicy coconut-milk sauce, a Bantul favourite.' },
      { name: 'Gudeg', desc: 'Yogyakarta\'s sweet young-jackfruit stew, best eaten for breakfast.' },
      { name: 'Seafood at Depok beach', desc: 'Pick fresh fish at the auction and have it cooked on the spot, 15 minutes away.' }
    ],
    shopping: [
      { name: 'Kasongan pottery village', desc: 'Handmade ceramics straight from the workshops, 20 minutes from Baros.' },
      { name: 'Bakpia', desc: 'Yogyakarta\'s famous bean-filled pastries.' },
      { name: 'Pasar Beringharjo', desc: 'The historic market for batik, spices and snacks in the city centre.' }
    ],
    etiquette: 'Stay on the boardwalk and follow the planting guide\'s instructions — young mangroves are fragile.',
    partner: 'BUMDes',
    rating: 4.8, reviews: 98,
    duration: '2 days, 1 night', days: 2,
    price: 850000, privateSurcharge: 500000, quota: 15,
    conservationUse: 'mangrove planting',
    itinerary: [
      'Mangrove walk, seedling planting, cooking class',
      'Sunrise birdwatching, Kasongan pottery, return to the city'
    ],
    photo: 'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&q=80&w=1200'
  }
];

TE.getDestination = (id) => TE.DESTINATIONS.find((d) => d.id === id);
