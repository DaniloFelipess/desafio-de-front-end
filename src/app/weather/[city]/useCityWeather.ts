"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCityWeather, weatherQueryKey } from "@/services/weatherClientService";

export function useCityWeather(cityName: string) {
  const normalizedCityName = cityName.toLowerCase();

  return useQuery({
    queryKey: weatherQueryKey(normalizedCityName),
    queryFn: () => fetchCityWeather(normalizedCityName),
  });
}
