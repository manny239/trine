import { Link } from 'react-router';
import DishImage from './DishImage';
import DishBadges from './DishBadges';
import { formatPrice } from '../../utils/format';

/** Menu tile — the whole card links through to the dish detail page. */
export default function DishCard({ dish }) {
  return (
    <Link
      to={`/menu/${dish.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-brand-ink/10 transition
                 hover:-translate-y-0.5 hover:shadow-lg hover:ring-brand-gold/40
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-brand-cream">
        <DishImage dish={dish} className="h-full w-full transition group-hover:scale-[1.03]" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold leading-tight text-brand-ink">{dish.name}</h3>
            {dish.localName && (
              <p className="text-sm italic text-brand-ink/50">“{dish.localName}”</p>
            )}
          </div>
          <p className="shrink-0 font-bold text-brand-red">{formatPrice(dish.price)}</p>
        </div>

        <p className="line-clamp-2 text-sm text-brand-ink/70">{dish.description}</p>

        <DishBadges dish={dish} className="mt-auto pt-2" />
      </div>
    </Link>
  );
}
