// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/adminDashboard/adminDashboard";
import ProductList from "./components/ProductList/ProductList";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import ProductListCliente from "./components/ProducListCliente/ProductListCliente";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Navbar from "./components/Navbar/Navbar";
import { CartProvider } from "./context/CartContext";
import AgregarProducto from "./components/AgregarProducto/AgregarProducto";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Cart from "./components/Cart/Cart";
import Orders from "./components/Orders/Orders";
import Admin from "./components/Admin/Admin";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";


function App() {
  return (
    <CartProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/agregarproducto" element={<AgregarProducto />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListCliente />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/*<Route path="/cart" element={<Cart />} />*/}

        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admins" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>}/>
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
