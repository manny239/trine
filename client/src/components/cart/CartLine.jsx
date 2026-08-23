import { Link } from 'react-router';
import QuantityStepper from '../ui/QuantityStepper';
import DishImage from '../menu/DishImage';
import { formatPrice } from '../../utils/format';

/** One cart row: thumbnail, name, unit price, stepper, line total, remove. */
export default function CartLine({ item, onQtyChange, onRemove }) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-5 sm:flex-nowrap">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-cream ring-1 ring-brand-ink/10">
        <DishImage dish={item} className="h-full w-full" />
      </div>

      <div className="min-w-0 flex-1">
        <Link
          to={`/menu/${item.slug}`}
          className="font-bold text-brand-ink underline-offset-2 hover:text-brand-red hover:underline"
        >
          {item.name}
        </Link>
        <p className="text-sm text-brand-ink/60">{formatPrice(item.price)} each</p>
      </div>

      <QuantityStepper
        value={item.qty}
        onChange={(qty) => onQtyChange(item.id, qty)}
        label={`Quantity for ${item.name}`}
      />

      <p className="w-20 shrink-0 text-right font-bold tabular-nums text-brand-ink">
        {formatPrice(item.price * item.qty)}
      </p>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name} from cart`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brand-ink/40
                   transition-colors hover:bg-brand-red/10 hover:text-brand-red
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      >
        <span aria-hidden="true" className="text-xl leading-none">×</span>
      </button>
    </li>
  );
}
