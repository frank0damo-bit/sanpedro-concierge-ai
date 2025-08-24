import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItemOption {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number; // This will now be the final, calculated price
  image_url?: string;
  quantity: number;
  options?: CartItemOption[]; // To store the selected customizations
  basePrice: number; // To store the original service price
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const localCart = window.localStorage.getItem('cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error writing cart to localStorage", error);
    }
  }, [cart]);

  const addToCart = (itemToAdd: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === itemToAdd.id);
      if (existingItemIndex > -1) {
        // For simplicity, we replace the item if it's added again with new options.
        // A more complex cart might increment quantity or handle options differently.
        const newCart = [...prevCart];
        newCart[existingItemIndex] = { ...itemToAdd, quantity: 1 };
        return newCart;
      } else {
        return [...prevCart, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
