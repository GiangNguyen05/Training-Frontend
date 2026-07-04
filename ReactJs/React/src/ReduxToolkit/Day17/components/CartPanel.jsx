import { useSelector, useDispatch } from "react-redux";
import { Trash2 } from "lucide-react";
import { removeItem, selectCartTotal } from "../features/cartSlice";
import { formatVND } from "../utils/formatCurrency";

export default function CartPanel() {
  const cart = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  return (
    <div className="cart-panel">
      <div className="cart-panel-header">
        <span>ĐỌC TRỰC TIẾP TỪ STORE</span>
      </div>

      {cart.length === 0 ? (
        <p className="empty-state">Giỏ hàng</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item, i) => (
            <li key={i} className="cart-row">
              <span>{item.name}</span>
              <span className="cart-row-right">
                {formatVND(item.price)}
                <button
                  className="remove-btn"
                  onClick={() => dispatch(removeItem(i))}
                  aria-label={`Xoá ${item.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-total">
        <span>Tổng cộng</span>
        <span>{formatVND(total)}</span>
      </div>
    </div>
  );
}
