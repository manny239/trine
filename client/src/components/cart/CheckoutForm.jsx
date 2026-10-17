import { useState } from 'react';
import Button from '../ui/Button';
import { placeOrder } from '../../api/client';
import ErrorMessage from '../ui/ErrorMessage';
import { formatPrice } from '../../utils/format';

const FULFILLMENT_OPTIONS = [
  { value: 'pickup', label: 'Pickup', hint: 'Ready in ~20 minutes' },
  { value: 'delivery', label: 'Delivery', hint: 'Within Osu and Labone' },
];

const FIELD =
  'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/40 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40';

/** Validate on submit; returns a `{ field: message }` map. */
function validate({ name, phone }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Please tell us your name.';
  if (!phone.trim()) errors.phone = 'We need a phone number to reach you.';
  return errors;
}

/**
 * Collects customer details and places the order. Only `{ id, qty }` is sent —
 * the server reprices every line from menu.json.
 */
export default function CheckoutForm({ items, subtotal, onSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fulfillment, setFulfillment] = useState('pickup');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate({ name, phone });
    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      const order = await placeOrder({
        customer: { name: name.trim(), phone: phone.trim(), fulfillment },
        items: items.map(({ id, qty }) => ({ id, qty })),
      });
      onSuccess({ ...order, fulfillment });
    } catch (error) {
      // Cart is left untouched so the customer can simply try again.
      setSubmitError(error.message || 'Could not place the order.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-white p-6 ring-1 ring-brand-ink/10">
      <h2 className="text-lg font-bold text-brand-ink">Your details</h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="checkout-name" className="block text-sm font-semibold text-brand-ink">
            Name
          </label>
          <input
            id="checkout-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'checkout-name-error' : undefined}
            placeholder="Ama Mensah"
            className={`${FIELD} mt-1.5 ${errors.name ? 'border-brand-red' : 'border-brand-ink/15'}`}
          />
          {errors.name && (
            <p id="checkout-name-error" className="mt-1.5 text-sm font-medium text-brand-red">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="checkout-phone" className="block text-sm font-semibold text-brand-ink">
            Phone
          </label>
          <input
            id="checkout-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
            placeholder="024 000 0000"
            className={`${FIELD} mt-1.5 ${errors.phone ? 'border-brand-red' : 'border-brand-ink/15'}`}
          />
          {errors.phone && (
            <p id="checkout-phone-error" className="mt-1.5 text-sm font-medium text-brand-red">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-brand-ink">How would you like it?</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {FULFILLMENT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                fulfillment === option.value
                  ? 'border-brand-red bg-brand-red/5'
                  : 'border-brand-ink/15 hover:border-brand-red/40'
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                value={option.value}
                checked={fulfillment === option.value}
                onChange={() => setFulfillment(option.value)}
                className="mt-1 accent-[var(--color-brand-red)]"
              />
              <span>
                <span className="block font-semibold text-brand-ink">{option.label}</span>
                <span className="block text-sm text-brand-ink/60">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {submitError && (
        <ErrorMessage className="mt-6" title="Order not placed" message={submitError} />
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
        <Button type="submit" size="lg" disabled={pending} className="sm:flex-1">
          {pending ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
              />
              Placing order…
            </>
          ) : (
            `Place order — ${formatPrice(subtotal)}`
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
          Back to cart
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-brand-ink/50">
        Your total is confirmed by the kitchen when the order is received.
      </p>
    </form>
  );
}
