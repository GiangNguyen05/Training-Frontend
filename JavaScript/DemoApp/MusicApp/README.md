# MusicApp

---

## Cấu Trúc Dự Án

```
src/
├── types/
│   └── index.ts          ← Khuôn mẫu dữ liệu toàn app
├── data/
│   └── songs.ts          ← Danh sách bài hát
├── utils/
│   └── helpers.ts        ← Hàm tiện ích
├── hooks/
│   └── usePlayer.ts      ← Logic điều khiển player
├── components/
│   ├── SongCard.tsx      ← Hiển thị 1 bài hát
│   └── PlayerBar.tsx     ← Thanh player dưới cùng
└── App.tsx               ← Component gốc, gộp tất cả
```

**Luồng phụ thuộc — file nào import từ file nào:**

```
types/        ← không import từ đâu trong app
data/         ← import từ types
utils/        ← import từ types
hooks/        ← import từ types + utils
components/   ← import từ types + utils
App.tsx       ← import từ tất cả
```

## File 1 — `types/index.ts`

**Vai trò:** Khai báo toàn bộ Interface và Type cho app. Mọi file khác đều import từ đây.

### Interface Song — hình dạng dữ liệu bài hát

```ts
export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number; // tính bằng giây, vd: 212 = 3 phút 32 giây
  genre: string;
  cover: string; // emoji thay cho ảnh thật
  url: string;
}
```

Tất cả dữ liệu bài hát trong app đều phải tuân theo cấu trúc này. Nếu thiếu trường hoặc sai kiểu → TypeScript báo lỗi ngay.

### Type PlayerStatus — trạng thái player

```ts
export type PlayerStatus = "playing" | "paused" | "stopped";
```

Chỉ 3 giá trị được phép. Nếu gán `"loading"` hay bất kỳ giá trị nào khác → lỗi ngay. Đây là lý do dùng `type` thay vì `string` — tránh gán nhầm giá trị không hợp lệ.

### Type Volume

```ts
export type Volume = number; // 0 đến 100
```

Đặt tên riêng để code dễ đọc hơn. Khi thấy `Volume` trong code, người đọc biết ngay đây là số âm lượng, không phải số bất kỳ.

### Interface SongCardProps — props của component SongCard

```ts
export interface SongCardProps {
  song: Song; // bài hát cần hiển thị
  isActive: boolean; // đang phát bài này không?
  onSelect: (song: Song) => void; // hàm gọi khi người dùng click
}
```

`onSelect: (song: Song) => void` nghĩa là: truyền vào một hàm, hàm đó nhận `Song` và không trả về gì. Khi component cha truyền sai kiểu hàm → lỗi ngay.

### Interface PlayerBarProps — props của component PlayerBar

```ts
export interface PlayerBarProps {
  song: Song | null; // null = chưa chọn bài nào
  status: PlayerStatus; // đang phát / dừng / tắt
  volume: Volume; // 0-100
  progress: number; // 0-100, bao nhiêu % đã phát
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolumeChange: (v: Volume) => void;
  onSeek: (p: number) => void;
}
```

`song: Song | null` — khi mới vào app chưa chọn bài, song là `null`. Component phải xử lý cả 2 trường hợp.

### Interface ApiResponse\<T\> — Generic wrapper

```ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}
```

`T` là placeholder — khi dùng thực tế TypeScript tự điền kiểu vào:

- `ApiResponse<Song>` → `data` là `Song`
- `ApiResponse<Song[]>` → `data` là `Song[]`

Chỉ cần viết 1 interface dùng được cho mọi loại API response.

---

## File 2 — `data/songs.ts`

**Vai trò:** Chứa dữ liệu bài hát tĩnh. Trong dự án thực tế, file này sẽ được thay bằng API call.

```ts
import { Song } from "../types"

export const SONGS: Song[] = [
  { id: 1, title: "Đi Về Nhà", artist: "Đen Vâu", duration: 212, genre: "Rap", cover: "🏠", url: "#" },
  { id: 2, title: "Mộng Du",   artist: "Tăng Duy Tân", duration: 198, genre: "Pop", cover: "🌙", url: "#" },
  ...
]
```

