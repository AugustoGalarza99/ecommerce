import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebaseConfig";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, setDoc, query, where} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import ProductForm from "../ProductForm/ProductForm";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // "list", "addProduct", o "addCategory"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = querySnapshot.docs.map((doc) => ({
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

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setActiveTab("addProduct");
  };

  const handleProductSubmit = async (productData, imageFile) => {
    setError("");
    setLoading(true);

    try {
      let imageUrl = productData.imageUrl;
      if (imageFile) {
        const imageRef = ref(storage, `products/${uuidv4()}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const finalProductData = {
        ...productData,
        price: parseFloat(productData.price) || 0,
        stock: parseInt(productData.stock) || 0,
        imageUrl,
        category: productData.category,
        discount: parseInt(productData.discount) || 0,
        destacado: Boolean(productData.destacado),
      };

      if (editingProduct) {
        // Editar producto existente
        await updateDoc(doc(db, "products", editingProduct.id), finalProductData);
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...finalProductData } : p));
      } else {
        // Crear nuevo producto
        const newProductRef = doc(collection(db, "products"));
        await setDoc(newProductRef, { ...finalProductData, id: newProductRef.id });
        setProducts([...products, { ...finalProductData, id: newProductRef.id }]);
      }
      setActiveTab("list");
      setEditingProduct(null);
    } catch (err) {
      setError("Error al guardar el producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (categoryName) => {
    setError("");
    setLoading(true);

    if (!categoryName) {
      setError("Por favor, ingresa un nombre para la categoría.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "categories"), { name: categoryName });
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoriesList);
      setActiveTab("list");
    } catch (err) {
      setError("Error al guardar la categoría: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="product-list-container">
      <h2>Gestión de Productos y Categorías</h2>

      <div className="tabs">
        <button
          className={activeTab === "list" ? "active" : ""}
          onClick={() => setActiveTab("list")}
        >
          Lista de Productos
        </button>
        <button
          className={activeTab === "addProduct" ? "active" : ""}
          onClick={() => setActiveTab("addProduct")}
        >
          Agregar Producto
        </button>
        <button
          className={activeTab === "addCategory" ? "active" : ""}
          onClick={() => setActiveTab("addCategory")}
        >
          Agregar Categoría
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {activeTab === "list" && (
        <>
          <div className="controls">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Oferta (%)</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.imageUrl || "https://via.placeholder.com/50"} alt={product.name} />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price?.toFixed(2) || 0}</td>
                  <td>{product.stock || 0}</td>
                  <td>{product.category || "Sin categoría"}</td>
                  <td>{product.discount || 0}%</td>
                  <td>{product.destacado ? "Sí" : "No"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(product)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "addProduct" && (
        <ProductForm 
          onSubmit={handleProductSubmit} 
          initialData={editingProduct} 
          categories={categories} 
          onClose={() => setActiveTab("list")}
          loading={loading}
        />
      )}

      {activeTab === "addCategory" && (
        <div className="category-form">
          <h3>Agregar Nueva Categoría</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCategorySubmit(e.target.categoryName.value);
          }}>
            <input
              type="text"
              name="categoryName"
              placeholder="Nombre de la categoría"
              required
            />
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Categoría"}
              </button>
              <button type="button" onClick={() => setActiveTab("list")}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductList;