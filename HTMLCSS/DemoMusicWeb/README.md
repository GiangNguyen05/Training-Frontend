# Music Landing Page · Design & UI Documentation

[Template](https://www.figma.com/design/cDHO3ya1mLZmpvKCluUomp/Template-MusicWeb?node-id=0-1&p=f&t=dGVrfq1gxY2lguPv-0)

## Tổng quan

---

| Breakpoint | Range          | Container               | Body font |
| ---------- | -------------- | ----------------------- | --------- |
| Mobile     | `< 768px`      | `100%` — padding `20px` | `15px`    |
| Tablet     | `768 – 1023px` | `100%` — padding `32px` | `16px`    |
| Desktop    | `>= 1024px`    | `max 1280px`            | `17px`    |

---

## Bố cục UI

### Mobile (base)

| #   | Block     | Layout mobile (BASE)                                                               | Cấu trúc CSS gốc                                              |
| --- | --------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Header    | Logo trái + Hamburger phải. Nav ẩn (`hidden`). Menu mobile = drawer dọc khi toggle | `display:flex; justify-content:space-between`                 |
| 2   | Hero      | Stack dọc: Copy → Player card → Stats                                              | `display:flex; flex-direction:column; gap:32px`               |
| 3   | Playlists | Scroll-snap rail ngang (1.3 card lộ ra để gợi vuốt)                                | `display:flex; overflow-x:auto; scroll-snap-type:x mandatory` |
| 4   | Genres    | Grid 2 cột                                                                         | `display:grid; grid-template-columns:repeat(2,1fr); gap:12px` |
| 5   | Features  | Stack 1 cột (4 card xếp dọc)                                                       | `display:grid; grid-template-columns:1fr; gap:20px`           |
| 6   | Pricing   | Stack 1 cột (3 tier xếp dọc, featured KHÔNG scale)                                 | `display:grid; grid-template-columns:1fr; gap:20px`           |
| 7   | Footer    | Stack 1 cột (brand → 3 cột link xếp dọc)                                           | `display:flex; flex-direction:column; gap:32px`               |

---

### Tablet

| #   | Block     | BASE (mobile)     | → TABLET đổi thành                                              | Lý do              |
| --- | --------- | ----------------- | --------------------------------------------------------------- | ------------------ |
| 1   | Header    | Hamburger, nav ẩn | Nav hiện ngang (`display:flex`), bỏ hamburger, thêm CTA button  | Đủ chỗ ngang       |
| 2   | Hero      | Stack dọc         | 2 cột row (`flex-direction:row`), copy `1.2fr` / player `1fr`   | Tận dụng width     |
| 3   | Playlists | Scroll-snap rail  | Grid 3 cột (`grid-template-columns:repeat(3,1fr)`), bỏ overflow | Đủ chỗ hiện 3 card |
| 4   | Genres    | 2 cột             | 4 cột                                                           | Pill nhỏ, nhân đôi |
| 5   | Features  | 1 cột             | 2×2 grid (`repeat(2,1fr)`)                                      | 4 card cân đối     |
| 6   | Pricing   | 1 cột             | 3 cột (`repeat(3,1fr)`), featured chưa scale                    | Đủ chỗ 3 tier      |
| 7   | Footer    | Stack dọc         | Row (`flex-direction:row`), brand chiếm 40%                     | Cân bằng ngang     |

### Desktop

| #   | Block     | TABLET (≥768px)       | ➜ DESKTOP (≥1024px) đổi thành                                 | Lý do                                               |
| --- | --------- | --------------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| 1   | Header    | Nav ngang, gap `28px` | Gap `36px`, hover underline neon                              | Thoáng hơn, có chuột → cần hover affordance         |
| 2   | Hero      | 2 cột, gap `32px`     | Gap `64px`, sun bg lớn hơn (`480px`), player card max `380px` | Tăng visual weight, khai thác chiều rộng `1280px`   |
| 3   | Playlists | Grid `3 cột`          | Grid `4 cột`                                                  | Tận dụng container `1280px`, hiện đủ hàng đầu       |
| 4   | Genres    | `4 cột`               | `6 cột`                                                       | Hiện đủ 12 pill trong `2 hàng` gọn gàng             |
| 5   | Features  | `2×2`                 | `4×1 row`                                                     | Hàng ngang đẹp hơn, scan nhanh hơn                  |
| 6   | Pricing   | 3 cột flat            | 3 cột + featured `scale(1.05)` + glow                         | Wow effect; mobile/tablet không scale để tránh tràn |
| 7   | Footer    | Row 4 phần đều        | Grid `2fr 1fr 1fr 1fr`                                        | Brand block nổi bật, sitemap gọn về phải            |

## Chi tiết từng Block

### Header

| Property    | Mobile            | Tablet             | Desktop    |
| ----------- | ----------------- | ------------------ | ---------- |
| Nav links   | Ẩn                | `flex`, gap `28px` | Gap `36px` |
| Hamburger   | Hiện              | Ẩn                 | Ẩn         |
| CTA button  | Ẩn                | Hiện               | Hiện       |
| Height      | `64px`            | `64px`             | `76px`     |
| Mobile menu | Drawer dọc khi mở | Disabled           | Disabled   |

---

### Hero

| Property    | Mobile                      | Tablet             | Desktop        |
| ----------- | --------------------------- | ------------------ | -------------- |
| Layout      | Stack dọc (`copy → player`) | Row flex `1.2 / 1` | Row gap `64px` |
| Padding Y   | `48/64px`                   | `64/96px`          | `96/128px`     |
| H1          | `clamp(28→72px)`            | `~8vw` tự scale    | Tự scale       |
| Player card | Full width                  | Max `320px`        | Max `380px`    |
| Sun bg      | Nhỏ, lệch                   | `360×360`          | `480×480`      |

---

### Featured Playlists

| Property | Mobile                                 | Tablet         | Desktop      |
| -------- | -------------------------------------- | -------------- | ------------ |
| Layout   | Scroll-snap rail ngang (`1.3` card hé) | Grid `3 cột`   | Grid `4 cột` |
| Mục đích | Swipe quen tay native                  | Preview đầy đủ | Catalog rộng |

---

### Genres

| Property     | Mobile | Tablet | Desktop |
| ------------ | ------ | ------ | ------- |
| Cột          | `2`    | `4`    | `6`     |
| Aspect ratio | `16/9` | `16/9` | `16/9`  |
| Gap          | `12px` | `12px` | `16px`  |

---

### Features (USP)

| Property     | Mobile          | Tablet               | Desktop       |
| ------------ | --------------- | -------------------- | ------------- |
| Cột          | `1` (stack)     | `2 × 2`              | `4 × 1` hàng  |
| Section-head | Căn trái, stack | Row, `space-between` | Row, gap rộng |

---

### Pricing

| Property     | Mobile        | Tablet            | Desktop                          |
| ------------ | ------------- | ----------------- | -------------------------------- |
| Cột          | `1` stack     | `3` cột bằng nhau | `3` cột + featured `scale(1.05)` |
| Padding card | `28px`        | `28px`            | `36/28px`                        |
| Featured nổi | Border + glow | Cùng cấp          | `scale(1.05)` nhô lên            |

---

### Footer

| Property   | Mobile        | Tablet              | Desktop    |
| ---------- | ------------- | ------------------- | ---------- |
| Grid       | `1` cột stack | `2fr 1fr 1fr 1fr`   | Gap `64px` |
| Bottom bar | Stack dọc     | Row `space-between` | Row        |
