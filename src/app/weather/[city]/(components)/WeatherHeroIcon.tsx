import { WeatherData } from "@/types/weather";
import { Skeleton } from "./Skeleton";
import { WeatherIcon } from "./WeatherIcon";

type WeatherHeroIconProps = {
  current?: WeatherData;
};

export function WeatherHeroIcon({ current }: WeatherHeroIconProps) {
  return (
    <div className="mt-4 min-h-22 md:mt-5 md:min-h-26">
      {current ? (
        <WeatherIcon condition="sunny" />
      ) : (
        <Skeleton className="h-22 w-22 rounded-full md:h-26 md:w-26" />
      )}
    </div>
  );
}
