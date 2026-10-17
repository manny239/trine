import DishCard from './DishCard';

/** Responsive grid of dishes, with an empty state when nothing matches. */
export default function DishGrid({ dishes, emptyMessage = 'No dishes found.', onClearFilters }) {
  if (!dishes?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-ink/20 bg-white/50 p-12 text-center">
        <p className="text-lg font-semibold text-brand-ink">{emptyMessage}</p>
        <p className="mt-2 text-sm text-brand-ink/60">
          Try a different search, or{' '}
          {onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="font-semibold text-brand-red underline underline-offset-2 hover:text-brand-red/80"
            >
              clear the filters
            </button>
          ) : (
            'clear the filters'
          )}
          .
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
