import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Carousel from "../Carousel/Carousel";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [categorias, setCategorias] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [productosEnOferta, setProductosEnOferta] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriasList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategorias(categoriasList);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    };

    const fetchProductosDestacados = async () => {
      try {
        const q = query(collection(db, "products"), where("destacado", "==", true));
        const querySnapshot = await getDocs(q);
        const productosList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductosDestacados(productosList);
      } catch (error) {
        console.error("Error fetching productos destacados:", error);
      }
    };

    const fetchProductosEnOferta = async () => {
      try {
        const q = query(collection(db, "products"), where("discount", ">", 0));
        const querySnapshot = await getDocs(q);
        const productosList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductosEnOferta(productosList);
      } catch (error) {
        console.error("Error fetching productos en oferta:", error);
      }
    };

    fetchCategorias();
    fetchProductosDestacados();
    fetchProductosEnOferta();
  }, []);

  return (
    <div className="home">
      {/* Carrusel principal */}
      <Carousel />

      {/* Selector de categorías */}
      <div className="categories-section">
        <h2>Categorías</h2>
        <div className="categories-grid">
          {categorias.map(categoria => (
            <div key={categoria.id} className="category-card">
              <img src={categoria.imagen || "https://via.placeholder.com/150"} alt={categoria.nombre} />
              <p>{categoria.nombre}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Productos destacados */}
      <div className="featured-products-section">
        <h2>Productos Destacados</h2>
        <div className="products-grid">
          {productosDestacados.map(producto => (
            <Link to={`/product/${producto.id}`} key={producto.id} className="product-card-link">
              <div className="product-card">
                <img src={producto.imageUrl || "https://via.placeholder.com/200"} alt={producto.name} />
                <h3>{producto.name}</h3>
                {producto.price && producto.price > 0 && (
                  <p className={producto.discount ? "original-price" : ""}>
                    ${producto.price.toFixed(2)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Productos en oferta */}
      <div className="featured-products-section">
        <h2>Ofertas Especiales</h2>
        <div className="products-grid">
          {productosEnOferta.map(producto => (
            <Link to={`/product/${producto.id}`} key={producto.id} className="product-card-link">
              <div className="product-card">
                <img src={producto.imageUrl || "https://via.placeholder.com/200"} alt={producto.name} />
                {producto.discount && producto.discount > 0 && (
                  <div className="discount-badge">
                    {producto.discount}% OFF
                  </div>
                )}
                <h3>{producto.name}</h3>
                {producto.price && producto.price > 0 && (
                  <p className={producto.discount ? "original-price" : ""}>
                    ${producto.price.toFixed(2)}
                  </p>
                )}
                {producto.discount && producto.discount > 0 && producto.price && producto.price > 0 && (
                  <p className="discounted-price">
                    ${((producto.price * (1 - producto.discount / 100))).toFixed(2)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;