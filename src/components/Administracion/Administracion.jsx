// src/pages/AdminDashboard.jsx
import { Link } from "react-router-dom";
import "./Administracion.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <div className="admin-links">
        <Link to="/admin/products">Gestión de Productos</Link>
        <Link to="/admin/fotosbanner">Fotos banner</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