`SONGS: Song[]` — khai báo rõ đây là mảng Song. Nếu thêm bài mới thiếu trường `genre` hay `duration` → TypeScript báo lỗi ngay tại dòng đó, không cần chạy app mới biết.

Lý do tách ra file riêng: khi cần đổi nguồn dữ liệu (từ tĩnh sang API), chỉ sửa 1 file này, không cần đụng vào component nào khác.

---

## File 3 — `utils/helpers.ts`

**Vai trò:** Các hàm thuần túy — nhận vào, xử lý, trả về. Không có React, không có state, không có UI.

### formatTime — chuyển giây thành chuỗi "3:32"

```ts
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
```

Nhận `number`, trả về `string`. Khai báo rõ kiểu nên truyền sai → lỗi ngay:

```ts
formatTime("212"); //  Error: string không phải number
formatTime(212); //  "3:32"
```

`padStart(2, "0")` đảm bảo giây luôn 2 chữ số: `"3:05"` thay vì `"3:5"`.

### filterByGenre — lọc bài theo thể loại (Generic)

```ts
export function filterByGenre<T extends { genre: string }>(
  items: T[],
  genre: string,
): T[] {
  if (genre === "All") return items;
  return items.filter((item) => item.genre === genre);
}
```

`T extends { genre: string }` — T là bất kỳ kiểu nào, miễn là có trường `genre: string`. Nhờ vậy hàm này dùng được cho `Song[]`, `Album[]`, hay bất kỳ mảng nào có trường `genre` — không cần viết lại.

### getNextSong / getPrevSong — tìm bài kế tiếp / trước

```ts
export function getNextSong(songs: Song[], currentId: number): Song {
  const idx = songs.findIndex((s) => s.id === currentId);
  return songs[(idx + 1) % songs.length];
}
```

`% songs.length` — phép chia lấy dư, đảm bảo khi đang ở bài cuối, next sẽ quay về bài đầu. Ví dụ: 5 bài, đang ở index 4 → `(4+1) % 5 = 0` → quay về đầu.

---

## File 4 — `hooks/usePlayer.ts`

**Vai trò:** Toàn bộ logic điều khiển player — không có JSX, chỉ state và side effects. Component chỉ cần gọi hook và render.

### Interface UsePlayerReturn — kiểu trả về của hook

```ts
interface UsePlayerReturn {
  currentSong: Song | null;
  status: PlayerStatus;
  progress: number;
  volume: Volume;
  selectSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (percent: number) => void;
  changeVolume: (v: Volume) => void;
}
```

Khai báo kiểu trả về rõ ràng để component dùng hook biết chính xác nhận được gì. VS Code tự gợi ý đầy đủ khi gõ.

### 4 State

```ts
const [currentSong, setCurrentSong] = useState<Song | null>(null);
const [status, setStatus] = useState<PlayerStatus>("stopped");
const [progress, setProgress] = useState<number>(0);
const [volume, setVolume] = useState<Volume>(80);
```

| State         | Kiểu           | Giá trị ban đầu | Ý nghĩa                         |
| ------------- | -------------- | --------------- | ------------------------------- |
| `currentSong` | `Song \| null` | `null`          | Bài đang phát, null = chưa chọn |
| `status`      | `PlayerStatus` | `"stopped"`     | Trạng thái player               |
| `progress`    | `number`       | `0`             | % đã phát (0-100)               |
| `volume`      | `Volume`       | `80`            | Âm lượng (0-100)                |

### useRef — giữ interval ID

```ts
const intervalRef = useRef<number | null>(null);
```

`setInterval` trả về một ID số nguyên. Lưu vào `useRef` thay vì `useState` vì:

- Không cần re-render khi ID thay đổi
- Giữ được giá trị qua các lần render
- Dùng để `clearInterval` khi cần dừng

### useEffect — tự động chạy/dừng progress

