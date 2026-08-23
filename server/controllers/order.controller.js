import { findDish } from '../data/menu.store.js';

/** In-memory order store — resets whenever the server restarts. */
const orders = new Map();
let orderCounter = 0;

const FULFILLMENT_OPTIONS = ['pickup', 'delivery'];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const round2 = (value) => Math.round(value * 100) / 100;

function nextOrderId() {
  orderCounter += 1;
  return `ord_${Date.now()}_${orderCounter}`;
}

/**
 * Validate the request body and resolve every line against the menu.
 * Returns `{ error }` with a specific message, or `{ customer, items, total }`.
 * Prices always come from the menu — never from the client.
 */
function buildOrder(body) {
  const { customer, items } = body ?? {};

  if (!customer || typeof customer !== 'object') {
    return { error: 'Customer details are required' };
  }
  if (!isNonEmptyString(customer.name)) {
    return { error: 'Customer name is required' };
  }
  if (!isNonEmptyString(customer.phone)) {
    return { error: 'Customer phone is required' };
  }
  if (!FULFILLMENT_OPTIONS.includes(customer.fulfillment)) {
    return { error: 'Fulfillment must be either "pickup" or "delivery"' };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'Order must contain at least one item' };
  }

  const lines = [];
  for (const line of items) {
    if (!line || typeof line !== 'object') {
      return { error: 'Each order item must be an object with an id and a qty' };
    }
    if (!isNonEmptyString(line.id)) {
      return { error: 'Each order item must have an id' };
    }
    if (!Number.isInteger(line.qty) || line.qty < 1) {
      return { error: `Quantity for item "${line.id}" must be a whole number of at least 1` };
    }

    const dish = findDish(line.id);
    if (!dish || dish.id !== line.id) {
      return { error: `Unknown item id: ${line.id}` };
    }

    lines.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      qty: line.qty,
      subtotal: round2(dish.price * line.qty),
    });
  }

  const total = round2(lines.reduce((sum, line) => sum + line.price * line.qty, 0));

  return {
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      fulfillment: customer.fulfillment,
    },
    items: lines,
    total,
  };
}

// POST /api/orders
export function createOrder(req, res) {
  const result = buildOrder(req.body);
  if (result.error) return res.status(400).json({ error: result.error });

  const order = {
    orderId: nextOrderId(),
    customer: result.customer,
    items: result.items,
    total: result.total,
    status: 'received',
    createdAt: new Date().toISOString(),
  };
  orders.set(order.orderId, order);

  res.status(201).json({ orderId: order.orderId, total: order.total, status: order.status });
}

// GET /api/orders/:id
export function getOrder(req, res) {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
}
