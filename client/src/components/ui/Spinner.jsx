const SIZES = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-3', lg: 'h-12 w-12 border-4' };

/** Centered loading spinner with an accessible label. */
export default function Spinner({ size = 'md', label = 'Loading…', className = '' }) {
  return (
    <div role="status" className={`flex flex-col items-center justify-center gap-3 py-6 ${className}`}>
      <span
        className={`${SIZES[size] ?? SIZES.md} animate-spin rounded-full border-brand-gold border-t-transparent`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
