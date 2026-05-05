// import "../../styles.css";
import "./HomePage.css";
import Card from "../../components/Card.tsx";
import type { Product } from "../../types/types.ts";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/auth.service.ts";
import type { Cart } from "../../types/cart.ts";
type HomePageProps = {
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
};

function HomePage({ setCart }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let data = await getProducts();
        console.log(
          "GGG",
          data.filter((p) => p.stock > 0),
        );
        data = data.filter((p) => p.stock > 0);
        setProducts(data);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setError("שגיאה בטעינת מוצרים");
      } finally {
        // setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("products updated:", products);
  }, [products]);

  // if (loading) return <p>טוען...</p>;
  if (error) return <p>{error}</p>;
  // function HomePage({ products }: HomeProps) {
  //   const items = useSelector((state:RootState) => state.cart.items)
  return (
    <>
      {/* <Header /> */}
      <div className="container">
        <div className="product-grid">
          {products.map((product) => (
            <Card key={product._id} product={product} setCart={setCart} />
          ))}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
export default HomePage;
