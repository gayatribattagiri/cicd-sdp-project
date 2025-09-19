import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { motion } from "framer-motion";
import "./Cart.css";

class Cart extends Component {
  state = {
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    isCheckingOut: false,
  };

  updateCart = (updatedCart) => {
    this.setState({ cart: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  increment = (id) => {
    const updatedCart = this.state.cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    this.updateCart(updatedCart);
  };

  decrement = (id) => {
    const updatedCart = this.state.cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    this.updateCart(updatedCart);
  };

  removeItem = (id) => {
    const updatedCart = this.state.cart.filter((item) => item.id !== id);
    this.updateCart(updatedCart);
  };

  getTotal = () => {
    return this.state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  handleCheckout = () => {
    const userInfo = JSON.parse(localStorage.getItem("user_info") || "null");
    if (!userInfo) {
      alert("Please login again.");
      return;
    }
    const RAW_BASE = import.meta.env.VITE_BASE_URL || "http://localhost:8080/api";
    const API_BASE = RAW_BASE.replace(/\/$/, "");
    const itemsJson = JSON.stringify(this.state.cart);
    const total = this.getTotal();
    this.setState({ isCheckingOut: true });
    fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        items_json: itemsJson,
        total_amount: total,
        delivery_address: userInfo.address || "",
      }),
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.message || "Failed to place order");
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        this.setState({ cart: [], isCheckingOut: false });
      })
      .catch((e) => {
        alert(e.message);
        this.setState({ isCheckingOut: false });
      });
  };

  render() {
    const { cart, isCheckingOut } = this.state;

    return (
      <>
        <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />
        <motion.div 
          className="cart-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="cart-header">
            <h2>Your Shopping Cart</h2>
            <p>{cart.reduce((acc, item) => acc + item.quantity, 0)} items</p>
          </div>

          {cart.length === 0 ? (
            <motion.div 
              className="empty-cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet</p>
              <Link to="/">
                <motion.button
                  className="shop-now-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Now
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <motion.div 
                    className="cart-item"
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="item-image">
                      <img src={item.productImage || item.product_image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3 className="name">{item.name}</h3>
                      <p className="category">{item.category}</p>
                      <p className="price">₹{item.price}</p>
                      
                      <div className="quantity-control">
                        <motion.button 
                          onClick={() => this.decrement(item.id)}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        <span>{item.quantity}</span>
                        <motion.button 
                          onClick={() => this.increment(item.id)}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                    <div className="item-actions">
                      <motion.button
                        className="remove-btn"
                        onClick={() => this.removeItem(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                      <p className="item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="cart-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{this.getTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{this.getTotal().toFixed(2)}</span>
                </div>

                <motion.button
                  className="checkout-btn"
                  onClick={this.handleCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <span className="spinner"></span>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </motion.button>

                <Link to="/" className="continue-shopping">
                  ← Continue Shopping
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </>
    );
  }
}

export default Cart;