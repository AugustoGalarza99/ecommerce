// src/components/Admin.js
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      setOrders(ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const usersSnapshot = await getDocs(collection(db, "users"));
      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>
      <h3>Pedidos</h3>
      {orders.length === 0 ? (
        <p>No hay pedidos</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.userId} - {order.date} - {order.status}
            </li>
          ))}
        </ul>
      )}
      <h3>Usuarios</h3>
      {users.length === 0 ? (
        <p>No hay usuarios</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.displayName} - {user.email} - {user.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;