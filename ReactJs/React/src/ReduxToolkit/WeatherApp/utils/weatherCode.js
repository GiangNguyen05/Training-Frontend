const WMO_MAP = {
  0: { condition: "Trời quang", icon: "sun" },
  1: { condition: "Ít mây", icon: "sun" },
  2: { condition: "Có mây", icon: "cloud" },
  3: { condition: "Nhiều mây", icon: "cloud" },
  45: { condition: "Sương mù", icon: "cloud" },
  48: { condition: "Sương mù đóng băng", icon: "cloud" },
  51: { condition: "Mưa phùn nhẹ", icon: "rain" },
  53: { condition: "Mưa phùn", icon: "rain" },
  55: { condition: "Mưa phùn dày", icon: "rain" },
  61: { condition: "Mưa nhẹ", icon: "rain" },
  63: { condition: "Mưa vừa", icon: "rain" },
  65: { condition: "Mưa to", icon: "rain" },
  71: { condition: "Tuyết rơi nhẹ", icon: "snow" },
  73: { condition: "Tuyết rơi vừa", icon: "snow" },
  75: { condition: "Tuyết rơi dày", icon: "snow" },
  80: { condition: "Mưa rào nhẹ", icon: "rain" },
  81: { condition: "Mưa rào", icon: "rain" },
  82: { condition: "Mưa rào mạnh", icon: "rain" },
  95: { condition: "Dông", icon: "storm" },
  96: { condition: "Dông kèm mưa đá", icon: "storm" },
  99: { condition: "Dông mạnh kèm mưa đá", icon: "storm" },
};

export function mapWeatherCode(code) {
  return WMO_MAP[code] ?? { condition: "Không rõ", icon: "cloud" };
}
