// src/contexts/CartContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItemOption {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  quantity: number;
  options?: CartItemOption[];
  basePrice: number;
  // Add bookingDetails to the cart item interface
  bookingDetails?: Record<string, any>; 
}

interface CartContextType {
  cart: CartItem[];
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  getItemCount: () => number;
  getTotalPrice: () => number;
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
      // For simplicity, this will overwrite an existing item with the same ID.
      // A more complex implementation could handle merging details.
      const existingItemIndex = prevCart.findIndex(item => item.id === itemToAdd.id);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = { ...itemToAdd, quantity: 1 };
        return newCart;
      } else {
        return [...prevCart, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const getItemCount = () => cartCount;
  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      items: cart,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart, 
      cartCount,
      getItemCount,
      getTotalPrice
    }}>
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
