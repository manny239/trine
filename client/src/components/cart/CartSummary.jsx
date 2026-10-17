import Button from '../ui/Button';
import { formatPrice } from '../../utils/format';

/** Totals panel; "Place order" opens the checkout form. */
export default function CartSummary({ subtotal, onClear, onCheckout, checkingOut = false }) {
  return (
    <aside className="rounded-2xl bg-white p-6 ring-1 ring-brand-ink/10">
      <h2 className="text-lg font-bold text-brand-ink">Order summary</h2>

      <div className="mt-4 flex items-baseline justify-between border-t border-brand-ink/10 pt-4">
        <span className="font-medium text-brand-ink/70">Subtotal</span>
        <span className="text-2xl font-extrabold tabular-nums text-brand-red">
          {formatPrice(subtotal)}
        </span>
      </div>
      <p className="mt-2 text-sm text-brand-ink/50">Taxes calculated at pickup.</p>

      {/* While the checkout form is open it owns the submit button. */}
      {!checkingOut && (
        <Button className="mt-6 w-full" size="lg" onClick={onCheckout}>
          Place order
        </Button>
      )}

      <Button variant="ghost" className="mt-2 w-full" onClick={onClear}>
        Clear cart
      </Button>
    </aside>
  );
}
