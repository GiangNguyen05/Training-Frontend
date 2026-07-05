import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import { addItem } from "../features/cartSlice";
import { formatVND } from "../utils/formatCurrency";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addItem(product));
  };

  return (
    <div className="product-card">
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-price">{formatVND(product.price)}</p>
      </div>
      <button className="add-btn" onClick={handleAdd}>
        <Plus size={16} strokeWidth={2.5} />
        Thêm
      </button>
    </div>
  );
}
