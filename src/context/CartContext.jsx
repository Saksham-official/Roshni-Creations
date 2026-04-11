import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('roshni_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('roshni_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart(prevCart => prevCart.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const getCartCount = () => cart.reduce((acc, item) => acc + item.quantity, 0);
  const getCartTotal = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        getCartCount, 
        getCartTotal,
        isCartOpen,
        setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
