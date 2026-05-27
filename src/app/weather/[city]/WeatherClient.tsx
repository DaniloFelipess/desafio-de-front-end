"use client";

import { City, CityWeather } from "@/types/weather";
import { useCityWeather } from "./useCityWeather";
import { WeatherPanel } from "./(components)/WeatherPanel";
import LoadingWeather from "./loading";

type WeatherClientProps = {
  city: City;
  initialWeather?: CityWeather;
};

export function WeatherClient({ city, initialWeather }: WeatherClientProps) {
  const { data: weather, isPending, isError } = useCityWeather(
    city.name,
    initialWeather,
  );

  if (isPending && !weather) {
    return <LoadingWeather />;
  }

  return (
    <WeatherPanel
      city={city}
      isError={isError}
      isPending={isPending}
      weather={weather}
    />
  );
}
