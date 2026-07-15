import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from "lucide-react";

const ICONS = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

export default function WeatherIcon({ icon, size = 48 }) {
  const Icon = ICONS[icon] || Sun;
  return <Icon size={size} strokeWidth={1.6} />;
}
