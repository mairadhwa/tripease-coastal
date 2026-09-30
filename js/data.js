/* ==========================================================================
   TripEase Coastal — content & configuration
   Edit this file to change trips, prices and revenue split.
   The catalog and the booking checkout update automatically.
   ========================================================================== */

/* Revenue split applied to every booking.
   The platform takes a 10% commission (see essay, section D). */
window.REVENUE_SPLIT = {
  local: 0.70,         // homestays, boat operators, cooks, guides
  conservation: 0.20,  // destination conservation fund, managed with the village
  platform: 0.10       // marketing, booking & payment system
};

/* Indicative rate, only used for the "≈ US$" hint. Update before presenting. */
window.IDR_PER_USD = 16500;

/* Theme filters shown above the catalog */
window.THEMES = [
  { id: 'all',      label: 'All trips' },
  { id: 'reef',     label: 'Reef & snorkelling' },
  { id: 'mangrove', label: 'Mangrove' },
  { id: 'village',  label: 'Village life' }
];

window.PACKAGES = [
  {
    id: 'gelasa',
    themes: ['reef', 'village'],
    location: 'Gelasa Island',
    region: 'Bangka Belitung',
    partner: 'Pokdarwis',
    rating: 4.9,
    reviews: 120,
    title: 'Coral reef restoration & fishermen experience',
    description: 'Spend three days in a traditional fishing village, join a coral transplant session with local divers and stay in a verified family homestay.',
    duration: '3 days, 2 nights',
    price: 1250000,            // per person, open trip
    privateSurcharge: 750000,  // flat add-on for a private trip (own boat + guide)
    quotaLeft: 12,             // daily visitor quota (carrying-capacity control)
    conservationUse: 'coral restoration',
    includes: ['Homestay', 'Snorkel gear', 'English-speaking guide', 'All meals'],
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=900'
  },
  {
    id: 'yogyakarta',
    themes: ['mangrove', 'village'],
    location: 'Coastal Yogyakarta',
    region: 'DI Yogyakarta',
    partner: 'BUMDes',
    rating: 4.8,
    reviews: 98,
    title: 'Mangrove eco-trail & coastal cooking class',
    description: 'Walk the mangrove conservation trail with a trained local guide, plant a seedling, then cook a coastal family recipe in a village kitchen.',
    duration: '2 days, 1 night',
    price: 850000,
    privateSurcharge: 500000,
    quotaLeft: 15,
    conservationUse: 'mangrove planting',
    includes: ['Homestay', 'Cooking class', 'English-speaking guide', 'All meals'],
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=900'
  },
  {
    id: 'seribu',
    themes: ['village', 'reef'],
    location: 'Northern Thousand Islands',
    region: 'DKI Jakarta',
    partner: 'Pokdarwis',
    rating: 5.0,
    reviews: 150,
    title: 'Seaweed farming & sunset sailing',
    description: 'Learn seaweed farming hands-on with local families, then sail at sunset on a traditional wooden boat run by a village cooperative.',
    duration: '2 days, 1 night',
    price: 950000,
    privateSurcharge: 600000,
    quotaLeft: 10,
    conservationUse: 'beach clean-ups and waste banks',
    includes: ['Homestay', 'Traditional boat', 'English-speaking guide', 'All meals'],
    img: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&q=80&w=900'
  }
];
