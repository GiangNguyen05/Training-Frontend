# WeatherApp - RTK Query

> Ví dụ ngắn gọn, áp dụng RTK: cấu hình API, tag theo id, `skip`, `isFetching`, mutation + `invalidatesTags`.

**Tính năng:** tìm thành phố → xem thời tiết → lưu vào danh sách yêu thích.

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
    │   └── api/
    │       └── weatherApi.js       # queryFn gọi 2 API thật (geocoding + forecast)
    │
    ├── utils/
    │   └── weatherCode.js          # Ánh xạ mã WMO -> mô tả tiếng Việt + icon
    │
    ├── styles/ (chưa hoàn thành)
    │   └── weather.css
    └── components/ (chưa hoàn thành)
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

## Kỹ thuật

| Kỹ thuật dùng trong ví dụ                                 | Nằm ở docs nào             |
| --------------------------------------------------------- | -------------------------- |
| `tagTypes`, `providesTags` theo `id` (theo tên thành phố) | Docs cấu hình API          |
| `invalidatesTags` để tự làm mới `FavoriteList`            | Docs cấu hình API          |
| `skip` khi chưa có `city`                                 | Docs dùng trong components |
| `isLoading` vs `isFetching`                               | Docs dùng trong components |
| Không tự chép `data` sang `useState`                      | Docs dùng trong components |
