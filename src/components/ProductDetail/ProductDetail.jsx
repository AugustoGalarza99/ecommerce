import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../../context/CartContext";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product?.stock >= quantity) {
      addToCart({ ...product, quantity });

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Producto añadido al carrito",
        showConfirmButton: false,
        timer: 1500,
      });

      // Preguntar si seguir comprando o ir al carrito
      setTimeout(() => {
        Swal.fire({
          title: "¿Qué deseas hacer?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Finalizar compra 🛒",
          cancelButtonText: "Seguir comprando 🛍️",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/cart");
          } else {
            navigate("/productos");
          }
        });
      }, 1600);
      
    } else {
      Swal.fire({
        icon: "error",
        title: "Stock insuficiente",
      });
    }
  };

  if (loading) return <div className="loading"><Loader /></div>;

  if (!product) return <div className="error">Producto no encontrado</div>;

  const formattedPrice = product.price?.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const discountedPrice =
    product.discount > 0
      ? (product.price * (1 - product.discount / 100)).toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        })
      : null;

  return (
    <div className="product-detail">
      <div className="product-image">
        <img src={product.imageUrl || "https://via.placeholder.com/400"} alt={product.name} />
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        {product.discount > 0 ? (
          <>
            <p className="original-price">{formattedPrice}</p>
            <p className="discounted-price">{discountedPrice}</p>
            <div className="discount-badge">{product.discount}% OFF</div>
          </>
        ) : (
          <p className="price">{formattedPrice}</p>
        )}
        <p className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
          {product.stock > 0 ? `Stock disponible: ${product.stock}` : "Sin stock"}
        </p>
        <p className="category">Categoría: {product.category || "Sin categoría"}</p>
        <p className="description">{product.description || "Sin descripción"}</p>
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
        <button onClick={handleAddToCart} disabled={product.stock === 0} className="add-to-cart">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
