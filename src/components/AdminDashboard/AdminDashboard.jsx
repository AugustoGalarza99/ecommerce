// src/pages/AdminDashboard.jsx
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <div className="admin-links">
        <Link to="/admin/products">Gestión de Productos</Link>
        <Link to="/admin/products/new">Agregar Producto</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
