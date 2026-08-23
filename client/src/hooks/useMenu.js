import { useMemo, useState } from 'react';
import { useFetch } from './useFetch';
import { getMenu } from '../api/client';

export const ALL_CATEGORIES = 'All';

const lower = (value) => String(value ?? '').toLowerCase();

/** The text a search query is matched against. */
function searchableText(dish) {
  return [dish.name, dish.localName, dish.description, ...(dish.tags ?? [])]
    .filter(Boolean)
    .map(lower)
    .join(' ');
}

/**
 * Fetch the menu once, then filter it in memory so category and search changes
 * are instant. The server supports the same filters for non-interactive use.
 */
export function useMenu() {
  const { data, loading, error, retry } = useFetch(({ signal }) => getMenu(undefined, { signal }), []);
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [query, setQuery] = useState('');

  const allDishes = useMemo(() => data ?? [], [data]);

  const dishes = useMemo(() => {
    const needle = lower(query).trim();
    return allDishes.filter((dish) => {
      const matchesCategory = category === ALL_CATEGORIES || dish.category === category;
      const matchesQuery = !needle || searchableText(dish).includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [allDishes, category, query]);

  const isFiltered = category !== ALL_CATEGORIES || query.trim() !== '';

  const clearFilters = () => {
    setCategory(ALL_CATEGORIES);
    setQuery('');
  };

  return {
    dishes,
    allDishes,
    loading,
    error,
    retry,
    category,
    setCategory,
    query,
    setQuery,
    isFiltered,
    clearFilters,
  };
}

export default useMenu;
