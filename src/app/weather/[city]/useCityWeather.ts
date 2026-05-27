"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCityWeather, weatherQueryKey } from "@/services/weatherClientService";
import { CityWeather } from "@/types/weather";

export function useCityWeather(cityName: string, initialWeather?: CityWeather) {
  const normalizedCityName = cityName.toLowerCase();

  return useQuery({
    queryKey: weatherQueryKey(normalizedCityName),
    queryFn: () => fetchCityWeather(normalizedCityName),
    initialData: initialWeather,
  });
}
