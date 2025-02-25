import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { doc, addDoc, collection } from "firebase/firestore";
import "./Cart.css";

function Cart() {
  const { cart, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    const order = {
      userId: auth.currentUser.uid,
      items: cart,
      date: new Date().toISOString(),
      status: "pending",
    };

    try {
      await addDoc(collection(db, "orders"), order);
      clearCart();
      alert("Compra realizada con éxito");
      navigate("/orders");
    } catch (err) {
      console.error("Error al finalizar compra:", err);
      alert("Error al realizar la compra");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-dropdown empty">
        <p>Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="cart-dropdown">
      <ul>
        {cart.map((item, index) => (
          <li key={index} className="cart-item">
            <span>{item.name} - ${item.price.toFixed(2)}</span>
            <button onClick={() => removeFromCart(item)} className="remove-btn">Eliminar</button>
          </li>
        ))}
      </ul>
      <div className="cart-actions">
        <button onClick={handleCheckout} className="checkout-btn">Finalizar Compra</button>
      </div>
    </div>
  );
}

export default Cart;