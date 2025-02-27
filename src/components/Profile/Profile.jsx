import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    address: "",
    phone: "",
    zipCode: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDoc = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setProfileData((prev) => ({
            ...prev,
            ...docSnap.data(),
          }));
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSaveProfile = async () => {
    if (user) {
      await setDoc(doc(db, "users", user.uid), profileData, { merge: true });
      alert("Perfil actualizado correctamente");
    }
  };

  // Si el usuario no tiene foto, genera una imagen con su inicial
  const getProfilePicture = () => {
    if (user?.photoURL) {
      return user.photoURL;
    } else if (user?.displayName) {
      // Generar imagen con inicial
      const firstLetter = user.displayName.charAt(0).toUpperCase();
      return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=128`;
    }
    return "/default-profile.png"; // Imagen local de respaldo
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      <div className="profile-card">
        <img src={getProfilePicture()} className="profile-pic" />
        <p className="email-text">{user.email}</p>

        <div className="input-group">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Dirección</label>
          <input
            type="text"
            placeholder="Dirección"
            value={profileData.address}
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Teléfono</label>
          <input
            type="text"
            placeholder="Teléfono"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Código Postal</label>
          <input
            type="text"
            placeholder="Código Postal"
            value={profileData.zipCode}
            onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
          />
        </div>

        <button className="save-button" onClick={handleSaveProfile}>
          Guardar Perfil
        </button>
      </div>
    </div>
  );
}

export default Profile;
