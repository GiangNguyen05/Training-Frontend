import CartIcon from "./CartIcon";
import ProductList from "./ProductList";
import CartPanel from "./CartPanel";
import "../styles/cart.css";

export default function MainCart() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Cửa hàng</h1>
          <p className="subtitle">
            Nút "Thêm" — icon giỏ hàng và bảng bên phải tự cập nhật - cả hai đều
            đọc từ cùng một Store.
          </p>
        </div>
        <CartIcon />
      </header>

      <main className="page-body">
        <ProductList />
        <CartPanel />
      </main>
    </div>
  );
}
