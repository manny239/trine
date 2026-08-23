import { Link } from 'react-router';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-brand-gold">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-brand-ink">This page is not on the menu</h1>
      <p className="mt-3 text-brand-ink/70">
        The page you are looking for does not exist. Try the menu instead.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button as={Link} to="/">
          Back home
        </Button>
        <Button as={Link} to="/menu" variant="secondary">
          See the menu
        </Button>
      </div>
    </div>
  );
}
