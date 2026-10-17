import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * The menu is the stand-in for a database in this project: it is read from disk
 * once at startup and then served from memory.
 */
export const menu = JSON.parse(fs.readFileSync(path.join(dataDir, 'menu.json'), 'utf8'));

/** Distinct categories, in the order they first appear in the menu. */
export function listCategories() {
  return [...new Set(menu.map((dish) => dish.category))];
}

/** Find a dish by its id or its slug (exact match). */
export function findDish(idOrSlug) {
  return menu.find((dish) => dish.id === idOrSlug || dish.slug === idOrSlug) ?? null;
}
