import { NavLink } from 'react-router';
import { useCart } from '../../hooks/useCart';

/** Navbar cart entry with a live item-count badge. */
export default function CartLink({ onNavigate }) {
  const { itemCount } = useCart();

  return (
    <NavLink
      to="/cart"
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
          isActive ? 'bg-brand-red text-white' : 'text-brand-ink/70 hover:bg-brand-ink/5 hover:text-brand-ink',
        ].join(' ')
      }
    >
      <span aria-hidden="true">🛒</span>
      <span>Cart</span>
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full
                     bg-brand-gold px-1.5 text-xs font-bold text-brand-ink"
        >
          {itemCount}
        </span>
      )}
      <span className="sr-only">
        {itemCount === 0 ? 'Cart is empty' : `${itemCount} item${itemCount === 1 ? '' : 's'} in cart`}
      </span>
    </NavLink>
  );
}
