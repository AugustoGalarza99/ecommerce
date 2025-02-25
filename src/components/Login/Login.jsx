import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaEnvelope } from "react-icons/fa";
import "./Login.css";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: "user",
          photoURL: user.photoURL || "",
          address: "",
          phone: "",
        });
      }

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/profile");
    } catch (err) {
      setError("Error al iniciar sesión: " + err.message);
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("user");
      setError("");
      navigate("/");
    }).catch(err => setError("Error al cerrar sesión: " + err.message));
  };

  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <div className="login-dropdown">
      {isLoggedIn ? (
        <div className="logged-in">
          <p>Bienvenido, {JSON.parse(localStorage.getItem("user")).displayName}</p>
          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
      ) : (
        <div className="login-options">
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleGoogleLogin} className="login-btn google">
            <FaGoogle /> Iniciar con Google
          </button>
          <button className="login-btn facebook" disabled>
            <FaFacebook /> Iniciar con Facebook
          </button>
          <button className="login-btn email" disabled>
            <FaEnvelope /> Recibir código por email
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;