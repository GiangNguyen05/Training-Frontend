import { MapPin } from "lucide-react";
import { useGetFavoritesQuery } from "../features/weatherApi";

export default function FavoriteList() {
  const { data: favorites, isLoading } = useGetFavoritesQuery();

  return (
    <section className="favorites-card">
      <h3>Thành phố yêu thích</h3>

      {isLoading && <p className="hint">Đang tải...</p>}

      {!isLoading && favorites?.length === 0 && (
        <p className="hint">Chưa có thành phố nào. Tìm và lưu ở trên nhé.</p>
      )}

      <ul className="favorite-list">
        {favorites?.map((f) => (
          <li key={f.city} className="favorite-row">
            <MapPin size={14} />
            <span>{f.city}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
