"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCityWeather, weatherQueryKey } from "@/services/weatherClientService";

const WEATHER_REFETCH_INTERVAL_MS = 5 * 60 * 1000;
const WEATHER_STALE_TIME_MS = 60 * 1000;

export function useCityWeather(cityName: string) {
  const normalizedCityName = cityName.toLowerCase();

  return useQuery({
    queryKey: weatherQueryKey(normalizedCityName),
    queryFn: () => fetchCityWeather(normalizedCityName),
    refetchInterval: WEATHER_REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    staleTime: WEATHER_STALE_TIME_MS,
  });
}
