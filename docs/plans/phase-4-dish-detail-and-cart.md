# Phase 4 — Dish Detail + Cart

> **Deliverable when this phase closes:** clickable dish detail pages and a fully working, localStorage-persistent cart (add / change quantity / remove / clear) with a cart page and Navbar badge. Checkout submission is Phase 5 — the cart itself is complete here. Committed to git.

## Project context (shared across all phases — read first)

We are building a Ghanaian restaurant web app in this repo (`Trine/`).

- **Stack:** React 19 + Vite (**JavaScript, NOT TypeScript**), Tailwind CSS v4 (brand tokens `brand-*` in `client/src/index.css`), react-router. Fake backend: Express 5 serving `server/data/menu.json`; `GET /api/menu/:idOrSlug` returns one dish or 404 `{"error":"Dish not found"}`.
- **Two servers:** Express API on `:4000`, Vite on `:5173` with `/api` proxied. Root `npm run dev` runs both.
- **Existing modules to REUSE:** `api/client.js` (`getDish`), `hooks/useFetch.js`, `ui/{Button,Badge,Spinner,ErrorMessage}`, `menu/DishCard` (cards already link to `/menu/:slug`), layout components.
- **Conventions:** modular/reusable; all API access through `api/client.js`; loading/error/empty states everywhere; prices formatted `$XX.XX`.
- **Phase docs** live in `docs/plans/phase-1..5.md`. Do ONLY this phase's work; end fully working, verified, committed.

## Before you start — verify Phase 3 is closed

1. `npm run dev`; `/menu` shows the filterable 18-dish grid; Home shows featured dishes.
2. Clicking a `DishCard` navigates to `/menu/<slug>` (currently the not-found view — this phase gives it a real route).
3. `curl -s localhost:4000/api/menu/waakye` returns the dish.

If any check fails, complete/fix earlier phases first.

## Tasks

### 1. `context/CartContext.jsx`

- `CartProvider` using `useReducer`. State: `{ items: [{ id, slug, name, price, image, qty }] }`.
- Actions: `ADD` (adds dish with qty, or increments if already present), `REMOVE` (drops line), `SET_QTY` (clamps to ≥ 1; use REMOVE to delete), `CLEAR`.
- Persistence: initialize from `localStorage` (`trine.cart` key) with try/catch fallback to empty; write-through on every change (try/catch guarded, e.g. in a `useEffect`).
- Export hook `useCart()` returning `{ items, itemCount, subtotal, addItem(dish, qty), removeItem(id), setQty(id, qty), clearCart }`. `itemCount` = sum of qtys; `subtotal` = sum of `price * qty`.
- Wrap the app in `main.jsx`: `<BrowserRouter><CartProvider><App /></CartProvider></BrowserRouter>`.
- Note: store unit prices only for display; Phase 5's checkout sends only `{id, qty}` — the server reprices from menu.json.

### 2. `components/ui/QuantityStepper.jsx`

Props `{ value, onChange, min = 1 }`. − / value / + buttons, accessible labels, disables − at min. Reused on detail page and cart lines.

### 3. `pages/DishDetailPage.jsx` (route `/menu/:slug`)

- Fetch via `useFetch(() => getDish(slug), [slug])`.
- Loading → `Spinner`; error/404 → `ErrorMessage` ("We couldn't find that dish") + Button back to `/menu`.
- Layout: two columns on desktop (image / info), stacked on mobile. Image with the same gradient-fallback treatment as `DishCard` (extract that fallback into a small shared `DishImage` component under `components/menu/` and reuse it in `DishCard` — don't duplicate).
- Info: name + localName, category Badge, price, full `description`, "Cultural note" callout block (brand-cream background, brand-gold left border) with `culturalNote`, "Served with" chip list from `accompaniments`, vegan/spicy badges.
- Add-to-cart row: `QuantityStepper` (local state, default 1) + primary Button "Add to cart — $XX.XX" (price × qty). On click: `addItem(dish, qty)`, show brief confirmation (inline "Added ✓" state) with a link to `/cart`.

### 4. Cart UI

- **`Navbar`** — add a cart link (🛒 or bag icon + "Cart") on the reserved right side, with a small brand-gold count badge showing `itemCount` (hidden when 0). Links to `/cart`.
- **`pages/CartPage.jsx`** (route `/cart`):
  - Empty state: friendly message + Button → `/menu`.
  - Line items: thumbnail (`DishImage`), name (links to detail), unit price, `QuantityStepper`, line total, remove (×) button.
  - Summary card: subtotal, note "Taxes calculated at pickup", "Clear cart" ghost button, and a primary **"Place order"** button that is present but disabled with a "Checkout arrives in Phase 5" tooltip/title. Do NOT wire submission.

## Definition of Done — verify ALL of these, then commit

1. `npm run dev`; from `/menu`, clicking Waakye's card opens `/menu/waakye` with full details, cultural note callout, and accompaniment chips; `/menu/not-a-dish` shows the error state with a working back-to-menu button.
2. Add Waakye ×2 and Kelewele ×1 → Navbar badge shows 3; `/cart` lists both lines with correct line totals and subtotal ($36.97).
3. Stepper changes update totals; removing a line works; adding the same dish again increments its existing line instead of duplicating.
4. Reload the page → cart contents persist. Clear cart → badge disappears, empty state shows.
5. "Place order" button visible but disabled.
6. `npm run build -w client` passes.
7. `git add -A && git commit` with a message like `Phase 4: dish detail pages and persistent cart`.

**Do not** wire order submission — that is Phase 5 (`docs/plans/phase-5-checkout-and-polish.md`).
