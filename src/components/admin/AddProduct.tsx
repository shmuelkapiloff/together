import { useState } from "react";
import { createProduct } from "../../services/admin.service";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      // חזרה לטבלה אחרי יצירה
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
    }
  };

return (
  <div className="add-product-page">
    <div className="add-product-card">
      <h2 className="add-product-title">Add Product</h2>

      <form className="add-product-form" onSubmit={handleSubmit}>

        <div className="add-product-row">
          <label>SKU</label>
          <input
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
          />
        </div>

        <div className="add-product-row">
          <label>Name</label>
          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="add-product-row">
          <label>Description</label>
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="add-product-row">
          <label>Price</label>
          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="add-product-row">
          <label>Stock</label>
          <input
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        <div className="add-product-row">
          <label>Category</label>
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <div className="add-product-row">
          <label>Image URL</label>
          <input
            name="image"
            placeholder="https://..."
            value={form.image}
            onChange={handleChange}
          />
        </div>

        <button className="add-product-submit" type="submit">
          Create Product
        </button>
      </form>
    </div>
  </div>
);
}

export default AddProduct;