```ts
useEffect(() => {
  // Dừng interval cũ trước
  if (intervalRef.current) clearInterval(intervalRef.current);

  if (status === "playing" && currentSong) {
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSong(getNextSong(songs, currentSong.id)); // tự chuyển bài
          return 0;
        }
        return prev + 100 / currentSong.duration; // tăng % mỗi giây
      });
    }, 1000);
  }

  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current); // cleanup
  };
}, [status, currentSong]);
```

Chạy lại mỗi khi `status` hoặc `currentSong` thay đổi:

- `status` đổi sang `"playing"` → tạo interval mới, tăng progress mỗi giây
- `status` đổi sang `"paused"` → xoá interval, progress đứng yên
- `currentSong` thay đổi → reset interval cho bài mới

`return () => clearInterval(...)` là cleanup function — tự động chạy trước khi effect chạy lại hoặc khi component bị xoá. Không có dòng này sẽ bị memory leak.

### Actions — các hàm điều khiển

```ts
function selectSong(song: Song) {
  setCurrentSong(song); // đặt bài mới
  setStatus("playing"); // bắt đầu phát
  setProgress(0); // reset về đầu
}

function play() {
  if (!currentSong) return; // Type Narrowing — không làm gì nếu chưa chọn bài
  setStatus("playing");
}

function next() {
  if (!currentSong) return; // Type Narrowing
  setCurrentSong(getNextSong(songs, currentSong.id));
  setProgress(0);
}
```

---

## File 5 — `components/SongCard.tsx`

**Vai trò:** Hiển thị 1 bài hát trong danh sách. Nhận props, render UI, báo lên khi được click.

```tsx
export function SongCard({ song, isActive, onSelect }: SongCardProps) {
  return (
    <div onClick={() => onSelect(song)}>
      <div>{song.cover}</div>
      <div>
        <div>{song.title}</div>
        <div>
          {song.artist} · {song.genre}
        </div>
      </div>
      <div>{formatTime(song.duration)}</div>
    </div>
  );
}
```

### Điểm quan trọng

**`onClick={() => onSelect(song)}`** — Component không tự xử lý logic "click vào bài này thì làm gì". Nó chỉ báo lên component cha qua `onSelect`. Cha quyết định làm gì tiếp. Đây là nguyên tắc quan trọng trong React: component con không nên tự quyết định logic, chỉ báo sự kiện lên cha.

**`isActive`** — App.tsx so sánh `currentSong?.id === song.id` rồi truyền xuống. SongCard không cần biết bài nào đang phát, chỉ cần biết bài của nó có đang active không.

**`formatTime(song.duration)`** — Gọi hàm từ `utils/helpers.ts`. Component không tự tính toán, nhờ utils xử lý.

---

## File 6 — `components/PlayerBar.tsx`

**Vai trò:** Thanh player cố định ở dưới cùng. Phức tạp hơn SongCard vì xử lý nhiều events và có Type Narrowing.

### Type Narrowing — xử lý song có thể null

```tsx
export function PlayerBar({ song, ... }: PlayerBarProps) {

  // song có thể là null — phải xử lý trường hợp này trước
  if (!song) {
    return <div>Chọn một bài để bắt đầu ▶</div>
  }

  // Từ đây TypeScript biết chắc song là Song, không phải null
  // Có thể dùng song.title, song.cover... không cần kiểm tra thêm
  return (
    <div>
      <span>{song.cover}</span>   //  an toàn
      ...
    </div>
  )
}
```

Kỹ thuật này gọi là **early return** — xử lý trường hợp đặc biệt trước, code chính chạy sau. Giúp tránh lồng nhiều `if` vào nhau.

### Progress Bar — tính % vị trí click

```tsx
<div
  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()  // toạ độ div trên màn hình
    const percent = ((e.clientX - rect.left) / rect.width) * 100  // % vị trí click
    onSeek(Math.max(0, Math.min(100, percent)))  // giới hạn 0-100
  }}
>
```

`getBoundingClientRect()` trả về vị trí và kích thước của div. Lấy `clientX` (vị trí click) trừ `rect.left` (cạnh trái div) rồi chia cho `rect.width` (chiều rộng div) → ra % vị trí click trên thanh. `Math.max(0, Math.min(100, percent))` đảm bảo kết quả luôn trong khoảng 0-100.

