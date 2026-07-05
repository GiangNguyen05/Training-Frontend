import { PRODUCTS } from "../data/products";
import ProductCard from "./ProductCard";

export default function ProductList() {
  return (
    <section className="product-list">
      {PRODUCTS.map((product) => (
        <ProductCard key={product.name} product={product} />
      ))}
    </section>
  );
}
