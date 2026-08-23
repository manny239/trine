const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold ' +
  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTS = {
  primary: 'bg-brand-red text-white hover:bg-brand-red/90',
  secondary: 'border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white',
  ghost: 'text-brand-ink hover:bg-brand-ink/5',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3 text-lg',
};

/**
 * Shared button. Render as another element (e.g. react-router's `Link`) with `as`.
 */
export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  type,
  ...props
}) {
  const classes = `${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${className}`;
  const buttonType = Component === 'button' ? (type ?? 'button') : type;

  return <Component className={classes} type={buttonType} {...props} />;
}
