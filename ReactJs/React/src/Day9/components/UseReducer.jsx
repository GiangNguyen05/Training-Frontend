import { useReducer } from "react";
import "../styles/useReducer.css";

const initialState = {
  items: [],
  total: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "THEM": {
      const items = [...state.items, action.payload];
      return { items, total: tinhTong(items) };
    }

    case "XOA": {
      const items = state.items.filter((item) => item.id !== action.payload);
      return { items, total: tinhTong(items) };
    }

    case "TANG_SO_LUONG": {
      const items = state.items.map((item) =>
        item.id === action.payload
          ? { ...item, soLuong: item.soLuong + 1 }
          : item,
      );
      return { items, total: tinhTong(items) };
    }

    case "GIAM_SO_LUONG": {
      const items = state.items.map((item) =>
        item.id === action.payload && item.soLuong > 1
          ? { ...item, soLuong: item.soLuong - 1 }
          : item,
      );
      return { items, total: tinhTong(items) };
    }

    case "XOA_HET":
      return initialState;

    default:
      return state;
  }
}

function tinhTong(items) {
  return items.reduce((sum, item) => sum + item.gia * item.soLuong, 0);
}

const SAN_PHAM = [
  { id: 1, ten: "Áo thun", gia: 150000 },
  { id: 2, ten: "Quần jean", gia: 450000 },
  { id: 3, ten: "Giày", gia: 890000 },
];

export default function UseReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="wrap">
      <h2>useReducer</h2>

      {/* Danh sách sản phẩm */}
      <div className="section">
        <p className="label">Sản phẩm</p>
        {SAN_PHAM.map((sp) => (
          <div key={sp.id} className="row">
            <span>
              {sp.ten} — {sp.gia.toLocaleString()} đ
            </span>
            <button
              onClick={() =>
                dispatch({
                  type: "THEM",
                  payload: { ...sp, soLuong: 1 },
                })
              }
            >
              + Thêm
            </button>
          </div>
        ))}
      </div>

      {/* Giỏ hàng */}
      <div className="section">
        <p className="label">Giỏ hàng ({state.items.length})</p>

        {state.items.length === 0 && <p className="empty">Giỏ hàng trống.</p>}

        {state.items.map((item) => (
          <div key={item.id} className="row cart-item">
            <span>{item.ten}</span>
            <div className="qty">
              <button
                onClick={() =>
                  dispatch({ type: "GIAM_SO_LUONG", payload: item.id })
                }
              >
                −
              </button>
              <span>{item.soLuong}</span>
              <button
                onClick={() =>
                  dispatch({ type: "TANG_SO_LUONG", payload: item.id })
                }
              >
                +
              </button>
            </div>
            <button
              className="xoa"
              onClick={() => dispatch({ type: "XOA", payload: item.id })}
            >
              ✕
            </button>
          </div>
        ))}

        {state.items.length > 0 && (
          <button
            className="clear"
            onClick={() => dispatch({ type: "XOA_HET" })}
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="total">Tổng: {state.total.toLocaleString()} đ</div>
    </div>
  );
}
