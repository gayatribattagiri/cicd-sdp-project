import React, { Component } from "react";
import "./Products.css";
import Navbar from "../../Navbar/Navbar";

const BASE_URL = import.meta.env.VITE_BASE_URL;
<<<<<<< HEAD
console.log(BASE_URL);
=======
// console.log(BASE_URL)


const DEFAULT_CATEGORIES = [
  "Prepared Foods",
  "Canned Foods & Soups",
  "Bakery",
  "Dairy & Eggs",
  "Frozen",
  "Meat & Seafood",
  "Snacks & Confectionery",
  "Beverages",
  "Grains & Pulses",
  "Fruits",
  "Vegetables",
  "Spices & Condiments",
  "Cooking Essentials",
  "Household Supplies",
  "Noodles"
];

const CATEGORIES_STORAGE_KEY = "categories";
>>>>>>> refs/remotes/origin2/main

class Products extends Component {
  state = {
    products: [],
    categories: [],
    formData: {
      id: null,
      name: "",
      price: "",
      quantity: "",
      category: "",
      productImage: "",
    },
    uploading: false,
    showDeleteConfirm: false,
    productToDelete: null,
    selectedCategory: null,
  };

  fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      const data = await res.json();
      this.setState({ categories: data });
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  componentDidMount() {
    this.fetchProducts();
    this.fetchCategories();
  }

  fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      const data = await res.json();
      this.setState({ products: data });
    } catch (err) {
      console.error(err);
    }
  };

  handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) this.uploadToCloudinary(file);
  };

  uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dasm9k1z9";
    const preset = "fsad_preset";
    this.setState({ uploading: true });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        this.setState((prev) => ({
          formData: { ...prev.formData, productImage: data.secure_url },
          uploading: false,
        }));
      }
    } catch (err) {
      console.error(err);
      this.setState({ uploading: false });
    }
  };

  handleChange = (e) => {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...data } = this.state.formData;
    try {
      if (id) {
        await fetch(`${BASE_URL}/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch(`${BASE_URL}/products/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      this.resetForm();
      this.fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  handleEdit = (p) => {
    this.setState({ formData: { ...p, productImage: p.productImage || p.product_image } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  handleDeleteConfirm = (p) => {
    this.setState({ showDeleteConfirm: true, productToDelete: p });
  };

  handleDelete = async () => {
    const { productToDelete } = this.state;
    try {
      await fetch(`${BASE_URL}/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      this.setState({ showDeleteConfirm: false, productToDelete: null });
      this.fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  resetForm = () => {
    this.setState({
      formData: {
        id: null,
        name: "",
        price: "",
        quantity: "",
        category: "",
        productImage: "",
      },
    });
  };

  removeImage = () => {
    this.setState((prev) => ({
      formData: { ...prev.formData, productImage: "" },
    }));
  };

  render() {
    const { products, categories, formData, uploading, showDeleteConfirm, selectedCategory } =
      this.state;

    const filteredProducts = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : [];

    // Split products into rows of 4
    const productRows = [];
    for (let i = 0; i < filteredProducts.length; i += 4) {
      productRows.push(filteredProducts.slice(i, i + 4));
    }

    return (
      <>
      <Navbar />
      <div className="products-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Categories</h2>
          <div className="category-note">
            <p>💡 Manage categories in the Categories section</p>
          </div>
          <ul>
            <li>
              <button
                className={`category-btn ${selectedCategory === null ? "active" : ""}`}
                onClick={() => this.setState({ selectedCategory: null })}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  className={`category-btn ${selectedCategory === cat.name ? "active" : ""}`}
                  onClick={() => this.setState({ selectedCategory: cat.name })}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className="main">
          {/* Form */}
          <div className="form-card floating">
            <h3>{formData.id ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={this.handleSubmit}>
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={this.handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={this.handleChange}
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={this.handleChange}
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={this.handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input type="file" id="fileElem" onChange={this.handleFileSelect} />
              <label htmlFor="fileElem" className="file-upload-btn">
                Choose Image
              </label>

              {/* Drag & Drop */}
              <div
                id="drop-area"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("hover");
                }}
                onDragLeave={(e) => e.currentTarget.classList.remove("hover")}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("hover");
                  const files = e.dataTransfer.files;
                  if (files.length > 0 && files[0].type.startsWith("image/")) {
                    this.uploadToCloudinary(files[0]);
                  } else {
                    alert("Please drop a valid image file.");
                  }
                }}
              >
                <div className="drop-content">
                  <span className="drop-icon">📁</span>
                  <p>Drop your image here or click to browse</p>
                </div>
              </div>

              {uploading && (
                <div className="uploading-indicator">
                  <div className="spinner"></div>
                  <p>Uploading...</p>
                </div>
              )}
              {formData.productImage && (
                <div className="preview-container">
                  <img
                    src={formData.productImage}
                    alt="preview"
                    className="preview"
                  />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={this.removeImage}
                  >
                    ✖
                  </button>
                </div>
              )}

              <button type="submit" className="submit-btn">
                {formData.id ? "Update" : "Add"}
              </button>
            </form>
          </div>

          <section className="category-section">
            <h2 className="category-title">
              {selectedCategory ? selectedCategory : "All Products"}
            </h2>
            {productRows.length > 0 ? (
              productRows.map((row, rowIndex) => (
                <div className="product-row" key={rowIndex}>
                  {row.map((p) => (
                    <div className="product-card floating" key={p.id}>
                      <div className="product-image-container">
                        <img src={p.productImage || p.product_image} alt={p.name} />
                        <div className="product-overlay">
                          <button
                            className="edit-btn"
                            onClick={() => this.handleEdit(p)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => this.handleDeleteConfirm(p)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      <div className="product-info">
                        <p className="name">{p.name}</p>
                        <p className="price">₹{p.price}</p>
                        <p className="qty">Qty: {p.quantity}</p>
                        <p className="category">Category: {p.category}</p>
                      </div>
                    </div>
                  ))}
                  {/* Fill empty spaces if row has less than 4 items */}
                  {Array.from({ length: 4 - row.length }).map((_, index) => (
                    <div className="product-card empty" key={`empty-${index}`}></div>
                  ))}
                </div>
              ))
            ) : (
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <p>
                  {selectedCategory 
                    ? `No products found in "${selectedCategory}" category.` 
                    : "No products found. Add some products to get started."
                  }
                </p>
              </div>
            )}
          </section>
        </main>

        {showDeleteConfirm && (
          <div className="popup">
            <div className="popup-content floating">
              <p>Are you sure you want to delete this product?</p>
              <div className="popup-buttons">
                <button className="confirm-btn" onClick={this.handleDelete}>Yes, Delete</button>
                <button className="cancel-btn" onClick={() => this.setState({ showDeleteConfirm: false })}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
    );
  }
}

export default Products;