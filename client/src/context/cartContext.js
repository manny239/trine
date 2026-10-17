import { createContext } from 'react';

/** Shared cart context object — kept out of the provider file so Fast Refresh works. */
export const CartContext = createContext(null);
