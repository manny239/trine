/** Controlled search input with a clear button. */
export default function SearchBar({ value, onChange, placeholder = 'Search dishes…', id = 'dish-search' }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Search dishes
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-ink/40"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="M13.5 13.5 18 18" strokeLinecap="round" />
      </svg>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border-2 border-brand-ink/15 bg-white py-3 pl-12 pr-12 text-brand-ink
                   placeholder:text-brand-ink/40 focus:border-brand-gold focus:outline-none
                   focus-visible:ring-2 focus-visible:ring-brand-gold/40
                   [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center
                     rounded-full text-brand-ink/50 transition-colors hover:bg-brand-ink/5 hover:text-brand-ink
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        >
          <span aria-hidden="true" className="text-lg leading-none">×</span>
        </button>
      )}
    </div>
  );
}
