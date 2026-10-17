import Button from './Button';

/** Friendly error panel with an optional retry action. */
export default function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`rounded-2xl border border-brand-red/25 bg-brand-red/5 p-6 text-center ${className}`}
    >
      <p className="text-lg font-semibold text-brand-red">{title}</p>
      {message && <p className="mt-2 text-sm text-brand-ink/70">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
