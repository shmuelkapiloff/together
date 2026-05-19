import { toast } from "react-toastify";
import { addToCart, getCart } from "../services/auth.service"; // שים לב שיש getCart
import type { Product } from "../types/types";
import type { Cart } from "../types/cart";
import Button from "@mui/material/Button";
import { ShoppingCartRounded } from "@mui/icons-material";

type Props = {
  product: Product;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
};

function AddToCartButton({ product, setCart }: Props) {
  const handleAddToCart = async () => {
    try {
      // 1️⃣ שולח לשרת להוסיף מוצר
      await addToCart({
        productId: product._id.toString(),
        quantity: 1,
      });

      // 2️⃣ מביא את העגלה המעודכנת מהשרת
      const freshCart = await getCart();
      setCart(freshCart); // <-- הכי חשוב, כדי שהHeader יתעדכן

      toast.success("המוצר נוסף לעגלה 🛒");
      console.log("התוסף בהצלחה", freshCart);
    } catch {
      toast.error("יש להתחבר על מנת להוסיף לעגלה");
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<ShoppingCartRounded />}
      onClick={handleAddToCart}
    >
      add to cart
    </Button>
  );
}

export default AddToCartButton;