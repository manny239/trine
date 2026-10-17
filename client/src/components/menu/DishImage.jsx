import { useState } from 'react';

/**
 * Dish photo with a warm gradient fallback — used when the dish has no image
 * or the remote image fails to load.
 */
export default function DishImage({ dish, className = '' }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !dish.image || failed;

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={`${dish.name} — no photo available`}
        className={`flex items-center justify-center bg-gradient-to-br from-brand-gold to-brand-red ${className}`}
      >
        <span className="text-6xl font-extrabold text-white/90 drop-shadow-sm">
          {dish.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={dish.image}
      alt={dish.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
