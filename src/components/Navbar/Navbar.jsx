// src/components/Navbar.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setRole(userDoc.exists() ? userDoc.data().role : "user");
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">
          <Link to="/">Ecommerce</Link>
        </h1>
        <div className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/products" onClick={() => setMenuOpen(false)}>Productos</Link></li>
          <li><Link to="/cart" onClick={() => setMenuOpen(false)}>Carrito ({cart.length})</Link></li>
          {role === "admin" && (
            <>
              <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>
              <li><Link to="/users" onClick={() => setMenuOpen(false)}>Usuarios</Link></li>
              <li><Link to="/agregarproducto" onClick={() => setMenuOpen(false)}>Agregar Producto</Link></li>
            </>
          )}
          <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Perfil</Link></li>
          {role && <li><button onClick={() => auth.signOut()}>Cerrar Sesión</button></li>}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;