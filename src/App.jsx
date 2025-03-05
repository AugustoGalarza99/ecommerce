// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/Administracion/Administracion";
import ProductList from "./components/ProductList/ProductList";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import Productos from "./components/Productos/Productos";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Navbar from "./components/Navbar/Navbar";
import { CartProvider } from "./context/CartContext";

import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Cart from "./components/Cart/Cart";
import Orders from "./components/Orders/Orders";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminBanner from "./components/AdminBanner/AdminBanner";



function App() {
  return (
    <CartProvider>
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/fotosbanner" element={<AdminBanner />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/*<Route path="/cart" element={<Cart />} />*/}

        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
