import { MapPin, X } from "lucide-react";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../features/weatherApi";

export default function FavoriteList() {
  const { data: favorites, isLoading } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();

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
            <button
              className="remove-fav-btn"
              onClick={() => removeFavorite(f.city)}
              aria-label={`Xoá ${f.city} khỏi yêu thích`}
            >
              <X size={13} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
