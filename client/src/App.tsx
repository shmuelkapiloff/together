import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles.css";
import PaymentResult from './components/PaymentResult';
import HomePage from "./pages/Home/HomePage";
import CartPage from "./pages/Cart/CartPage";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
// import productsData from "./product.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentPage from "./pages/Payments/PaymentPage";
import CheckoutPage from "./pages/Payments/CheckoutPage";
import AdminPage from "./pages/Admin/AdminPage";
import Header from "./components/Header/Header";
import { useEffect, useState } from "react";
import { getCart, verifyUser, type User } from "./services/auth.service";
import type { Cart } from "./types/cart";
import Footer from "./components/Footer/Footer";
import ProductsTable from "./components/admin/ProductsTable";
import AddProduct from "./components/admin/AddProduct";

// import { useAppSelector } from "./hooks";
function App() {
  const [cart, setCart] = useState<Cart | null>(null);
  // const [userRole, setUserRole] = useState< string| null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await verifyUser();
        setUser(currentUser ?? null);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, []);
  // const items = useAppSelector((state) => state.cart.items);
  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Router>
        <Header cart={cart} user={user} setUser={setUser} />
        {/* <nav className="navbar"> */}
        {/* <Link to="/">Home</Link> | <Link to="/cart">Cart : {items.length}</Link> */}
        {/* </nav> */}
        <Routes>
          <Route
            path="/cart"
            element={<CartPage cart={cart} setCart={setCart} setUser={setUser} />}
          />
          <Route path="/" element={<HomePage setCart={setCart} />} />
          <Route path="/register" element={<Register setUser={setUser}/>} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/products" element={<ProductsTable />} />
          <Route path="/admin/products/new" element={<AddProduct />} />
          <Route path="/payment-result" element={<PaymentResult />} /> 
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
