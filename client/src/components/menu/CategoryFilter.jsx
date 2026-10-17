import { ALL_CATEGORIES } from '../../hooks/useMenu';

function pillClasses(isSelected) {
  return [
    'shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2',
    isSelected
      ? 'border-brand-red bg-brand-red text-white'
      : 'border-brand-ink/15 text-brand-ink/70 hover:border-brand-red/40 hover:text-brand-ink',
  ].join(' ');
}

/** Horizontal pill row: "All" plus every category from the API. */
export default function CategoryFilter({ categories = [], selected, onSelect }) {
  const options = [ALL_CATEGORIES, ...categories];

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          aria-pressed={selected === option}
          className={pillClasses(selected === option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
