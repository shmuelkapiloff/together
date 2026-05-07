// import { useDispatch } from "react-redux";
// import { addToCart } from "../Features/cartSlice";
// import type { Product } from "../types";
// import { increment } from "../Features/counterSlice";

// const Card = ({ id, image, name, price, description }: Product) => {
//   const dispatch = useDispatch();
// const add = () => {
//   dispatch(addToCart({ id, image, name, price, description } as Product));
//   dispatch(increment())
// };

//   return (
//     <div className="card">
//       <img src={image} alt={name} className="card-image" />
//       <div className="card-body">
//         <h1 className="card-title">{name}</h1>
//         <p className="card-description">{description}</p>
//         <p className="card-price">{price} ₪</p>
//         <button onClick={add}>הוסף לעגלה</button>
//       </div>
//     </div>
//   );
// };

// export default Card;
// // ...existing code...
import type { Cart } from "../types/cart.ts";
import type { Product } from "../types/types.ts";
import AddToCartButton from "./AddToCartButton.tsx";

// type CardProps = {
//   product: Product;
// };
type Props = {
  product: Product;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
};

export default function Card({ product, setCart }: Props) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} className="images" />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <h2>₪ {product.price}</h2>
      <AddToCartButton product={product} setCart={setCart} />
    </div>
  );
}
