import React, { useState, useEffect } from "react";
import "./ProductForm.css";

function ProductForm({ onSubmit, initialData, categories, onClose, loading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    stock: initialData?.stock || "",
    category: initialData?.category || "",
    imageUrl: initialData?.imageUrl || "",
    discount: initialData?.discount || "",
    destacado: initialData?.destacado || false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null);
  const [placeholderText, setPlaceholderText] = useState("Descripción del producto...");

  useEffect(() => {
    const categoryPlaceholder = {
      "Ropa": "Ej: Camiseta de algodón, talla M",
      "Electrónica": "Ej: Smartphone 128GB, color negro",
      "Hogar": "Ej: Sofá de 3 plazas, color gris",
    };
    setPlaceholderText(categoryPlaceholder[formData.category] || "Descripción del producto...");
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, imageFile);
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form">
        <h3>{initialData ? "Editar Producto" : "Agregar Producto"}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del producto" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder={placeholderText} required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Precio" step="0.01" required />
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required />

          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL de la imagen (opcional)" />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <div className="image-preview"><img src={imagePreview} alt="Previsualización" /></div>}

          <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="Descuento (%)" min="0" max="100" />
          <label className="checkbox-label">
            Destacado (visible en home)
            <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleChange} />            
          </label>

          <div className="form-actions">
            <button className="button-form" type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
            <button type="button" className="cancel-btn button-form" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
