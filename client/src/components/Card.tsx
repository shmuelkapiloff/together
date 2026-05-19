import type { Cart } from "../types/cart.ts";
import type { Product } from "../types/types.ts";
import AddToCartButton from "./AddToCartButton.tsx";
type Props = {
  product: Product;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
};
export default function Card({ product, setCart }: Props) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} className="images" />
      <div className="card-content">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <h2>₪ {product.price}</h2>
      <AddToCartButton product={product} setCart={setCart} />
      </div>
    </div>
  );
}
