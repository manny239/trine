import { Link } from 'react-router';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/format';

const FULFILLMENT_COPY = {
  pickup: 'Pickup — ready in about 20 minutes',
  delivery: 'Delivery — on its way to you shortly',
};

/** Shown after a successful POST /api/orders. */
export default function OrderConfirmation({ order }) {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-3xl bg-white p-8 text-center ring-1 ring-brand-ink/10">
      <div
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-4xl text-white"
      >
        ✓
      </div>

      <h2 className="mt-6 text-3xl font-extrabold text-brand-ink">Medaase! Order received</h2>
      <p className="mt-2 text-brand-ink/70">
        <span className="italic">Medaase</span> means thank you in Twi. The kitchen has your order.
      </p>

      <dl className="mt-8 divide-y divide-brand-ink/10 text-left">
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-sm font-semibold uppercase tracking-wide text-brand-ink/50">Order ID</dt>
          <dd className="break-all font-mono text-sm text-brand-ink">{order.orderId}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-sm font-semibold uppercase tracking-wide text-brand-ink/50">Total</dt>
          <dd className="text-2xl font-extrabold tabular-nums text-brand-red">
            {formatPrice(order.total)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-sm font-semibold uppercase tracking-wide text-brand-ink/50">Method</dt>
          <dd className="text-right text-brand-ink">
            {FULFILLMENT_COPY[order.fulfillment] ?? order.fulfillment}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-sm font-semibold uppercase tracking-wide text-brand-ink/50">Status</dt>
          <dd className="font-semibold capitalize text-brand-green">{order.status}</dd>
        </div>
      </dl>

      <div className="mt-8">
        <Button as={Link} to="/menu" size="lg">
          Back to menu
        </Button>
      </div>
    </div>
  );
}
