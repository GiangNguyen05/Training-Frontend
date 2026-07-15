import { CloudSun } from "lucide-react";
import WeatherSearch from "./WeatherSearch";
import FavoriteList from "./FavoriteList";
import "../styles/weather.css";

export default function MainApp() {
  return (
    <div className="page">
      <header className="page-header">
        <CloudSun size={24} strokeWidth={1.8} />
        <div>
          <h1>App Thời Tiết</h1>
        </div>
      </header>

      <main className="page-body">
        <WeatherSearch />
        <FavoriteList />
      </main>
    </div>
  );
}
