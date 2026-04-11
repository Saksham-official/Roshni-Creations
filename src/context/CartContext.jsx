import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data))
        .catch(console.error);
    } else {
      setCart([]);
    }
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      setIsCartOpen(true);
      return;
    }

    const cartItem = {
      user_id: user.id,
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images ? product.images[0] : null
    };

    try {
      await fetch('http://localhost:8000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItem)
      });
      
      // Optimistic update
      setCart(prevCart => {
        const existing = prevCart.find(item => item.product_id === product.id);
        if (existing) {
          return prevCart.map(item =>
            item.product_id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prevCart, cartItem];
      });
      setIsCartOpen(true);
      
      fetch('/api/cart-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, productName: product.name })
      }).catch(() => {});
      
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (id) => {
    if (!user) return;
    try {
      await fetch(`http://localhost:8000/cart/${user.id}/${id}`, { method: 'DELETE' });
      setCart(prev => prev.filter(item => item.product_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!user) return;
    if (quantity < 1) return removeFromCart(id);
    
    try {
      await fetch(`http://localhost:8000/cart/${user.id}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      setCart(prev => prev.map(item => item.product_id === id ? { ...item, quantity } : item));
    } catch (err) {
      console.error(err);
    }
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
