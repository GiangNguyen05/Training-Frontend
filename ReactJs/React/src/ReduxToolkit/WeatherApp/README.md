# WeatherApp - RTK Query

> Ví dụ ngắn gọn, áp dụng RTK: cấu hình API, tag theo id, `skip`, `isFetching`, mutation + `invalidatesTags`.

Tính năng: tìm thành phố → xem thời tiết → lưu vào danh sách yêu thích.

## Cấu trúc thư mục

```
WeatherApp/
└── src/
    ├── index.jsx
    ├── App.jsx
    │
    ├── app/
    │   └── store.js
    │
    ├── features/
    │   └── weatherApi.js       # queryFn gọi 2 API thật (geocoding + forecast)
    │
    ├── utils/
    │   ├── weatherCode.js          # Ánh xạ mã WMO -> mô tả tiếng Việt + icon
    │   └── favoritesStorage.js     # Đọc/ghi danh sách yêu thích vào localStorage
    │
    ├── styles/
    │   └── weather.css
    └── components/
        ├── MainApp.jsx
        ├── WeatherSearch.jsx
        ├── FavoriteList.jsx
        └── WeatherIcon.jsx         # Có thêm icon tuyết (snow) và dông (storm)
```

## Vì sao dùng `queryFn` thay vì `query` + `fetchBaseQuery`?

`fetchBaseQuery` phù hợp khi tất cả endpoint dùng chung 1 `baseUrl` và chỉ
cần build URL đơn giản. Ở đây `getWeather` cần:

1. Gọi API #1 (geocoding) trước để lấy toạ độ
2. Dùng kết quả đó để gọi API #2 (forecast)
3. Xử lý riêng từng loại lỗi (không tìm thấy thành phố / lỗi mạng / lỗi server)

Đây là logic nhiều bước, nên `queryFn` (tự viết hàm async, tự trả về `{ data }`
hoặc `{ error }`) linh hoạt hơn nhiều so với khai báo `query` đơn giản.

## Danh sách yêu thích đã được lưu vào localStorage

`favoritesStorage.js` đọc/ghi dưới key `"weather-app:favorites"`. Vòng đời hoạt động:

```
Mở app lần đầu
      │
      ▼
loadFavorites() đọc localStorage -> nạp vào favoritesStore (biến trong module)
      │
      ▼
addFavorite / removeFavorite -> cập nhật favoritesStore + saveFavorites() ghi lại localStorage
      │
      ▼
Đóng trình duyệt, mở lại -> loadFavorites() đọc đúng dữ liệu cũ
```

Giới hạn cần biết:

- Dữ liệu chỉ tồn tại "trên 1 trình duyệt, 1 thiết bị" — không đồng bộ giữa các máy khác nhau. Muốn đồng bộ nhiều thiết bị, cần backend thật với tài khoản người dùng.
- Chế độ duyệt web ẩn danh (private/incognito) ở một số trình duyệt có thể chặn `localStorage` — code đã bọc `try/catch` để không làm crash app trong trường hợp đó, chỉ log cảnh báo ra console.
- Open-Meteo trả kết quả geocoding "theo mức độ khớp tên", đôi khi tên
  thành phố trùng ở nhiều quốc gia sẽ lấy kết quả đầu tiên — có thể thêm
  tham số `country_code` nếu cần chính xác hơn.

## Kỹ thuật

| Kỹ thuật dùng trong ví dụ                                 | Nằm ở docs nào             |
| --------------------------------------------------------- | -------------------------- |
| `tagTypes`, `providesTags` theo `id` (theo tên thành phố) | Docs cấu hình API          |
| `invalidatesTags` để tự làm mới `FavoriteList`            | Docs cấu hình API          |
| `skip` khi chưa có `city`                                 | Docs dùng trong components |
| `isLoading` vs `isFetching`                               | Docs dùng trong components |
| Không tự chép `data` sang `useState`                      | Docs dùng trong components |
