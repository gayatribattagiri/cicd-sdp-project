import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import Home from "./components/Home/Home";
import Products from "./components/AdminPanel/Products/Products";
import Categories from "./components/AdminPanel/Categories/Categories";
import Cart from "./components/Cart/Cart"; // ✅ import Cart
import AdminOrders from "./components/AdminPanel/Orders/AdminOrders";
import DeliveryPortal from "./components/Delivery/DeliveryPortal";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Categories />
            </ProtectedRoute>
          }
        />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Home (Protected) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Cart (Protected) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Delivery Portal (Protected) */}
        <Route
          path="/delivery"
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <DeliveryPortal />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
