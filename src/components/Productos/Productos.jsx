import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // Asegúrate de tener el contexto del carrito
import "./Productos.css";

function Productos() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); // Número de productos por página
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setFilteredProducts(productList); // Inicialmente sin filtros
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Filtrar y ordenar productos
  useEffect(() => {
    let result = [...products];

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar productos: primero los con stock, luego sin stock
    result.sort((a, b) => {
      const hasStockA = a.stock > 0 ? 0 : 1;
      const hasStockB = b.stock > 0 ? 0 : 1;
      return hasStockA - hasStockB; // Productos con stock (0) antes que sin stock (1)
    });

    // Ordenar según la opción seleccionada
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Resetear página al filtrar
  }, [selectedCategory, searchTerm, sortOption, products]);

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart({ ...product, quantity: 1 });
      alert("Producto añadido al carrito");
    } else {
      alert("No hay stock disponible");
    }
  };

  return (
    <div className="productos-container">
      <div className="sidebar">
        <h3>Categorías</h3>
        <ul>
          <li>
            <button
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "active" : ""}
            >
              Todas
            </button>
          </li>
          {categories.map(category => (
            <li key={category.id}>
              <button
                onClick={() => setSelectedCategory(category.name)}
                className={selectedCategory === category.name ? "active" : ""}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="filters">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A-Z</option>
          </select>
        </div>

        <h1 className="title">Nuestros Productos</h1>
        <div className="product-list">
          {currentProducts.map(product => (
            <div key={product.id} className={`product-card ${product.stock <= 0 ? "out-of-stock" : ""}`}>
              <Link to={`/product/${product.id}`} className="product-card-link">
                <img
                  src={product.imageUrl || "https://via.placeholder.com/200"}
                  alt={product.name}
                  className="product-image"
                />
                {product.discount && product.discount > 0 && product.price && product.price > 0 && (
                  <div className="discount-badge">{product.discount}% OFF</div>
                )}
                <h3>{product.name}</h3>
                {product.price && product.price > 0 && (
                  <p className={product.discount ? "original-price" : "price"}>
                    ${product.price.toFixed(2)}
                  </p>
                )}
                {product.discount && product.discount > 0 && product.price && product.price > 0 && (
                  <p className="discounted-price">
                    ${((product.price * (1 - product.discount / 100)).toFixed(2))}
                  </p>
                )}
                <p className="stock-status">
                  {product.stock > 0 ? "Stock disponible" : "Stock no disponible"}
                </p>
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="add-to-cart-btn"
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "Agregar al Carrito" : "Sin Stock"}
              </button>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Productos;