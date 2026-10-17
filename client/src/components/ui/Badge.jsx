const COLORS = {
  red: 'bg-brand-red/10 text-brand-red ring-brand-red/20',
  gold: 'bg-brand-gold/15 text-brand-ink ring-brand-gold/40',
  green: 'bg-brand-green/10 text-brand-green ring-brand-green/20',
  neutral: 'bg-brand-ink/5 text-brand-ink/70 ring-brand-ink/10',
};

/** Small pill label — used for vegan / spicy / popular markers. */
export default function Badge({ color = 'neutral', className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        COLORS[color] ?? COLORS.neutral
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
