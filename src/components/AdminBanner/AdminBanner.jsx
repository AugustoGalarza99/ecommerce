import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import "./AdminBanner.css";

function AdminBanner() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [banners, setBanners] = useState([]);
  const [draggingId, setDraggingId] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      const querySnapshot = await getDocs(collection(db, "banners"));
      const bannerData = querySnapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        order: doc.data().order || 0 // Add default order if not present
      }));
      // Sort by order
      setBanners(bannerData.sort((a, b) => a.order - b.order));
    };
    fetchBanners();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Selecciona una imagen");

    const storageRef = ref(storage, `banners/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    // Add new banner with highest order number
    const maxOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order)) : 0;
    const newBanner = {
      image: imageUrl,
      order: maxOrder + 1
    };

    const docRef = await addDoc(collection(db, "banners"), newBanner);
    setBanners([...banners, { id: docRef.id, ...newBanner }]);
    
    // Clear inputs
    setImage(null);
    setPreviewUrl(null);
    document.querySelector('input[type="file"]').value = '';
  };

  const handleDelete = async (id, imageUrl) => {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    await deleteDoc(doc(db, "banners", id));
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  const handleDragStart = (e, id) => {
    setDraggingId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetId) => {
    e.preventDefault();
    if (draggingId === targetId) return;

    const newBanners = [...banners];
    const draggedItem = newBanners.find(b => b.id === draggingId);
    const targetItem = newBanners.find(b => b.id === targetId);
    
    // Swap orders
    const draggedOrder = draggedItem.order;
    draggedItem.order = targetItem.order;
    targetItem.order = draggedOrder;

    // Update in Firestore
    await updateDoc(doc(db, "banners", draggedItem.id), { order: draggedItem.order });
    await updateDoc(doc(db, "banners", targetItem.id), { order: targetItem.order });

    // Sort and update state
    setBanners(newBanners.sort((a, b) => a.order - b.order));
    setDraggingId(null);
  };

  return (
    <div className="admin-banner">
      <h2>Administrar Banners</h2>
      <div className="upload-section">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
        {previewUrl && (
          <div className="preview-container">
            <img src={previewUrl} alt="Preview" className="image-preview" />
          </div>
        )}
        <button onClick={handleUpload}>Subir Imagen</button>
      </div>

      <div className="banners-list">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="banner-item"
            draggable
            onDragStart={(e) => handleDragStart(e, banner.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, banner.id)}
          >
            <img src={banner.image} alt="Banner" />
            <span>Orden: {banner.order}</span>
            <button onClick={() => handleDelete(banner.id, banner.image)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBanner;