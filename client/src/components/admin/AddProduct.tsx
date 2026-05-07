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
    <div>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange}/>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange}/>
        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="stock" placeholder="Stock" onChange={handleChange} />
        <input name="category" placeholder="Category" onChange={handleChange} />
        <input name="image" placeholder="Image URL" onChange={handleChange} />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default AddProduct;
