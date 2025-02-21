import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css"

function Profile() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [profileData, setProfileData] = useState({ address: "", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdTokenResult();
        setRole(token.claims.role);

        const userDoc = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
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
      alert("Perfil actualizado");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <h2>Perfil de {user.displayName}</h2>
      <p>Email: {user.email}</p>
      <p>Rol: {role}</p>
      <img src={user.photoURL} alt="Foto de perfil" className="profile-pic" />
      <input
        type="text"
        placeholder="Dirección"
        value={profileData.address}
        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={profileData.phone}
        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
      />
      <button onClick={handleSaveProfile}>Guardar Perfil</button>
      {role === "admin" && (
        <button onClick={() => navigate("/admin")}>Panel de Administración</button>
      )}
    </div>
  );
}

export default Profile;