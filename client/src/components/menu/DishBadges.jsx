import Badge from '../ui/Badge';

/** Vegan / spice / popular markers derived from the dish record. */
export default function DishBadges({ dish, className = '' }) {
  const isPopular = dish.tags?.includes('popular');
  const hasAny = dish.isVegan || dish.spicyLevel > 0 || isPopular;
  if (!hasAny) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {dish.isVegan && <Badge color="green">Vegan</Badge>}
      {dish.spicyLevel > 0 && (
        <Badge color="red" aria-label={`Spice level ${dish.spicyLevel} of 3`}>
          <span aria-hidden="true">{'🌶'.repeat(dish.spicyLevel)}</span>
        </Badge>
      )}
      {isPopular && <Badge color="gold">Popular</Badge>}
    </div>
  );
}
