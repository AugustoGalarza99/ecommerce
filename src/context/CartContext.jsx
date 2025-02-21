import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig"; // Importación correcta
import { doc, setDoc, getDoc } from "firebase/firestore";

// Crear y exportar el contexto
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      if (auth.currentUser) {
        const cartDoc = doc(db, "carts", auth.currentUser.uid);
        const docSnap = await getDoc(cartDoc);
        if (docSnap.exists()) {
          setCart(docSnap.data().items || []);
        }
      }
    };
    loadCart();
  }, []);

  const addToCart = async (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    if (auth.currentUser) {
      await setDoc(doc(db, "carts", auth.currentUser.uid), { items: newCart }, { merge: true });
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (auth.currentUser) {
      await setDoc(doc(db, "carts", auth.currentUser.uid), { items: [] }, { merge: true });
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);