### Volume Slider — Event onChange

```tsx
<input
  type="range"
  min={0}
  max={100}
  value={volume}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    onVolumeChange(Number(e.target.value))
  }
/>
```

`e.target.value` luôn là `string` dù input type là range — đây là quirk của HTML. Phải wrap bằng `Number()` để chuyển thành number trước khi truyền vào `onVolumeChange`.

---

## File 7 — `App.tsx`

**Vai trò:** Component gốc — kết nối tất cả lại. Không chứa logic phức tạp, chỉ gọi hook và render components.

### Gọi Custom Hook

```tsx
const {
  currentSong,
  status,
  progress,
  volume,
  selectSong,
  play,
  pause,
  next,
  prev,
  seek,
  changeVolume,
} = usePlayer(SONGS);
```

Toàn bộ logic player nằm trong `usePlayer`. App.tsx chỉ nhận kết quả và truyền xuống components. Nếu sau này cần sửa logic player, chỉ sửa `hooks/usePlayer.ts`, App.tsx không cần đụng vào.

### Lấy danh sách genre không trùng

```tsx
const genres: string[] = ["All", ...new Set(SONGS.map((s: Song) => s.genre))];
```

Từng bước:

1. `SONGS.map(s => s.genre)` → `["Rap", "Pop", "Pop", "Ballad", "Rap"]`
2. `new Set(...)` → `{"Rap", "Pop", "Ballad"}` — Set tự loại trùng
3. `[...new Set(...)]` → `["Rap", "Pop", "Ballad"]` — spread Set thành mảng
4. `["All", ...]` → `["All", "Rap", "Pop", "Ballad"]` — thêm "All" vào đầu

### Lọc bài theo genre đang chọn

```tsx
const filteredSongs: Song[] = filterByGenre(SONGS, activeGenre);
```

Gọi Generic function từ `utils/helpers.ts`. TypeScript biết kết quả là `Song[]` vì truyền vào `SONGS` kiểu `Song[]`.

### Truyền Props xuống PlayerBar

```tsx
<PlayerBar
  song={currentSong} // Song | null — từ hook
  status={status} // PlayerStatus — từ hook
  volume={volume} // Volume — từ hook
  progress={progress} // number — từ hook
  onPlay={play} // function từ hook
  onPause={pause}
  onNext={next}
  onPrev={prev}
  onVolumeChange={changeVolume}
  onSeek={seek}
/>
```

App.tsx là cầu nối: nhận state + actions từ `usePlayer` → truyền xuống `PlayerBar`. PlayerBar không biết hook tồn tại, chỉ nhận props và render.

---

## Luồng Hoạt Động Khi Người Dùng Click Bài Hát

```
1. Người dùng click vào SongCard
       ↓
2. SongCard gọi onSelect(song) — báo lên App
       ↓
3. App.tsx nhận sự kiện, gọi selectSong(song) từ usePlayer
       ↓
4. usePlayer: setCurrentSong(song), setStatus("playing"), setProgress(0)
       ↓
5. useEffect trong usePlayer phát hiện status đổi → tạo interval mới
       ↓
6. Mỗi giây interval chạy → setProgress tăng dần
       ↓
7. React re-render: PlayerBar nhận progress mới → thanh tiến độ di chuyển
       ↓
8. SongCard của bài được chọn nhận isActive=true → đổi màu xanh
```

---

## Tóm Tắt — Mỗi File Làm Gì

| File          | Làm gì                       | Không làm gì                   |
| ------------- | ---------------------------- | ------------------------------ |
| `types/`      | Khai báo khuôn mẫu dữ liệu   | Không chứa logic hay UI        |
| `data/`       | Cung cấp dữ liệu thô         | Không xử lý, không render      |
| `utils/`      | Tính toán, xử lý dữ liệu     | Không có state, không có React |
| `hooks/`      | Quản lý state + side effects | Không có JSX                   |
| `components/` | Render UI, xử lý events      | Không chứa business logic      |
| `App.tsx`     | Kết nối tất cả               | Không chứa logic phức tạp      |
