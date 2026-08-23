import { Link } from 'react-router';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import DishGrid from '../components/menu/DishGrid';
import { useFetch } from '../hooks/useFetch';
import { getMenu } from '../api/client';

/** The dishes flagged `featured` in the menu data. */
function FeaturedDishes() {
  const { data, loading, error, retry } = useFetch(({ signal }) => getMenu(undefined, { signal }), []);
  const featured = (data ?? []).filter((dish) => dish.featured);

  if (loading) return <Spinner className="py-16" label="Loading featured dishes…" />;
  if (error) {
    return <ErrorMessage title="Could not load the menu" message={error} onRetry={retry} />;
  }

  return (
    <>
      <DishGrid dishes={featured} emptyMessage="No featured dishes right now." />
      <div className="mt-10 flex justify-center">
        <Button as={Link} to="/menu" size="lg">
          View full menu
        </Button>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <div>
      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
            Accra flavours, cooked fresh
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-brand-ink sm:text-6xl">
            Traditional Ghanaian food, <span className="text-brand-red">made the long way</span>.
          </h1>
          <p className="max-w-2xl text-lg text-brand-ink/75">
            Waakye steamed with sorghum leaves, jollof simmered until every grain turns red, banku
            pounded smooth beside grilled tilapia, and fufu served in a broth that has been on the
            fire since morning. Come hungry.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/menu" size="lg">
              See the menu
            </Button>
            <Button as={Link} to="/about" variant="secondary" size="lg">
              Our story
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-brand-ink">Featured dishes</h2>
          <p className="mt-2 text-brand-ink/70">
            The plates our regulars keep coming back for.
          </p>
        </header>
        <FeaturedDishes />
      </section>
    </div>
  );
}
