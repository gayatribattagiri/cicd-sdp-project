import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "");

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get cart count from localStorage
  const getCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((acc, item) => acc + item.quantity, 0);
    } catch {
      return 0;
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const markDelivered = async (orderId) => {
    await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DELIVERED" }),
    });
    fetchOrders();
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <>
      <Navbar cartCount={getCartCount()} />
      <div style={{ padding: 20 }}>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Admin Orders</motion.h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ display: "grid", gap: 16 }}>
          {orders.map((o) => (
            <motion.div key={o.id} className="order-card" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p><b>Order ID:</b> {o.id}</p>
                  <p><b>User:</b> {o.userId}</p>
                  <p><b>Total:</b> ₹{o.totalAmount}</p>
                  <p><b>Status:</b> {o.status}</p>
                  <p><b>Payment:</b> {o.paymentStatus}</p>
                  <p><b>Address:</b> {o.deliveryAddress || "-"}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {o.status !== "DELIVERED" && (
                    <button onClick={() => markDelivered(o.id)}>Mark Delivered</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}


