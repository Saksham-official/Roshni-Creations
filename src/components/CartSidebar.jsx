import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
};

const CartSidebar = () => {
    const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => document.body.style.overflow = 'unset';
    }, [isCartOpen]);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const res = await loadRazorpayScript();
        if (!res) {
          alert("Payment gateway failed to load.");
          return;
        }

        const options = {
          key: "rzp_test_Sc7NXcTnAZCMkn",
          amount: getCartTotal() * 100,
          currency: "INR",
          name: "Roshni Creations",
          description: `Bulk Purchase of ${cart.length} items`,
          image: "https://i.imgur.com/3g7nmJC.png",
          handler: async function (response) {
            // Trigger Confirmation Email
            try {
              await fetch('/api/send-confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: 'judge@hackathon.com',
                  paymentId: response.razorpay_payment_id,
                  orderDetails: {
                    items: cart.map(item => `${item.name} (x${item.quantity})`),
                    price: getCartTotal()
                  }
                })
              });
            } catch (err) {
              console.error('Email failed');
            }

            alert(`Order Placed! ID: ${response.razorpay_payment_id}`);
            clearCart();
            setIsCartOpen(false);
          },
          prefill: {
            name: "Hackathon Judge",
            email: "judge@hackathon.com",
            contact: "9999999999",
          },
          theme: { color: "#D1B88A" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
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
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <button className="btn btn-outline" onClick={() => setIsCartOpen(false)} style={{marginTop: '1rem'}}>Continue Shopping</button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <img src={item.images && item.images[0] ? item.images[0] : item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <h4 className="cart-item-title">{item.name}</h4>
                                    <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                                    
                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
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
