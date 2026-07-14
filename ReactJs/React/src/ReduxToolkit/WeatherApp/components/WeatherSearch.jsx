import { useState } from "react";
import { Search, Star, Loader2 } from "lucide-react";
import {
  useGetWeatherQuery,
  useAddFavoriteMutation,
} from "../features/weatherApi";
import WeatherIcon from "./WeatherIcon";

export default function WeatherSearch() {
  const [input, setInput] = useState("");
  const [city, setCity] = useState("");

  // skip khi chưa có tên tp
  const { data, isLoading, isFetching, isError, error } = useGetWeatherQuery(
    city,
    {
      skip: !city,
    },
  );

  const [addFavorite, { isLoading: isSaving }] = useAddFavoriteMutation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) setCity(input.trim());
  };

  return (
    <section className="search-card">
      <form className="search-form" onSubmit={handleSearch}>
        <Search size={16} className="search-icon" />
        <input
          placeholder="Nhập tên thành phố (VD: Hà Nội, Tokyo, Paris)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>

      {isLoading && (
        <div className="state-box">
          <Loader2 size={18} className="spin" />
          <span>Đang tải thời tiết...</span>
        </div>
      )}

      {isError && (
        <div className="state-box state-error">
          <span>{error.data ?? "Không tìm thấy thành phố này."}</span>
        </div>
      )}

      {data && (
        <div className="weather-result">
          {isFetching && (
            <span className="refresh-badge">🔄 đang cập nhật</span>
          )}
          <WeatherIcon icon={data.icon} />
          <h2>{data.city}</h2>
          <p className="temperature">{data.temperature}°C</p>
          <p className="condition">{data.condition}</p>

          <button
            className="fav-btn"
            disabled={isSaving}
            onClick={() => addFavorite(data.city)}
          >
            <Star size={14} />
            {isSaving ? "Đang lưu..." : "Lưu vào yêu thích"}
          </button>
        </div>
      )}
    </section>
  );
}
