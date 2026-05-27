import { CityWeather } from "@/types/weather";

export function weatherQueryKey(cityName: string) {
  return ["weather", cityName.toLowerCase()] as const;
}

export async function fetchCityWeather(cityName: string) {
  const response = await fetch(`/api/weather/${encodeURIComponent(cityName)}`);

  if (!response.ok) {
    throw new Error("Unable to load weather data");
  }

  return (await response.json()) as CityWeather;
}
