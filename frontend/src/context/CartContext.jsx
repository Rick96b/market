import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getJsonStorageItem, setStorageItem } from '../services/storage.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => getJsonStorageItem('cart', []));

  useEffect(() => {
    setStorageItem('cart', JSON.stringify(items));
  }, [items]);

  function addToCart(product, quantity = 1) {
    const amount = Math.max(1, Number(quantity) || 1);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + amount }
            : item
        );
      }

      return [...currentItems, { product, quantity: amount }];
    });
  }

  function updateQuantity(productId, quantity) {
    const nextQuantity = Number(quantity);

    if (nextQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.product.id === productId ? { ...item, quantity: nextQuantity } : item))
    );
  }

  function removeFromCart(productId) {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      total,
      count,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [items, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
