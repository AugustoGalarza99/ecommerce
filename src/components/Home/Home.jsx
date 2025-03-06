import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Carousel from "../Carousel/Carousel";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [productosEnOferta, setProductosEnOferta] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Traemos todas las categorías
        const categoriasSnap = await getDocs(collection(db, "categories"));
        setCategorias(categoriasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Traemos todos los productos de una vez (menos consumo de Firebase)
        const productosSnap = await getDocs(collection(db, "products"));
        const allProducts = productosSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProductos(allProducts);

        // Filtramos productos destacados y en oferta en el front
        setProductosDestacados(allProducts.filter(p => p.destacado === true));
        setProductosEnOferta(allProducts.filter(p => p.discount > 0));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <Carousel />

      {/* Productos Destacados */}
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

      {/* Productos en Oferta */}
      <div className="featured-products-section">
        <h2>Ofertas Especiales</h2>
        <div className="products-grid">
          {productosEnOferta.map(producto => (
            <Link to={`/product/${producto.id}`} key={producto.id} className="product-card-link">
              <div className="product-card">
                <img src={producto.imageUrl || "https://via.placeholder.com/200"} alt={producto.name} />
                {producto.discount && producto.discount > 0 && (
                  <div className="discount-badge">{producto.discount}% OFF</div>
                )}
                <h3>{producto.name}</h3>
                {producto.price && producto.price > 0 && (
                  <p className={producto.discount ? "original-price" : ""}>
                    ${producto.price.toFixed(2)}
                  </p>
                )}
                {producto.discount && producto.discount > 0 && producto.price && (
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
