// src/context/CartContext.js

import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }]; // Set default quantity
    });
  };

  const removeFromCart = (item) => {
    setCartItems(prevItems => prevItems.filter(cartItem => cartItem.id !== item.id));
  };

  const addToWishlist = (item) => {
    setWishlistItems(prevItems => [...prevItems, item]);
  };

  const removeFromWishlist = (item) => {
    setWishlistItems(prevItems => prevItems.filter(wishlistItem => wishlistItem.id !== item.id));
  };

  const increaseQuantity = (item) => {
    setCartItems(prevItems => 
      prevItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const decreaseQuantity = (item) => {
    setCartItems(prevItems => 
      prevItems.map(cartItem =>
        cartItem.id === item.id && cartItem.quantity > 1
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        increaseQuantity,
        decreaseQuantity,
        clearCart // Add clearCart to context
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
