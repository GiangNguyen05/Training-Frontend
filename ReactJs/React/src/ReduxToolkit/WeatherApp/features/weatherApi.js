import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { mapWeatherCode } from "../utils/weatherCode";

let favoritesStore = [];

export const weatherApi = createApi({
  reducerPath: "weatherApi",

  baseQuery: fakeBaseQuery(),
  tagTypes: ["Weather", "Favorite"],
  endpoints: (builder) => ({
    getWeather: builder.query({
      async queryFn(city) {
        try {
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              city,
            )}&count=1&language=vi`,
          );
          const geoData = await geoRes.json();
          const place = geoData.results?.[0];

          if (!place) {
            return {
              error: {
                status: 404,
                data: `Không tìm thấy thành phố "${city}"`,
              },
            };
          }

          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true`,
          );

          if (!weatherRes.ok) {
            return {
              error: {
                status: weatherRes.status,
                data: "Không lấy được dữ liệu thời tiết",
              },
            };
          }

          const weatherData = await weatherRes.json();
          const { temperature, weathercode } = weatherData.current_weather;
          const { condition, icon } = mapWeatherCode(weathercode);

          return {
            data: {
              city: place.country
                ? `${place.name}, ${place.country}`
                : place.name,
              temperature: Math.round(temperature),
              condition,
              icon,
            },
          };
        } catch (err) {
          return { error: { status: "FETCH_ERROR", data: err.message } };
        }
      },
      providesTags: (result, error, city) => [{ type: "Weather", id: city }],
    }),

    getFavorites: builder.query({
      queryFn: () => ({ data: favoritesStore }),
      providesTags: ["Favorite"],
    }), // đọc danh sách thành phố yêu thích (mock trong bộ nhớ)

    addFavorite: builder.mutation({
      queryFn: (city) => {
        const exists = favoritesStore.some((f) => f.city === city);
        if (!exists) favoritesStore = [...favoritesStore, { city }];
        return { data: { city } };
      },
      invalidatesTags: ["Favorite"],
    }), // ghi thêm thành phố vào yêu thích
  }),
});

export const {
  useGetWeatherQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
} = weatherApi;
