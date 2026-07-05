# Redux Cart Demo

## Cấu trúc thư mục

```
redux-cart-demo/
├── index.html
├── package.json
└── src/
    ├── index.jsx              # Điểm khởi động — bọc App bằng <Provider store={store}>
    ├── App.jsx                # Component gốc — lắp ghép các component con
    ├── App.css                # Style toàn app
    │
    ├── app/
    │   └── store.js           # "Tủ hồ sơ trung tâm" — gộp mọi reducer lại
    │
    ├── features/
    │   └── cart/
    │       └── cartSlice.js   # "Nhân viên xử lý" + "phiếu yêu cầu" của giỏ hàng
    │
    ├── components/
    │   ├── CartIcon.jsx       # Chỉ đọc store (useSelector)
    │   ├── ProductCard.jsx    # Gửi phiếu yêu cầu (dispatch)
    │   ├── ProductList.jsx    # Danh sách sản phẩm
    │   └── CartPanel.jsx      # Đọc + xoá sản phẩm khỏi giỏ
    │
    ├── data/
    │   └── products.js        # Dữ liệu mẫu
    │
    └── utils/
        └── formatCurrency.js  # Hàm định dạng tiền tệ
```

## Nguyên tắc chia thư mục (feature-based)

Đây là cách tổ chức phổ biến nhất cho dự án Redux Toolkit thực tế — thay vì gom hết "mọi reducer" vào 1 file, mỗi **tính năng** (feature) có thư mục riêng chứa slice của nó:

- `app/` — cấu hình lõi của Redux (chỉ 1 file `store.js`), không chứa logic nghiệp vụ
- `features/<tên-tính-năng>/` — mỗi tính năng (cart, user, product...) có 1 slice riêng, dễ mở rộng, dễ tìm
- `components/` — các component UI thuần, chỉ biết `useSelector` / `useDispatch`, không tự chứa logic reducer
- `data/`, `utils/` — dữ liệu và hàm dùng chung, không liên quan trực tiếp đến Redux

**Khi cần thêm tính năng mới** (ví dụ "yêu thích sản phẩm"): chỉ cần tạo `features/wishlist/wishlistSlice.js` và đăng ký vào `app/store.js` — không phải sửa các slice cũ.
