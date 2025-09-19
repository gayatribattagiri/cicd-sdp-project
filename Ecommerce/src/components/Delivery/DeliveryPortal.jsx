import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { motion } from "framer-motion";

const API_BASE = (import.meta.env.VITE_BASE_URL || "http://localhost:8080/api").replace(/\/$/, "");

export default function DeliveryPortal() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "null");
  
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
    if (!userInfo) return;
    setLoading(true);
    try {
      // show unassigned and assigned to this delivery user
      const allRes = await fetch(`${API_BASE}/orders`);
      const allOrders = await allRes.json();
      const filtered = allOrders.filter(
        (o) => !o.deliveryUserId || o.deliveryUserId === userInfo.user_id
      );
      setOrders(filtered);
    } finally {
      setLoading(false);
    }
  };

  const takeOrder = async (orderId) => {
    await fetch(`${API_BASE}/orders/${orderId}/assign/${userInfo.user_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delivery_user_address: userInfo.address || undefined })
    });
    fetchOrders();
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
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Delivery Portal</motion.h2>
        {loading && <p>Loading...</p>}
        <div style={{ display: "grid", gap: 16 }}>
          {orders.map((o) => (
            <motion.div key={o.id} className="order-card" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p><b>Order ID:</b> {o.id}</p>
                  <p><b>Total:</b> ₹{o.totalAmount}</p>
                  <p><b>Status:</b> {o.status}</p>
                  <p><b>Address:</b> {o.deliveryAddress || "-"}</p>
                  {o.deliveryUserAddress && (
                    <p><b>Delivery User Address:</b> {o.deliveryUserAddress}</p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {!o.deliveryUserId && (
                    <button onClick={() => takeOrder(o.id)}>Take Order</button>
                  )}
                  {o.deliveryUserId === userInfo?.user_id && o.status !== "DELIVERED" && (
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


