# Trine Kitchen — Taste of Ghana

A Ghanaian restaurant web app: browse the menu, read the story behind each dish, build a cart, and place an order.

The menu is dictated by CookUnity's *"Ghanaian food guide: 10 traditional dishes to try"* — 18 dishes across four categories, each with its local name, cultural note, accompaniments, and spice level.

This is a MERN-shaped app with the "M" swapped out: instead of MongoDB, the Express server reads `server/data/menu.json`. Everything else follows the usual split — routes and controllers on the server, components, hooks, and context on the client.

---

## Stack

| Layer    | Choice                                                          |
| -------- | --------------------------------------------------------------- |
| Client   | React 19 + Vite (JavaScript, no TypeScript), react-router        |
| Styling  | Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`) |
| Server   | Express 5 (ES modules), `cors`                                   |
| Data     | `server/data/menu.json`, read once at startup                    |
| Workspaces | npm workspaces (`client`, `server`) driven by `concurrently`   |

Brand tokens live in `client/src/index.css` under `@theme` and are used as Tailwind utilities (`bg-brand-red`, `text-brand-gold`, …):

| Token          | Value     | Role                  |
| -------------- | --------- | --------------------- |
| `brand-red`    | `#c1272d` | Ghana flag red        |
| `brand-gold`   | `#f2a900` | Ghana flag gold       |
| `brand-green`  | `#006b3f` | Ghana flag green      |
| `brand-cream`  | `#fdf8f0` | warm page background  |
| `brand-ink`    | `#241a12` | warm near-black text  |

---

## Setup

```bash
npm install     # installs both workspaces from the repo root
npm run dev     # starts the API and the client together
```

| Script                 | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | API on `:4000` **and** Vite on `:5173` (prefixed logs) |
| `npm run dev:server`   | API only                                            |
| `npm run dev:client`   | Vite only                                           |
| `npm run build`        | Production build of the client                      |
| `npm run lint -w client` | oxlint over the client                            |

Open **http://localhost:5173**.

### Ports and the proxy

The client never talks to `http://localhost:4000` directly. It calls relative paths (`/api/menu`), and the Vite dev server proxies them:

```js
// client/vite.config.js
server: { proxy: { '/api': 'http://localhost:4000' } }
```

The API also applies a **~300ms artificial delay** to every `/api` route so loading states are actually visible in development. Set `API_DELAY_MS=0` to turn it off.

---

## Project structure

```
Trine/
├── package.json              # workspaces root; dev script runs both servers
├── docs/plans/               # the phased build plan (phase-1 … phase-5)
├── server/
│   ├── index.js              # app setup: cors, json, latency, routes, 404, errors
│   ├── data/
│   │   ├── menu.json         # the menu — the whole "database"
│   │   └── menu.store.js     # loads menu.json once; findDish, listCategories
│   ├── controllers/
│   │   ├── menu.controller.js
│   │   └── order.controller.js
│   └── routes/
│       ├── menu.routes.js
│       └── order.routes.js
└── client/
    ├── vite.config.js
    └── src/
        ├── main.jsx          # StrictMode > BrowserRouter > CartProvider > App
        ├── App.jsx           # routes inside the layout
        ├── index.css         # Tailwind import + @theme brand tokens
        ├── api/client.js     # the ONLY place that calls fetch
        ├── hooks/            # useFetch, useMenu, useCart, usePageTitle
        ├── context/          # CartContext (provider) + cartContext (the context object)
        ├── utils/format.js   # formatPrice, pluralizeDishes
        ├── components/
        │   ├── layout/       # Navbar, CartLink, Footer
        │   ├── ui/           # Button, Badge, Spinner, ErrorMessage, QuantityStepper
        │   ├── menu/         # DishCard, DishImage, DishBadges, DishGrid, CategoryFilter, SearchBar
        │   └── cart/         # CartLine, CartSummary, CheckoutForm, OrderConfirmation
        └── pages/            # Home, Menu, DishDetail, Cart, About, Contact, NotFound
```

Routes: `/`, `/menu`, `/menu/:slug`, `/cart`, `/about`, `/contact`, and a catch-all not-found view.

---

## API reference

Base URL `http://localhost:4000/api` (or `/api` through the Vite proxy). Every response is JSON.

### `GET /api/health`

```bash
curl -s localhost:4000/api/health
# {"ok":true}
```

### `GET /api/menu`

All 18 dishes. Optional filters:

