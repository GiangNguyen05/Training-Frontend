# useReducer

## Vấn đề cần giải quyết

Khi một component có **nhiều state liên quan với nhau**, và **một hành động của người dùng cần thay đổi nhiều state cùng lúc**, dùng nhiều `useState` riêng lẻ sẽ khiến logic bị rải rác, dễ quên cập nhật, khó kiểm soát toàn bộ luồng thay đổi.

`useReducer` giải quyết vấn đề này bằng cách **gom tất cả state liên quan vào một nơi**, và **gom tất cả cách thay đổi state vào một hàm duy nhất**.

## Khái niệm

### Reducer là gì?

**Reducer** là một hàm nhận vào **trạng thái hiện tại** và **một yêu cầu thay đổi**, rồi trả về **trạng thái mới**. Reducer không tự ý thay đổi gì — nó chỉ tính toán và trả về kết quả mới.

```
Trạng thái hiện tại + Yêu cầu thay đổi  →  Reducer  →  Trạng thái mới
```

### Action là gì?

**Action** là một object mô tả "chuyện gì vừa xảy ra" — không phải cách xử lý, chỉ là mô tả sự kiện.

```
{ type: 'TEN_HANH_DONG', payload: duLieuKemTheo }
```

`type` là bắt buộc — cho biết loại hành động. `payload` là tùy chọn — dữ liệu đi kèm hành động đó.

### Dispatch là gì?

**Dispatch** là hàm dùng để **gửi action** đến reducer. Gọi `dispatch(action)` tương đương với việc nói "hãy xử lý sự kiện này", reducer sẽ tính ra trạng thái mới.

## Cách hoạt động

```
1. Component gọi dispatch(action)
        │
2. React gửi action đó cho reducer, kèm theo state hiện tại
        │
3. Reducer xem action.type, quyết định trả về state mới tương ứng
        │
4. React cập nhật state, component re-render với state mới
```

Toàn bộ luồng luôn đi qua đúng 1 cửa duy nhất — hàm reducer. Không có cách nào khác để thay đổi state ngoài việc gửi action qua dispatch.

## Cú pháp

```jsx
const [state, dispatch] = useReducer(reducer, stateBanDau);
```

| Thành phần    | Vai trò                                             |
| ------------- | --------------------------------------------------- |
| `state`       | Trạng thái hiện tại — đọc để hiển thị lên giao diện |
| `dispatch`    | Hàm gửi action — thay cho `setState`                |
| `reducer`     | Hàm xử lý action, trả về state mới                  |
| `stateBanDau` | Giá trị state khi component mount lần đầu           |

**Cấu trúc một reducer:**

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "HANH_DONG_A":
      return { ...state /* thay đổi tương ứng */ };

    case "HANH_DONG_B":
      return { ...state /* thay đổi tương ứng */ };

    default:
      return state; // Không khớp action nào → giữ nguyên state
  }
}
```

**Quy tắc bắt buộc:** Reducer phải luôn trả về state **mới** (object mới, không sửa trực tiếp `state` cũ) — giống nguyên tắc immutability của `useState`.

## So sánh useState và useReducer

|                   | useState                                            | useReducer                                                        |
| ----------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| Cách cập nhật     | `setValue(newValue)`                                | `dispatch({ type, payload })`                                     |
| Nơi chứa logic    | Rải rác trong component, mỗi nơi gọi setState riêng | Tập trung trong 1 hàm reducer                                     |
| Số lượng state    | Phù hợp với 1 vài state độc lập                     | Phù hợp khi nhiều state liên quan, cùng thay đổi theo 1 hành động |
| Khả năng theo dõi | Khó biết chính xác có những hành động nào đã xảy ra | Dễ theo dõi — mọi thay đổi đều đi qua action có tên rõ ràng       |

## Khi nào dùng useReducer

```
State đơn giản, độc lập với nhau                    →  useState
1 hành động cần thay đổi nhiều state cùng lúc        →  useReducer
Logic cập nhật có nhiều nhánh, nhiều điều kiện khác nhau  →  useReducer
Cần biết rõ "cái gì vừa xảy ra" để debug dễ hơn      →  useReducer
```

**Các tình huống thực tế thường dùng useReducer:**

- Quản lý form nhiều bước, nhiều trường dữ liệu liên quan
- Quản lý giỏ hàng — thêm, xóa, sửa số lượng, tính tổng
- Quản lý trạng thái gọi API — loading, success, error đi cùng nhau
- Quản lý trạng thái có nhiều hành động lặp lại (game, wizard, stepper)

> `useReducer` không thay thế hoàn toàn `useState`. Phần lớn trường hợp `useState` vẫn đủ dùng. Chỉ chuyển sang `useReducer` khi cảm thấy việc quản lý nhiều `useState` riêng lẻ đang gây khó kiểm soát hoặc dễ sai sót.

## Tóm tắt

```
useReducer(reducer, stateBanDau)
  state      →  Trạng thái hiện tại
  dispatch   →  Gửi yêu cầu thay đổi: dispatch({ type: '...', payload: ... })
  reducer    →  Hàm nhận action, trả về state mới — phải luôn trả về object mới

Dùng khi: nhiều state liên quan, 1 hành động ảnh hưởng nhiều state cùng lúc,
          hoặc logic cập nhật có nhiều nhánh cần rõ ràng, dễ theo dõi.
```
