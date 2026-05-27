"use client";

import { City } from "@/types/weather";
import { useCityWeather } from "./useCityWeather";
import { WeatherPanel } from "./(components)/WeatherPanel";
import { LoadingWeather } from "./(components)/LoadingWeather";

type WeatherClientProps = {
  city: City;
};

export function WeatherClient({ city }: WeatherClientProps) {
  const { data: weather, isPending, isError } = useCityWeather(city.name);

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
