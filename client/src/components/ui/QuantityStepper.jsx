const BUTTON =
  'flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-ink/15 text-lg ' +
  'font-bold leading-none text-brand-ink transition-colors hover:border-brand-red hover:text-brand-red ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ' +
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand-ink/15 disabled:hover:text-brand-ink';

/** − / value / + control, shared by the detail page and cart lines. */
export default function QuantityStepper({ value, onChange, min = 1, label = 'Quantity' }) {
  return (
    <div className="flex items-center gap-3" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={BUTTON}
      >
        <span aria-hidden="true">−</span>
      </button>
      <span aria-live="polite" className="min-w-6 text-center font-semibold tabular-nums text-brand-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        className={BUTTON}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
