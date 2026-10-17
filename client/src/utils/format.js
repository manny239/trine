/** Format a number as a price string, e.g. 14.99 → "$14.99". */
export function formatPrice(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

/** "3 dishes" / "1 dish" */
export function pluralizeDishes(count) {
  return `${count} ${count === 1 ? 'dish' : 'dishes'}`;
}
