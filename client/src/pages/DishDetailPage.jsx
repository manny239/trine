import { useState } from 'react';
import { Link, useParams } from 'react-router';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import QuantityStepper from '../components/ui/QuantityStepper';
import DishImage from '../components/menu/DishImage';
import DishBadges from '../components/menu/DishBadges';
import { useFetch } from '../hooks/useFetch';
import { usePageTitle } from '../hooks/usePageTitle';
import { getDish } from '../api/client';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';

function AddToCartRow({ dish }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(dish, qty);
    setAdded(true);
  };

  return (
    <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-brand-ink/10">
      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper value={qty} onChange={setQty} />
        <Button size="lg" onClick={handleAdd} className="flex-1 sm:flex-none">
          Add to cart — {formatPrice(dish.price * qty)}
        </Button>
      </div>

      {added && (
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-brand-green">
          <span>Added ✓</span>
          <Link to="/cart" className="text-brand-red underline underline-offset-2 hover:text-brand-red/80">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}

function DishDetail({ dish }) {
  return (
    <article className="grid gap-10 lg:grid-cols-2">
      <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-brand-cream ring-1 ring-brand-ink/10">
        <DishImage dish={dish} className="h-full w-full" />
      </div>

      <div>
        <Badge color="gold">{dish.category}</Badge>

        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-brand-ink">{dish.name}</h1>
        {dish.localName && <p className="mt-1 text-lg italic text-brand-ink/50">“{dish.localName}”</p>}

        <p className="mt-4 text-2xl font-bold text-brand-red">{formatPrice(dish.price)}</p>

        <DishBadges dish={dish} className="mt-4" />

        <p className="mt-6 text-lg leading-relaxed text-brand-ink/75">{dish.description}</p>

        {dish.culturalNote && (
          <aside className="mt-6 rounded-r-xl border-l-4 border-brand-gold bg-brand-cream p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-gold">Cultural note</h2>
            <p className="mt-2 text-brand-ink/75">{dish.culturalNote}</p>
          </aside>
        )}

        {dish.accompaniments?.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-ink/50">Served with</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dish.accompaniments.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-brand-green/10 px-3 py-1 text-sm font-medium text-brand-green"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        <AddToCartRow dish={dish} />
      </div>
    </article>
  );
}

export default function DishDetailPage() {
  const { slug } = useParams();
  const { data: dish, loading, error, retry } = useFetch(
    ({ signal }) => getDish(slug, { signal }),
    [slug],
  );

  usePageTitle(dish?.name ?? 'Dish');

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        to="/menu"
        className="text-sm font-semibold text-brand-ink/60 underline underline-offset-2 hover:text-brand-red"
      >
        ← Back to menu
      </Link>

      {loading ? (
        <Spinner className="py-24" label="Loading dish…" />
      ) : error ? (
        <div className="mx-auto mt-10 max-w-lg">
          <ErrorMessage title="We couldn't find that dish" message={error} onRetry={retry} />
          <div className="mt-6 flex justify-center">
            <Button as={Link} to="/menu">
              Back to the menu
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <DishDetail dish={dish} />
        </div>
      )}
    </div>
  );
}
