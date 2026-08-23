# Phase 3 — Menu Browsing

> **Deliverable when this phase closes:** the full menu browsing experience — menu grid with category filters and search, featured dishes on the Home page, all with loading/error/empty states. Committed to git.

## Project context (shared across all phases — read first)

We are building a Ghanaian restaurant web app in this repo (`Trine/`).

- **Stack:** React 19 + Vite (**JavaScript, NOT TypeScript**), Tailwind CSS v4 (brand tokens `brand-red`, `brand-gold`, `brand-green`, `brand-cream`, `brand-ink` defined in `client/src/index.css`), react-router. Fake backend: Express 5 serving `server/data/menu.json` (18 items).
- **Two servers:** Express API on `:4000`, Vite on `:5173` with `/api` proxied. Root `npm run dev` runs both.
- **Existing modules to REUSE (do not reinvent):** `client/src/api/client.js` (`getMenu`, `getDish`, `getCategories`), `client/src/hooks/useFetch.js`, `client/src/components/ui/{Button,Badge,Spinner,ErrorMessage}.jsx`, layout in `components/layout/`.
- **Conventions:** modular, reusable components; pages compose components; all API access through `api/client.js`; loading/error/empty states on every data-driven view.
- **Phase docs** live in `docs/plans/phase-1..5.md`. Do ONLY this phase's work; end fully working, verified, committed.

## Before you start — verify Phase 2 is closed

1. `npm run dev` starts both servers; `http://localhost:5173` shows the Home hero and a working API-health strip.
2. `client/src/api/client.js` and `hooks/useFetch.js` exist; `curl -s localhost:4000/api/categories` returns 4 categories.

If any check fails, complete/fix earlier phases first.

## Tasks

### 1. `hooks/useMenu.js`

Fetches the full menu once via `getMenu()` + `useFetch`, holds `category` (string or `"All"`) and `query` (string) state, and derives the filtered list client-side with `useMemo`:

- Category: exact match unless `"All"`.
- Query: case-insensitive substring match against `name`, `localName`, `description`, and `tags`.
- Returns `{ dishes, allDishes, loading, error, retry, category, setCategory, query, setQuery }`.

(Server-side `?category=`/`?q=` filtering exists too, but client-side filtering over the fetched list gives instant UX; keep it client-side here.)

### 2. Menu components (`client/src/components/menu/`)

- **`DishCard.jsx`** — props `{ dish }`. Card with:
  - Image area (fixed aspect, `object-cover`). If `dish.image` is null OR the image fails to load (`onError`), render a fallback: warm gradient (brand-gold → brand-red) with the dish's first letter large and centered.
  - Name + `localName` (if present, shown as pronunciation hint, e.g. "waa-chay"), truncated 2-line description, price formatted `$XX.XX`.
  - Badges (reuse `Badge`): "Vegan" (green) when `isVegan`; "🌶" repeated `spicyLevel` times when > 0; "Popular" (gold) when tags include `popular`.
  - Whole card links to `/menu/${dish.slug}` (route is built in Phase 4 — linking now is correct and will 404 to the not-found view until then; that's expected and fine).
- **`DishGrid.jsx`** — props `{ dishes, emptyMessage }`. Responsive grid (1col → 2 → 3 at `sm`/`lg`); renders the empty message (with a "clear filters" hint) when the list is empty.
- **`CategoryFilter.jsx`** — props `{ categories, selected, onSelect }`. Horizontal scrollable pill row: "All" + categories from `getCategories()` (fetched by the page, passed down). Selected pill = solid brand-red; others outline.
- **`SearchBar.jsx`** — props `{ value, onChange, placeholder }`. Controlled input with search icon and a clear (×) button when non-empty.

### 3. Pages

- **`MenuPage.jsx`** — replace the placeholder. Composition:
  - Heading + short intro line.
  - `SearchBar` + `CategoryFilter` (categories via `useFetch(getCategories)`).
  - Body: `Spinner` while loading, `ErrorMessage` with retry on failure, otherwise `DishGrid` of the filtered `dishes` from `useMenu`.
  - Result count line ("18 dishes" / "3 dishes match").
- **`HomePage.jsx`** — replace the Phase 2 health strip with a **Featured dishes** section: fetch menu, show `featured: true` items in a `DishGrid` (reuse!), plus a "View full menu" Button → `/menu`. Keep hero unchanged. Loading/error states as usual.

## Definition of Done — verify ALL of these, then commit

1. `npm run dev`; `http://localhost:5173/menu` shows all 18 dishes in a responsive grid with images (article S3 URLs) or gradient fallbacks, prices, and correct badges (Red Red & Kelewele show Vegan; Shito shows 🌶🌶🌶).
2. Category pills filter correctly (Breakfast → 3 dishes); search "plantain" → includes Kelewele and Fried Ripe Plantains; combined filter+search works; a nonsense query shows the empty state with clear-filters hint; result count updates.
3. Home page shows only the 8 featured dishes and the CTA to the full menu.
4. Kill the API server → menu page shows `ErrorMessage`; retry works after restarting.
5. `npm run build -w client` passes.
6. `git add -A && git commit` with a message like `Phase 3: menu browsing with category filters and search`.

**Do not** build the dish detail page or cart — that is Phase 4 (`docs/plans/phase-4-dish-detail-and-cart.md`).
