import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cart, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calcular total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Generar mensaje para WhatsApp
  const handleCheckout = () => {
    if (cart.length === 0) return;

    const mensaje = encodeURIComponent(
      `¡Hola! Quiero comprar estos productos:\n\n` +
      cart
        .map((item) => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`)
        .join("\n") +
      `\n\nTotal: $${total.toFixed(2)}`
    );

    const numeroWhatsApp = "5493572438785"; // Reemplaza con el número de WhatsApp de la tienda
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, "_blank");

    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container empty">
        <p>Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Tu Carrito</h2>
      <ul className="cart-list">
        {cart.map((item, index) => (
          <li key={index} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-img" />
            <div className="cart-details">
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)} x {item.quantity}</p>
              <p className="total-item">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button onClick={() => removeFromCart(item)} className="remove-btn">✖</button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button onClick={handleCheckout} className="checkout-btn">Finalizar Compra por WhatsApp</button>
      </div>
    </div>
  );
}

export default Cart;
