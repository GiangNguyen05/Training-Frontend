const ALL_SONGS = [
  { id: "s1", title: "Không thể say", artist: "HTH" },
  { id: "s2", title: "Trình", artist: "HTH" },
  { id: "s3", title: "Tìm em", artist: "HUNG" },
  { id: "s4", title: "Kẻ si tình", artist: "Quốc Thiên" },
  { id: "s5", title: "Kẻ si tình 2", artist: "Quốc Thiên" },
  { id: "s6", title: "Ánh nắng của anh", artist: "Đức Phúc" },
];

export function searchSongsApi(query, { signal } = {}) {
  return new Promise((resolve, reject) => {
    if (!query.trim()) {
      reject({
        isHttpError: true,
        status: 400,
        message: " trống",
      });
      return;
    }

    // mạng yếu -> query ngắn trả chậm
    const delay = 900 - Math.min(query.length, 6) * 120;

    const timer = setTimeout(() => {
      const results = ALL_SONGS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.artist.toLowerCase().includes(query.toLowerCase()),
      );
      resolve(results);
    }, delay);

    // Khi component huỷ request --> dừng timer và reject bằng AbortError
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Request đã bị huỷ", "AbortError"));
    });
  });
}
