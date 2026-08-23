# Phase 5 — Checkout, Polish & Wrap-up

> **Deliverable when this phase closes:** the complete v1 app — checkout flow posting orders to the fake backend with confirmation, a polish pass across all pages, and a full README. End-to-end journey verified. Committed to git.

## Project context (shared across all phases — read first)

We are building a Ghanaian restaurant web app in this repo (`Trine/`).

- **Stack:** React 19 + Vite (**JavaScript, NOT TypeScript**), Tailwind CSS v4 (brand tokens `brand-*`), react-router. Fake backend: Express 5. `POST /api/orders` expects `{ "customer": { "name", "phone", "fulfillment": "pickup"|"delivery" }, "items": [{ "id", "qty" }] }`, validates, prices server-side from `server/data/menu.json`, returns 201 `{ "orderId", "total", "status": "received" }` or 400 `{ "error": "..." }`.
- **Two servers:** Express API on `:4000`, Vite on `:5173` with `/api` proxied. Root `npm run dev` runs both.
- **Existing modules to REUSE:** `api/client.js` (`placeOrder`), `context/CartContext.jsx` (`useCart` → items, subtotal, clearCart), `ui/{Button,Badge,Spinner,ErrorMessage,QuantityStepper}`, `CartPage` (has a disabled "Place order" button), full menu/detail/cart flows from Phases 3–4.
- **Phase docs** live in `docs/plans/phase-1..5.md`. This is the final phase.

## Before you start — verify Phase 4 is closed

1. `npm run dev`; browse `/menu` → open a dish → add to cart → `/cart` shows lines, totals, persistent across reload; "Place order" is present but disabled.
2. `curl -s -X POST localhost:4000/api/orders -H 'Content-Type: application/json' -d '{"customer":{"name":"Ama","phone":"024","fulfillment":"pickup"},"items":[{"id":"5","qty":1}]}'` → 201 with orderId.

If any check fails, complete/fix earlier phases first.

## Tasks

### 1. Checkout flow (on `CartPage`, or extracted `components/cart/CheckoutForm.jsx` — prefer the extracted component)

- Enable the "Place order" flow: clicking it reveals (or scrolls to) a checkout form: Name (required), Phone (required), Fulfillment radio (Pickup / Delivery, default Pickup). Client-side required validation with inline messages; disable submit while pending.
- Submit → `placeOrder({ customer: { name, phone, fulfillment }, items: items.map(({id, qty}) => ({id, qty})) })`. Send ONLY id+qty — the server reprices.
- Pending state: spinner-in-button ("Placing order…").
- Success: `clearCart()`, replace the cart view with a **confirmation panel**: big check, "Medaase! Order received" (Medaase = thank you in Twi), the `orderId`, server-returned `total`, fulfillment method, and a Button back to `/menu`.
- Failure (server 400/500 or network): keep the cart intact, show `ErrorMessage` with the server's message and let the user retry.

### 2. Polish pass (whole app)

- Responsive check at ~375px, ~768px, ~1280px: Navbar, menu grid, detail two-column collapse, cart lines, checkout form. Fix anything cramped or overflowing.
- Consistency: all prices `$XX.XX`; all buttons via `ui/Button`; brand palette used consistently; focus states visible; images have `alt` text; form inputs have labels.
- Empty/edge states sanity: empty cart, empty search results, API-down error states still render well.
- Remove dead code, unused imports, leftover placeholders (e.g., any Phase 2 "coming soon" copy).
- Add a page `<title>` per route if trivial to do (e.g., small `useEffect` in each page); skip if it adds complexity.

### 3. README (replace the stub)

Document: project overview (Ghanaian restaurant app, menu dictated by CookUnity's Ghanaian food guide), stack, project structure tree, setup (`npm install`, `npm run dev`), ports and the Vite proxy, full API reference (all endpoints with example curl + responses), how to add a menu item (edit `server/data/menu.json`, field reference), how the fake ordering works (in-memory, server-side pricing), and a note that `docs/plans/` holds the phased build plan.

## Definition of Done — verify ALL of these, then commit

1. **Full E2E journey in the browser:** Home → featured dish → detail → add to cart (×2) → `/menu` → filter Breakfast → add Hausa Koko → `/cart` → adjust a quantity → place order with name/phone/pickup → confirmation shows orderId + correct server total → cart is empty, Navbar badge gone → "Back to menu" works.
2. `curl -s localhost:4000/api/orders/<orderId from the browser flow>` returns that order with `status: "received"` and the same total.
3. Failure path: submit with the API server killed → error shown, cart NOT cleared; restart server, retry succeeds.
4. Validation: empty name/phone blocked client-side; a hand-crafted bad POST (qty 0) still gets a server 400.
5. Responsive spot-check passes at the three widths; no horizontal scrolling anywhere.
6. `npm run build -w client` passes; `npm run dev` clean start with no console errors in the browser.
7. README is complete and accurate (spot-check its curl examples actually work).
8. `git add -A && git commit` with a message like `Phase 5: checkout flow, polish pass, and full README — v1 complete`.

🎉 After this phase, v1 is done. Natural follow-ups (NOT in scope): order history page, admin menu editor, real database, deployment.