| Query       | Behaviour                                                             |
| ----------- | --------------------------------------------------------------------- |
| `category`  | exact match, case-insensitive                                         |
| `q`         | case-insensitive substring over `name`, `localName`, `description`, `tags` |

```bash
curl -s "localhost:4000/api/menu?category=Breakfast"
# [ { "id": "16", "slug": "hausa-koko", ... }, ... ]   (3 items)

curl -s "localhost:4000/api/menu?q=plantain"
# 5 items, including kelewele and fried-plantains
```

### `GET /api/menu/:idOrSlug`

Matches either the `id` or the `slug`.

```bash
curl -s localhost:4000/api/menu/waakye      # same object as /api/menu/6
curl -s localhost:4000/api/menu/pizza
# 404 {"error":"Dish not found"}
```

### `GET /api/categories`

```bash
curl -s localhost:4000/api/categories
# ["Soups & Stews","Rice & Mains","Street Food & Sides","Breakfast"]
```

### `POST /api/orders`

```bash
curl -s -X POST localhost:4000/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"customer":{"name":"Ama","phone":"0244000000","fulfillment":"pickup"},
       "items":[{"id":"5","qty":2},{"id":"11","qty":1}]}'
# 201 {"orderId":"ord_1712345678901_1","total":36.97,"status":"received"}
```

The client sends **only** `id` and `qty`. Prices are never trusted from the client — the server looks up each dish in `menu.json` and computes the total itself.

Validation returns `400` with a specific message:

| Problem                                  | Response                                                        |
| ---------------------------------------- | --------------------------------------------------------------- |
| missing/blank `customer.name`            | `{"error":"Customer name is required"}`                          |
| missing/blank `customer.phone`           | `{"error":"Customer phone is required"}`                         |
| `fulfillment` not `pickup`/`delivery`    | `{"error":"Fulfillment must be either \"pickup\" or \"delivery\""}` |
| `items` empty or not an array            | `{"error":"Order must contain at least one item"}`                |
| `qty` not a whole number ≥ 1             | `{"error":"Quantity for item \"5\" must be a whole number of at least 1"}` |
| unknown dish id                          | `{"error":"Unknown item id: 999"}`                                |

### `GET /api/orders/:id`

```bash
curl -s localhost:4000/api/orders/ord_1712345678901_1
# { "orderId": "...", "customer": {...}, "items": [ { "id", "name", "price", "qty", "subtotal" } ],
#   "total": 36.97, "status": "received", "createdAt": "..." }
```

Unknown ids return `404 {"error":"Order not found"}`.

---

## How the fake ordering works

- Orders live in an **in-memory `Map`** in `server/controllers/order.controller.js`. Restarting the server clears them — that is fine for a fake backend.
- Order ids look like `ord_<timestamp>_<counter>`.
- The server snapshots each line's `name` and unit `price` at order time, so a stored order stays readable even if `menu.json` changes later.
- The cart lives in the browser under `localStorage["trine.cart"]` and survives reloads. It keeps unit prices **for display only**; the server is always the source of truth for the total.

---

## Adding a menu item

Append an object to `server/data/menu.json` and restart the server (`node --watch` does it for you in dev). Every field:

| Field            | Type                | Notes                                                            |
| ---------------- | ------------------- | ---------------------------------------------------------------- |
| `id`             | string              | unique; what order requests reference                            |
| `slug`           | string              | unique, URL-safe; used by `/menu/:slug`                          |
| `name`           | string              | shown on cards and the detail page                               |
| `localName`      | string \| `null`    | pronunciation or local name, shown in quotes                     |
| `category`       | string              | a new value automatically appears as a filter pill               |
| `price`          | number              | in dollars, e.g. `14.99`                                         |
| `description`    | string              | clamped to 2 lines on cards, shown in full on the detail page    |
| `culturalNote`   | string              | rendered in the gold-bordered callout                            |
| `accompaniments` | string[]            | "Served with" chips; use `[]` for none                           |
| `tags`           | string[]            | searchable; `popular` renders a Popular badge                    |
| `spicyLevel`     | 0–3                 | renders that many 🌶                                              |
| `isVegan`        | boolean             | renders a green Vegan badge                                      |
| `image`          | string URL \| `null`| `null` (or a failed load) falls back to a gold→red gradient tile |
| `featured`       | boolean             | featured dishes appear on the Home page                          |

---

## Build plan

`docs/plans/` holds the five phase documents this app was built from — backend, frontend foundation, menu browsing, dish detail and cart, and checkout with polish. Each phase ends with its own verification checklist.

Out of scope for v1: order history, an admin menu editor, a real database, and deployment.
