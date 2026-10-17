import { useEffect, useMemo, useReducer } from 'react';
import { CartContext } from './cartContext';

const STORAGE_KEY = 'trine.cart';

/**
 * Cart lines keep a unit-price snapshot for display only. Checkout sends just
 * `{ id, qty }` — the server always reprices from menu.json.
 */
function toLine(dish, qty) {
  return {
    id: dish.id,
    slug: dish.slug,
    name: dish.name,
    price: dish.price,
    image: dish.image ?? null,
    qty,
  };
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { dish, qty } = action;
      const existing = state.items.find((item) => item.id === dish.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === dish.id ? { ...item, qty: item.qty + qty } : item,
          ),
        };
      }
      return { items: [...state.items, toLine(dish, qty)] };
    }
    case 'REMOVE':
      return { items: state.items.filter((item) => item.id !== action.id) };
    case 'SET_QTY': {
      const qty = Math.max(1, Math.trunc(action.qty) || 1);
      return {
        items: state.items.map((item) => (item.id === action.id ? { ...item, qty } : item)),
      };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

/** Read the saved cart, ignoring anything malformed. */
function loadCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed?.items) ? parsed.items : [];
    return {
      items: items
        .filter((item) => item && item.id && Number.isFinite(item.price))
        .map((item) => ({ ...item, qty: Math.max(1, Math.trunc(item.qty) || 1) })),
    };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable (private mode) — the cart still works in memory.
    }
  }, [state]);

  const value = useMemo(() => {
    const items = state.items;
    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.qty, 0),
      subtotal: Math.round(items.reduce((sum, item) => sum + item.price * item.qty, 0) * 100) / 100,
      addItem: (dish, qty = 1) => dispatch({ type: 'ADD', dish, qty: Math.max(1, Math.trunc(qty) || 1) }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
