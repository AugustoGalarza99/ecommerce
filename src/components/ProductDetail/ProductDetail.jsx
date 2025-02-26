import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", id));
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
        } else {
          navigate("/not-found"); // Página de error si el producto no existe
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/not-found");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product && product.stock >= quantity) {
      addToCart({ ...product, quantity });
      alert("Producto añadido al carrito");
      navigate("/cart");
    } else {
      alert("Stock insuficiente");
    }
  };

  if (!product) return <div>Cargando...</div>;

  return (
    <div className="product-detail">
      <div className="product-image">
        <img src={product.imageUrl || "https://via.placeholder.com/400"} alt={product.name} />
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        {product.discount && product.discount > 0 && product.price && product.price > 0 && (
          <>
            <p className="original-price">${product.price.toFixed(2)}</p>
            <p className="discounted-price">
              ${(product.price * (1 - product.discount / 100)).toFixed(2)}
            </p>
            <div className="discount-badge">{product.discount}% OFF</div>
          </>
        )}
        {!product.discount && product.price && product.price > 0 && (
          <p className="price">${product.price.toFixed(2)}</p>
        )}
        <p>Stock disponible: {product.stock > 0 ? product.stock : "Sin stock"}</p>
        <p>Categoría: {product.category || "Sin categoría"}</p>
        <p>Descripción: {product.description || "Sin descripción"}</p>
        <div className="quantity-selector">
          <label>Cantidad: </label>
          <input
            type="number"
            value={quantity}
            min="1"
            max={product.stock || 1}
            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 1, Number(e.target.value))))}
          />
        </div>
        <button onClick={handleAddToCart} disabled={product.stock === 0}>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;