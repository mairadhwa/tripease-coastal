# TripEase Coastal

A community-based coastal marine tourism platform for Indonesia's non-mainstream coastal destinations, built under the Agromaritime 5.0 framework.

Interactive prototype for the final round of the Business Essay Competition, **The 9th IPB Business Festival 2026**.

> This is a front-end prototype. No real bookings, payments or registrations are processed.

## Features

- **Trip catalog with search.** Filter by destination, group size and theme. Each card shows how much of the price goes to conservation.
- **Booking checkout.** Open or private trip, date, number of guests (capped by a daily visitor limit), a live price breakdown and the 70 / 20 / 10 revenue split. The pay button stays disabled until a valid name and email are entered. A confirmation screen and a toast replace browser alerts.
- **Phrase & culture assistant.** A chat widget that answers etiquette questions with an Indonesian phrase, its pronunciation and a local tip. It runs offline by default and is ready to connect to a real AI API.
- **Impact tracker.** Counters and bars animate when they scroll into view (Intersection Observer). The figures are simulated.
- **Partner registration.** A validated form for homestays, boat operators and guides registering through their Pokdarwis or BUMDes.
- Responsive from 320 px phones to desktop. Supports keyboard navigation and reduced-motion settings.

## Tech

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies except the Plus Jakarta Sans font from Google Fonts.

```
tripease-coastal/
├── index.html          Page structure
├── css/
│   └── style.css       All styles and design tokens
├── js/
│   ├── data.js         Trips, prices and revenue split (edit this to change content)
│   ├── assistant.js    Phrase assistant engine and API templates
│   └── app.js          Navigation, catalog, booking, forms, counters
└── assets/
    └── favicon.svg
```

## Run locally

Open `index.html` in a browser. That's it.

For a local server instead (optional):

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Publish on GitHub Pages

1. Create a new repository on GitHub, for example `tripease-coastal`.
2. Upload the contents of this folder (or push with git):
   ```bash
   git init
   git add .
   git commit -m "TripEase Coastal prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/tripease-coastal.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then save.
4. After a minute the site is live at `https://<your-username>.github.io/tripease-coastal/`.

## Customising

**Trips and prices.** Edit `js/data.js`. Each trip has a price per person, a private-trip surcharge, a daily quota and an image URL. The catalog and checkout update automatically.

**Revenue split.** Change `REVENUE_SPLIT` in `js/data.js`. Also update the matching text in the Impact section of `index.html`.

**Colours.** All colours are CSS variables at the top of `css/style.css` (`--accent`, `--eco`, and so on).

**Photos.** The prototype uses Unsplash images linked by URL. For the final version, put your own photos in `assets/` and change the `img` paths in `js/data.js` (e.g. `assets/gelasa.jpg`).

## Connecting a real AI model

The assistant uses an offline keyword engine by default. To use a real model, open `js/assistant.js` and change `provider` in `AI_CONFIG`:

| provider | What it does |
|----------|--------------|
| `mock`   | Offline keyword matching. Default. |
| `proxy`  | Sends the question to your own backend (`proxyUrl`), which calls OpenAI or Gemini with a secret key. **Use this for a public site.** |
| `openai` | Calls OpenAI directly from the browser. For private demos only. |
| `gemini` | Calls Google Gemini directly from the browser. For private demos only. |

**Never commit an API key to a public repository.** Anything in front-end JavaScript can be read by anyone who visits the page. For a public GitHub Pages site, use `proxy` with a small serverless function (e.g. Vercel, Netlify or Cloudflare Workers) that keeps the key server-side.

## Credits

Concept: *TripEase Coastal: A Community-Based Coastal Marine Tourism Digital Platform for Economic Equalization and Global Competitiveness of Indonesia's Coastal Destinations.*

Photos: [Unsplash](https://unsplash.com). Font: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans).
