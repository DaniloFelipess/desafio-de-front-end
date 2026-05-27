import { CityWeather } from "@/types/weather";
import { Skeleton } from "./Skeleton";
import { getConditionLabel } from "./weatherDisplay";

type WeatherHeaderProps = {
  fallbackCityName: string;
  isError: boolean;
  weather?: CityWeather;
};

export function WeatherHeader({
  fallbackCityName,
  isError,
  weather,
}: WeatherHeaderProps) {
  return (
    <>
      <h1 className="text-[30px] leading-none font-light tracking-normal md:text-[34px]">
        {weather?.city.name ?? fallbackCityName}
      </h1>
      <p className="mt-2 text-[13px] leading-none font-light opacity-75 md:text-[14px]">
        {isError ? (
          "Unavailable"
        ) : weather ? (
          getConditionLabel(weather.current.condition)
        ) : (
          <Skeleton className="mx-auto h-3 w-14" />
        )}
      </p>
    </>
  );
}
