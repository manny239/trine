import { Link } from 'react-router';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useFetch } from '../hooks/useFetch';
import { getHealth } from '../api/client';

/**
 * Kitchen status strip — a live call through the Vite proxy to the Express API.
 * Phase 3 replaces this section with real featured dishes.
 */
function KitchenStatus() {
  const { data, loading, error, retry } = useFetch(({ signal }) => getHealth({ signal }), []);

  if (loading) return <Spinner label="Checking whether the kitchen is open…" />;
  if (error) {
    return <ErrorMessage title="Kitchen unreachable" message={error} onRetry={retry} />;
  }

  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-brand-green/20 bg-brand-green/5 px-6 py-4">
      <span className="h-2.5 w-2.5 rounded-full bg-brand-green" aria-hidden="true" />
      <p className="font-semibold text-brand-green">
        {data?.ok ? 'Kitchen is open — menu is live' : 'Kitchen responded, but something looks off'}
      </p>
    </div>
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
        <KitchenStatus />
      </section>
    </div>
  );
}
