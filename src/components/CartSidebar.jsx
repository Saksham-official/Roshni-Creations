import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { initiatePayment } from '../utils/payment';
import './CartSidebar.css';

const CartSidebar = ({ onNavigate }) => {
    const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => document.body.style.overflow = 'unset';
    }, [isCartOpen]);

    const handleCheckout = () => {
        if (cart.length === 0) return;

        initiatePayment({
            amount: getCartTotal(),
            description: `Bulk Purchase of ${cart.length} items`,
            items: cart.map(item => `${item.name} (x${item.quantity})`),
            onSuccess: () => {
                clearCart();
                setIsCartOpen(false);
            }
        });
    };

    return (
        <>
            {isCartOpen && <div className="cart-overlay animate-fade-in" onClick={() => setIsCartOpen(false)}></div>}
            
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
                </div>
                
                <div className="cart-items">
                    {!user ? (
                        <div className="empty-cart" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-maroon)' }}>Sign in required</h3>
                            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Please login or create an account to start adding beautiful pieces to your collection.</p>
                            <button className="btn btn-primary" onClick={() => { setIsCartOpen(false); onNavigate && onNavigate('auth'); }} style={{marginTop: '1.5rem', width: '100%'}}>
                                Login to Account
                            </button>
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <button className="btn btn-outline" onClick={() => setIsCartOpen(false)} style={{marginTop: '1rem'}}>Continue Shopping</button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div className="cart-item" key={item.product_id}>
                                <img src={item.images && item.images[0] ? item.images[0] : item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <h4 className="cart-item-title">{item.name}</h4>
                                    <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                                    
                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="cart-item-remove" onClick={() => removeFromCart(item.product_id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {user && cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Subtotal:</span>
                            <span className="cart-total-price">₹{getCartTotal().toLocaleString('en-IN')}</span>
                        </div>
                        <p className="cart-tax-note">Taxes & shipping calculated at checkout.</p>
                        <button className="btn btn-primary btn-full-width" onClick={handleCheckout}>
                            Checkout • ₹{getCartTotal().toLocaleString('en-IN')}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
