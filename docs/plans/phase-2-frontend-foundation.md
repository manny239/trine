# Phase 2 — Frontend Foundation

> **Deliverable when this phase closes:** a running React app shell — Vite + Tailwind v4 + react-router, layout (Navbar/Footer), shared UI components, API client wired through the Vite proxy, and complete static pages (Home hero, About, Contact). Both servers start with one `npm run dev`. Committed to git.

## Project context (shared across all phases — read first)

We are building a Ghanaian restaurant web app in this repo (`Trine/`).

- **Stack:** React 19 + Vite (**JavaScript, NOT TypeScript**), Tailwind CSS v4, react-router on the frontend. Fake backend: Express 5 serving menu items from `server/data/menu.json` (MERN-style structure, no database).
- **Two servers:** Express API on `http://localhost:4000`, Vite dev server on `http://localhost:5173` (Vite proxies `/api` → `:4000`). Root `npm run dev` runs both via `concurrently`, using npm workspaces `client` and `server`.
- **Conventions:** modular, reusable components; pages compose components; ALL frontend API access goes through `client/src/api/client.js`; loading/error/empty states on every data-driven view.
- **Phase docs** live in `docs/plans/phase-1..5.md`. Do ONLY this phase's work. The phase must end fully working, verified per the checklist below, and committed.

## Before you start — verify Phase 1 is closed

1. `server/` exists with `index.js`, `routes/`, `controllers/`, `data/menu.json` (18 items).
2. `npm install` at root, then `npm run dev -w server`, then `curl -s localhost:4000/api/health` → `{"ok":true}` and `curl -s localhost:4000/api/menu | head -c 200` returns menu JSON.

If any check fails, complete/fix Phase 1 (`docs/plans/phase-1-backend.md`) first.

## Tasks

### 1. Scaffold the client workspace

Create `client/` as a Vite + React app (either `npm create vite@latest client -- --template react` from the repo root, or author the files manually). Then install Tailwind v4 and router:

```
npm install react-router @tailwindcss/vite -w client
```

- **`client/vite.config.js`** — plugins `[react(), tailwindcss()]` (import `tailwindcss` from `@tailwindcss/vite`); dev server proxy:
  ```js
  server: { proxy: { "/api": "http://localhost:4000" } }
  ```
- **`client/src/index.css`** — Tailwind v4 style (NO tailwind.config.js needed):
  ```css
  @import "tailwindcss";

  @theme {
    --color-brand-red: #c1272d;    /* Ghana flag red */
    --color-brand-gold: #f2a900;   /* Ghana flag gold */
    --color-brand-green: #006b3f;  /* Ghana flag green */
    --color-brand-cream: #fdf8f0;  /* warm page background */
    --color-brand-ink: #241a12;    /* warm near-black text */
  }
  ```
  Use these tokens as Tailwind utilities (`bg-brand-red`, `text-brand-gold`, etc.) throughout the app.
- Update root `package.json` dev script:
  ```json
  "dev": "concurrently -n server,client -c yellow,cyan \"npm run dev -w server\" \"npm run dev -w client\""
  ```
- Clean out Vite scaffold cruft (default `App.css`, logos, counter demo).

### 2. App structure

```
client/src/
├── main.jsx            # StrictMode + BrowserRouter + <App />
├── App.jsx             # Routes wrapped in layout
├── index.css
├── api/client.js
├── hooks/useFetch.js
├── components/
│   ├── layout/Navbar.jsx
│   ├── layout/Footer.jsx
│   └── ui/{Button,Badge,Spinner,ErrorMessage}.jsx
└── pages/{HomePage,MenuPage,AboutPage,ContactPage}.jsx
```

Routes in `App.jsx`: `/` HomePage, `/menu` MenuPage (placeholder this phase), `/about` AboutPage, `/contact` ContactPage, `*` a simple not-found view. Layout: Navbar on top, `<main>` content, Footer at bottom (flex column, `min-h-screen`, footer pinned down).

### 3. Shared modules (specs)

- **`api/client.js`** — base `request(path, options)` helper using `fetch` against relative `/api/...` paths (the proxy handles the rest). Throws an `Error` with the server's `error` message on non-2xx. Export: `getHealth()`, `getMenu(params)`, `getDish(idOrSlug)`, `getCategories()`, `placeOrder(order)`. (Menu/order functions are consumed in later phases but defined now.)
- **`hooks/useFetch.js`** — `useFetch(fetcher, deps)` returning `{ data, loading, error, retry }`. Handles unmount safely (ignore state updates after unmount/abort).
- **`ui/Button.jsx`** — `variant` (`primary` = brand-red solid, `secondary` = outline, `ghost`), `as` prop or accept `onClick`/`type`; consistent padding/rounding/focus ring.
- **`ui/Badge.jsx`** — small pill; `color` prop mapping to brand colors (used later for vegan/spicy/popular).
- **`ui/Spinner.jsx`** — centered animated spinner with an accessible label.
- **`ui/ErrorMessage.jsx`** — `{ message, onRetry }`; friendly error panel with optional retry button.
- **`layout/Navbar.jsx`** — restaurant name/logo text (pick a name, e.g. **"Trine Kitchen — Taste of Ghana"**), NavLinks (Home, Menu, About, Contact) with active styling, mobile-friendly (simple collapsing menu or wrapping row is fine). A cart link slot will be added in Phase 4 — keep the right side of the bar available.
- **`layout/Footer.jsx`** — name, hours summary, "Built with React + Express" line.

### 4. Static pages

- **`HomePage`** — hero section (brand-cream background, big headline about traditional Ghanaian food, subline mentioning waakye/jollof/banku/fufu, CTA Button → `/menu`). Below the hero, a "Kitchen status" strip that calls `getHealth()` via `useFetch` and shows Spinner → "Kitchen is open — menu is live" (or ErrorMessage with retry). This proves end-to-end connectivity through the proxy. (Phase 3 replaces this section with real featured dishes.)
- **`MenuPage`** — placeholder: heading + "Full menu coming in Phase 3" copy so the route works.
- **`AboutPage`** — 3–4 short sections on the restaurant story: Ghanaian food as heritage ("a living archive of cultural heritage, recipes passed down through generations"), staples (cassava, maize, yams, plantains), communal eating by hand, regional variety (coastal seafood ↔ northern grains).
- **`ContactPage`** — static hours table, address, phone/email placeholder, "order at the counter" note. No forms.

## Definition of Done — verify ALL of these, then commit

1. `npm install` at root succeeds; `npm run dev` starts BOTH servers (yellow/cyan prefixed logs).
2. `http://localhost:5173` renders the Home hero; the health strip shows the success state (kill the server and confirm the ErrorMessage + retry appears, then restart).
3. Navbar navigation works for `/`, `/menu`, `/about`, `/contact`; unknown URL shows the not-found view; active link is highlighted.
4. Brand palette utilities (`bg-brand-*`) visibly used; no leftover Vite demo assets.
5. `npm run build -w client` passes with no errors.
6. `git add -A && git commit` with a message like `Phase 2: React app shell with Tailwind, router, layout, and API client`.

**Do not** build menu browsing, cart, or checkout — those are Phases 3–5.
