import "./CartPage.css"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import Header from "../../components/Header/Header";
import { useEffect} from "react";
import type { Cart } from "../../types/cart";
import { getCart, updateCartItem, type User } from "../../services/auth.service";
import RemoveFromCartButton from "../../components/RemoveFromCartButton";
import QuantityUpdate from "../../components/QuantityUpdate";
import ClearAllBtn from "../../components/ClearAllBtn";
// import LogoutButton from "../../components/LogoutButton";
import HomePageBtn from "../../components/HomePageBtn";

type CartPageProps = {
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

function CartPage({ cart, setCart }: CartPageProps) {
  const navigate = useNavigate();
    const handleCheckout = () => {
    navigate("/payment");
  };

  // const [cart, setCart] = useState<Cart | null>(null);

  const increaseQty = async (productId: string, currentQty: number) => {
  const updatedCart = await updateCartItem(
    productId,
    currentQty + 1
  );
  setCart(updatedCart);
};

const decreaseQty = async (productId: string, currentQty: number) => {
  if (currentQty === 1) return;

  const updatedCart = await updateCartItem(
    productId,
    currentQty - 1
  );
  setCart(updatedCart);
};
const handleRemoved = async () => {
  const freshCart = await getCart();
  setCart(freshCart);
};

useEffect(() => {
  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.log(err)
      toast.error("עליך להירשם או להתחבר בכדי להיכנס לעגלה");
      navigate("/login");
    }
  };

  fetchCart();
}, [navigate, setCart]);

  if (!cart) return <p>טוען...</p>
  

  return (
    <>
      {/* <Header /> */}
      {/* <LogoutButton setUser={setUser}/> */}

      <h2>העגלה שלי</h2>


      <div className="cart-container">

      {cart.items.map((item) => (
        <div key={item.product._id} className="cardd">
          <h3>{item.product.name}</h3>
          <p>כמות: {item.quantity}</p>
          <QuantityUpdate quantity={item.quantity} 
          onIncrease={() => increaseQty(item.product._id, item.quantity)}
          onDecrease={() => decreaseQty(item.product._id, item.quantity)} />
          <p>מחיר: ₪{item.product.price}</p>
          <RemoveFromCartButton product={item.product} onRemoved={handleRemoved} />
        </div>
      ))}
      {cart.items.length > 0 && <ClearAllBtn onCleared={setCart}/>}
      <h3 className="cart-total">סה״כ לתשלום: ₪{cart.total}</h3>
      {cart.items.length > 0 && <button id="checkout-btn" onClick={handleCheckout}>התחל תהליך תשלום</button>}
      {cart.items.length < 1 && <HomePageBtn />}
      

      </div>
    </>
  );
}

export default CartPage;
