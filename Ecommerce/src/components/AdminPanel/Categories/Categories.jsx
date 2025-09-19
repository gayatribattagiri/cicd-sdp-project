import React, { Component } from "react";
import "./Categories.css";
import Navbar from "../../Navbar/Navbar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

class Categories extends Component {
  state = {
    categories: [],
    formData: {
      id: null,
      name: "",
      description: "",
    },
    showDeleteConfirm: false,
    categoryToDelete: null,
    editingCategory: null,
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      const data = await res.json();
      this.setState({ categories: data });
    } catch (err) {
      console.error("Error fetching categories:", err);
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
        await fetch(`${BASE_URL}/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch(`${BASE_URL}/categories/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      this.resetForm();
      this.fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  handleEdit = (category) => {
    this.setState({ 
      formData: { 
        id: category.id,
        name: category.name,
        description: category.description || ""
      },
      editingCategory: category
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  handleDeleteConfirm = (category) => {
    this.setState({ showDeleteConfirm: true, categoryToDelete: category });
  };

  handleDelete = async () => {
    const { categoryToDelete } = this.state;
    try {
      const response = await fetch(`${BASE_URL}/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        this.setState({ showDeleteConfirm: false, categoryToDelete: null });
        this.fetchCategories();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        this.setState({ showDeleteConfirm: false, categoryToDelete: null });
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      this.setState({ showDeleteConfirm: false, categoryToDelete: null });
    }
  };

  resetForm = () => {
    this.setState({
      formData: {
        id: null,
        name: "",
        description: "",
      },
      editingCategory: null,
    });
  };

  render() {
    const { categories, formData, showDeleteConfirm, categoryToDelete } = this.state;

    return (
      <>
        <Navbar />
        <div className="categories-layout">
          {/* Form */}
          <div className="form-card floating">
            <h3>{formData.id ? "Edit Category" : "Add Category"}</h3>
            <form onSubmit={this.handleSubmit}>
              <input
                name="name"
                placeholder="Category Name"
                value={formData.name}
                onChange={this.handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Category Description (Optional)"
                value={formData.description}
                onChange={this.handleChange}
                rows="3"
              />
              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  {formData.id ? "Update" : "Add"}
                </button>
                {formData.id && (
                  <button type="button" className="cancel-btn" onClick={this.resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <section className="categories-section">
            <h2>Categories ({categories.length})</h2>
            {categories.length > 0 ? (
              <div className="categories-grid">
                {categories.map((category) => (
                  <div className="category-card floating" key={category.id}>
                    <div className="category-info">
                      <h3 className="category-name">{category.name}</h3>
                      {category.description && (
                        <p className="category-description">{category.description}</p>
                      )}
                      <p className="category-date">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="category-actions">
                      <button
                        className="edit-btn"
                        onClick={() => this.handleEdit(category)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => this.handleDeleteConfirm(category)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-categories">
                <div className="no-categories-icon">📂</div>
                <p>No categories found. Create your first category above.</p>
              </div>
            )}
          </section>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="popup">
              <div className="popup-content floating">
                <h3>Delete Category</h3>
                <p>
                  Are you sure you want to delete the category "{categoryToDelete?.name}"?
                </p>
                <p className="warning-text">
                  ⚠️ This action cannot be undone. If this category has associated products, 
                  the deletion will be prevented.
                </p>
                <div className="popup-buttons">
                  <button className="confirm-btn" onClick={this.handleDelete}>
                    Yes, Delete
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => this.setState({ showDeleteConfirm: false })}
                  >
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

export default Categories;
