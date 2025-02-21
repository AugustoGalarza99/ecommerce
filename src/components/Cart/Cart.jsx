import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { doc, addDoc, collection } from "firebase/firestore";

function Cart() {
  const { cart, clearCart } = useCart();
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

    await addDoc(collection(db, "orders"), order);
    clearCart();
    alert("Compra realizada con éxito");
    navigate("/orders");
  };

  return (
    <div className="cart-container">
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>{item.name} - ${item.price}</li>
            ))}
          </ul>
          <button onClick={handleCheckout}>Finalizar Compra</button>
        </>
      )}
    </div>
  );
}

export default Cart;