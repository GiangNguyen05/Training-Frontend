import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const cart = useSelector((state) => state.cart);

  return (
    <div className="cart-icon">
      <ShoppingCart size={20} strokeWidth={2} />
      <span className="cart-count">{cart.length}</span>
    </div>
  );
}
// Chỉ đọc, không sửa
