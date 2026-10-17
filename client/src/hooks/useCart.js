import { useContext } from 'react';
import { CartContext } from '../context/cartContext';

/** Access the cart: `{ items, itemCount, subtotal, addItem, removeItem, setQty, clearCart }`. */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside a CartProvider');
  return context;
}

export default useCart;
