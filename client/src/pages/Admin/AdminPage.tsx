import { useState } from "react";
// import Header from "../components/Header/Header";
import ProductsTable from "../../components/admin/ProductsTable";
import UsersTable from "../../components/admin/UsersTable";
import OrdersTable from "../../components/admin/OrdersTable";
import StatsCards from "../../components/admin/StatsCards";
import "./Admin.css";

function AdminPage() {
  const [view, setView] = useState("products");

  return (
    <div className="admin-page">
      <h1 className="admin-title">לוח ניהול</h1>

      <div className="admin-nav">
        <button className={view === "products" ? "active" : ""}onClick={() => setView("products")}>מוצרים</button>
        <button className={view === "users" ? "active" : ""}onClick={() => setView("users")}>משתמשים</button>
        <button className={view === "orders" ? "active" : ""}onClick={() => setView("orders")}>הזמנות</button>
        <button className={view === "status" ? "active" : ""}onClick={() => setView("status")}>סטטיסטיקות</button>
      </div>

      <div className="admin-content">
        {view === "products" && <ProductsTable />}
        {view === "users" && <UsersTable />}
        {view === "orders" && <OrdersTable />}
        {view === "status" && <StatsCards />}
      </div>
    </div>
  );
}

export default AdminPage;
