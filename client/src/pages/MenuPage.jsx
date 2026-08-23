import SearchBar from '../components/menu/SearchBar';
import CategoryFilter from '../components/menu/CategoryFilter';
import DishGrid from '../components/menu/DishGrid';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useMenu } from '../hooks/useMenu';
import { useFetch } from '../hooks/useFetch';
import { getCategories } from '../api/client';
import { pluralizeDishes } from '../utils/format';

export default function MenuPage() {
  const {
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
  } = useMenu();

  // Categories come from the API so the pills always match the menu data.
  const { data: categories } = useFetch(({ signal }) => getCategories({ signal }), []);

  const resultLine = isFiltered
    ? `${pluralizeDishes(dishes.length)} match`
    : pluralizeDishes(allDishes.length);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-brand-ink sm:text-5xl">Our Menu</h1>
        <p className="mt-3 text-lg text-brand-ink/70">
          Soups and stews, rice and mains, street food, and breakfast — cooked fresh each day and
          served the way they are served at home.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search dishes, e.g. plantain" />
        <CategoryFilter categories={categories ?? []} selected={category} onSelect={setCategory} />
      </div>

      {loading ? (
        <Spinner className="py-24" label="Loading the menu…" />
      ) : error ? (
        <ErrorMessage
          className="mt-10"
          title="Could not load the menu"
          message={error}
          onRetry={retry}
        />
      ) : (
        <>
          <p className="mt-8 text-sm font-medium text-brand-ink/60">{resultLine}</p>
          <div className="mt-4">
            <DishGrid
              dishes={dishes}
              emptyMessage="Nothing on the menu matches that."
              onClearFilters={clearFilters}
            />
          </div>
        </>
      )}
    </div>
  );
}
