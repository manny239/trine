import { Link } from 'react-router';
import Button from '../components/ui/Button';
import CartLine from '../components/cart/CartLine';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../hooks/useCart';
import { pluralizeDishes } from '../utils/format';

function EmptyCart() {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-brand-ink/20 bg-white/50 p-12 text-center">
      <p className="text-lg font-semibold text-brand-ink">Your cart is empty</p>
      <p className="mt-2 text-brand-ink/60">
        Nothing here yet — the jollof is not going to order itself.
      </p>
      <div className="mt-6 flex justify-center">
        <Button as={Link} to="/menu">
          Browse the menu
        </Button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, itemCount, subtotal, setQty, removeItem, clearCart } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-brand-ink">Your Cart</h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <p className="mt-3 text-brand-ink/60">
            {pluralizeDishes(itemCount)} ready to go.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
            <ul className="divide-y divide-brand-ink/10 rounded-2xl bg-white px-6 ring-1 ring-brand-ink/10">
              {items.map((item) => (
                <CartLine key={item.id} item={item} onQtyChange={setQty} onRemove={removeItem} />
              ))}
            </ul>

            <CartSummary subtotal={subtotal} onClear={clearCart} />
          </div>
        </>
      )}
    </div>
  );
}
