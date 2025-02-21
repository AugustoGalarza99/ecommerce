import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        setOrders(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>Mis Pedidos</h2>
      {orders.length === 0 ? (
        <p>No hay pedidos</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.date} - {order.status} - {order.items.length} items
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Orders;