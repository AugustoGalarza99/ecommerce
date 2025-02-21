import { useState, useEffect } from "react";
import { db, storage } from "../../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./AgregarProducto.css";

function GestionProductos() {
  // Estado para productos
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    category: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Estado para categorías
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  // Estados compartidos
  const [activeTab, setActiveTab] = useState("product"); // "product" o "category"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar categorías desde Firebase o localStorage
  useEffect(() => {
    const fetchCategories = async () => {
      const cachedCategories = localStorage.getItem("categories");
      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(categoriesList);
        localStorage.setItem("categories", JSON.stringify(categoriesList));
      } catch (err) {
        setError("Error al cargar categorías: " + err.message);
      }
    };

    fetchCategories();
  }, []);

  // Handlers para productos
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? value.replace(/[^0-9.]/g, "") : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!product.image || !product.category) {
      setError("Por favor, selecciona una imagen y una categoría.");
      setLoading(false);
      return;
    }

    if (parseFloat(product.price) <= 0 || parseInt(product.stock) < 0) {
      setError("El precio debe ser mayor a 0 y el stock no puede ser negativo.");
      setLoading(false);
      return;
    }

    try {
      const imageRef = ref(storage, `products/${uuidv4()}`);
      await uploadBytes(imageRef, product.image);
      const url = await getDownloadURL(imageRef);

      await addDoc(collection(db, "products"), {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        imageUrl: url,
        category: product.category,
      });

      setProduct({ name: "", description: "", price: "", stock: "", image: null, category: "" });
      setImagePreview(null);
      alert("Producto agregado exitosamente");
    } catch (err) {
      setError("Error al guardar el producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handlers para categorías
  const handleCategoryChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!categoryName) {
      setError("Por favor, ingresa un nombre para la categoría.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "categories"), { name: categoryName });
      const updatedCategories = [...categories, { id: uuidv4(), name: categoryName }];
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
      setCategoryName("");
      alert("Categoría agregada exitosamente");
    } catch (err) {
      setError("Error al guardar la categoría: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form">
        <h2>Gestión de Productos y Categorías</h2>

        {/* Pestañas */}
        <div className="tabs">
          <button
            className={activeTab === "product" ? "active" : ""}
            onClick={() => setActiveTab("product")}
          >
            Agregar Producto
          </button>
          <button
            className={activeTab === "category" ? "active" : ""}
            onClick={() => setActiveTab("category")}
          >
            Agregar Categoría
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {/* Formulario de Producto */}
        {activeTab === "product" && (
          <form onSubmit={handleProductSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={product.name}
              onChange={handleProductChange}
              required
            />
            <textarea
              name="description"
              placeholder="Descripción del producto"
              value={product.description}
              onChange={handleProductChange}
              required
            />
            <input
              type="text"
              name="price"
              placeholder="Precio"
              value={product.price}
              onChange={handleProductChange}
              required
            />
            <input
              type="text"
              name="stock"
              placeholder="Stock disponible"
              value={product.stock}
              onChange={handleProductChange}
              required
            />
            <select
              name="category"
              value={product.category}
              onChange={handleProductChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <input type="file" accept="image/*" onChange={handleImageChange} required />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Previsualización" />
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Producto"}
            </button>
          </form>
        )}

        {/* Formulario de Categoría */}
        {activeTab === "category" && (
          <form onSubmit={handleCategorySubmit}>
            <input
              type="text"
              name="categoryName"
              placeholder="Nombre de la categoría"
              value={categoryName}
              onChange={handleCategoryChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Categoría"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default GestionProductos;