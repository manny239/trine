import { menu, listCategories, findDish } from '../data/menu.store.js';

const lower = (value) => String(value ?? '').toLowerCase();

/** Fields a `?q=` search looks through. */
function searchableText(dish) {
  return [dish.name, dish.localName, dish.description, ...(dish.tags ?? [])]
    .filter(Boolean)
    .map(lower)
    .join(' ');
}

// GET /api/menu?category=&q=
export function getMenu(req, res) {
  const { category, q } = req.query;
  let items = menu;

  if (category) {
    items = items.filter((dish) => lower(dish.category) === lower(category));
  }

  if (q) {
    const needle = lower(q).trim();
    items = items.filter((dish) => searchableText(dish).includes(needle));
  }

  res.json(items);
}

// GET /api/menu/:idOrSlug
export function getDish(req, res) {
  const dish = findDish(req.params.idOrSlug);
  if (!dish) return res.status(404).json({ error: 'Dish not found' });
  res.json(dish);
}

// GET /api/categories
export function getCategories(req, res) {
  res.json(listCategories());
}
