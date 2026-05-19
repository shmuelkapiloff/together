import { Link } from "react-router-dom";
import "./Header.css";
import type { Cart } from "../../types/cart";
import type { User } from "../admin/UsersTable";
import LogoutButton from "../LogoutButton";

type NavbarProps = {
  cart: Cart | null;
  // userRole: string | null; // מוסיפים כאן את תפקיד המשתמש
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

function Header({ cart, user, setUser}: NavbarProps) {
  const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    // <header className="navbar">
    //   <div className="logo">
    //   {user && <LogoutButton setUser={setUser} />}
    //   </div>

    //   <nav className="nav-links">
    //     <Link to="login">{user && <span>👤 {user.name}</span>}</Link>
    //     <Link to="/">מוצרים</Link>
    //     <Link to="/register">התחברות</Link>
    //     <Link to="/cart">עגלה({count})</Link>
        
    //     {/* רק אם המשתמש מנהל */}
    //     {user?.role === "admin" && <Link to="/admin">ניהול</Link>}
    //     <Link id="logo" to="/">MyStore</Link>
    //   </nav>
    // </header>
    <header className="navbar">
  <div className="logo">
    <Link id="logo" to="/">MyStore</Link>
  </div>

  <nav className="nav-links">
    <Link to="/">מוצרים</Link>
    <Link to="/cart">🛒 ({count})</Link>

    {user?.role === "admin" && <Link to="/admin">ניהול</Link>}

    {!user ? (
      <Link to="/login" className="login-btn">התחברות</Link>
    ) : (
      <div className="user-section">
        <span className="user-name">👤 {user.name}</span>
        <LogoutButton setUser={setUser} />
      </div>
    )}
  </nav>
</header>
  );
}

export default Header;